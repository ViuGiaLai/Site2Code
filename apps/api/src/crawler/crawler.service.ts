import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CrawlerService {
  private readonly screenshotDir = path.join(process.cwd(), 'screenshots');

  constructor(private readonly prisma: PrismaService) {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async crawl(url: string) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      const sanitizedUrl = url.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50);
      const timestamp = Date.now();
      const screenshotFilename = `${sanitizedUrl}_${timestamp}.png`;
      const screenshotPath = path.join(this.screenshotDir, screenshotFilename);

      await page.screenshot({ path: screenshotPath, fullPage: true });

      const rawHtml = await page.content();
      const title = await page.title();
      const metaDescription = await page
        .$eval('meta[name="description"]', (el) => el.getAttribute('content'))
        .catch(() => null);

      const cleanedHtml = this.cleanHtml(rawHtml);

      const crawl = await this.prisma.crawl.create({
        data: { url, html: cleanedHtml, screenshotPath, title, metaDescription },
      });

      return { ...crawl };
    } finally {
      await browser.close();
    }
  }

  private cleanHtml(html: string): string {
    const $ = cheerio.load(html);

    $('script, style, noscript, iframe, svg, math').remove();

    $('*')
      .contents()
      .filter(function () {
        return this.type === 'comment';
      })
      .remove();

    $('[class]').each((_, el) => {
      const classes = $(el).attr('class')?.split(/\s+/) || [];
      const kept = classes.filter(
        (c) =>
          !c.startsWith('_') &&
          !c.startsWith('css-') &&
          !c.startsWith('sc-') &&
          !/^[a-z]{1,2}$/.test(c),
      );
      if (kept.length > 0) {
        $(el).attr('class', kept.join(' '));
      } else {
        $(el).removeAttr('class');
      }
    });

    $('[style]').removeAttr('style');
    $('[onclick]').removeAttr('onclick');
    $('[onload]').removeAttr('onload');
    $('[onerror]').removeAttr('onerror');
    $('[onmouseover]').removeAttr('onmouseover');
    $('[onmouseout]').removeAttr('onmouseout');

    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('data:')) {
        $(el).removeAttr('srcset');
        $(el).removeAttr('sizes');
      } else {
        $(el).remove();
      }
    });

    $('link[rel="preload"], link[rel="prefetch"], link[rel="dns-prefetch"], link[rel="preconnect"]').remove();

    return $.html();
  }
}
