import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join, normalize } from 'path';
import AdmZip from 'adm-zip';

@Injectable()
export class ExportService {
  private readonly exportDir = join(process.cwd(), 'exports');

  constructor() {
    if (!existsSync(this.exportDir)) {
      mkdirSync(this.exportDir, { recursive: true });
    }
  }

  private sanitizePath(filePath: string): string {
    const normalized = normalize(filePath.replace(/\\/g, '/'));
    if (normalized.startsWith('..') || normalized.includes('/../') || normalized.startsWith('/')) {
      throw new BadRequestException(`Invalid file path in export: ${filePath}`);
    }
    return normalized.replace(/^\/+/, '');
  }

  async createZip(jobId: string, files: { path: string; content: string }[]): Promise<string> {
    const zip = new AdmZip();
    for (const file of files) {
      const safePath = this.sanitizePath(file.path);
      zip.addFile(safePath, Buffer.from(file.content, 'utf-8'));
    }
    const zipPath = join(this.exportDir, `${jobId}.zip`);
    zip.writeZip(zipPath);
    return zipPath;
  }

  getZipPath(jobId: string): string {
    return join(this.exportDir, `${jobId}.zip`);
  }
}
