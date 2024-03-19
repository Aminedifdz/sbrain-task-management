import { Injectable } from '@nestjs/common';
import { resolve } from 'path';

@Injectable()
export class Paths {
  static getParentDir(
    currentDir: string,
  ): string {
    return resolve(currentDir, '..');
  }
}
