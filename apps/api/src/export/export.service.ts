import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import AdmZip from 'adm-zip';

@Injectable()
export class ExportService {
  private readonly exportDir = join(process.cwd(), 'exports');

  constructor() {
    if (!existsSync(this.exportDir)) {
      mkdirSync(this.exportDir, { recursive: true });
    }
  }

  async createZip(jobId: string, files: { path: string; content: string }[]): Promise<string> {
    const zip = new AdmZip();
    for (const file of files) {
      zip.addFile(file.path, Buffer.from(file.content, 'utf-8'));
    }
    const zipPath = join(this.exportDir, `${jobId}.zip`);
    zip.writeZip(zipPath);
    return zipPath;
  }

  getZipPath(jobId: string): string {
    return join(this.exportDir, `${jobId}.zip`);
  }
}
