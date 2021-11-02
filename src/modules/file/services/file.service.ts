import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as open from 'open';

@Injectable()
export class FileService {
  writeStream(
    pathFileName: string,
    buffer: Buffer | NodeJS.ArrayBufferView,
  ): void {
    const writeStream = fs.createWriteStream(`output/${pathFileName}`);
    writeStream.write(buffer);
    writeStream.end();
  }

  openFile(path: string) {
    if (process.env.NODE_ENV === 'development') open(`output/${path}`);
  }
}
