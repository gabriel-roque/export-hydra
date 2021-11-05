import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as open from 'open';

@Injectable()
export class FileService {
  async writeStream(
    pathFileName: string,
    buffer: Buffer | NodeJS.ArrayBufferView | string,
  ): Promise<boolean> {
    const writeStream = fs.createWriteStream(`output/${pathFileName}`);
    writeStream.write(buffer);
    writeStream.end();

    return new Promise((resolve) => {
      writeStream.on('finish', () => {
        return resolve(true);
      });
    });
  }

  openFile(path: string) {
    if (process.env.NODE_ENV === 'development') open(`output/${path}`);
  }
}
