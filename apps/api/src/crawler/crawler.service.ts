import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { chromium, type Browser } from 'playwright';
import * as cheerio from 'cheerio';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaService } from '../prisma/prisma.service';
import { validateCrawlHost } from '../common/utils/url.util';

@Injectable()
export class CrawlerService implements OnModuleDestroy {
  private readonly logger = new Logger(CrawlerService.name);
  private readonly screenshotDir = path.join(process.cwd(), 'screenshots');
  private browser: Browser | null = null;
  private browserPromise: Promise<Browser> | null = null;

  constructor(private readonly prisma: PrismaService) {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close().catch(() => undefined);
      this.browser = null;
      this.browserPromise = null;
    }
  }

  private getBrowser(): Promise<Browser> {
    if (this.browser) return Promise.resolve(this.browser);
    if (!this.browserPromise) {
      this.browserPromise = chromium.launch({ headless: true }).then((b) => {
        this.browser = b;
        return b;
      });
    }
    return this.browserPromise;
  }

  async crawl(url: string) {
    const timeout = Number(process.env.CRAWL_TIMEOUT_MS || 25_000);
    const settleMs = Number(process.env.CRAWL_SETTLE_MS || 800);
    const captureScreenshot = process.env.CRAWL_SCREENSHOT !== 'false';

    const browser = await this.getBrowser();
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
      if (settleMs > 0) await page.waitForTimeout(settleMs);

      validateCrawlHost(page.url());

      let screenshotPath: string | null = null;
      if (captureScreenshot) {
        const sanitizedUrl = url.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50);
        const screenshotFilename = `${sanitizedUrl}_${Date.now()}.png`;
        screenshotPath = path.join(this.screenshotDir, screenshotFilename);
        await page.screenshot({ path: screenshotPath, fullPage: false });
      }

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
      await context.close();
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
