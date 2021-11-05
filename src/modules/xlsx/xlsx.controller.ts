import { formatLinkDownload } from 'src/utils/urls.util';

import { Body, Controller, Post } from '@nestjs/common';

import { FileService } from '../file/services/file.service';
import { XlsxService } from './services/xlsx.service';

import { XlsxDataInput } from './dto/xlsx.input';

@Controller('xlsx')
export class XlsxController {
  constructor(
    private readonly xlsxService: XlsxService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  async export(@Body() data: XlsxDataInput): Promise<{ link: string }> {
    const fileName = await this.xlsxService.export(data);
    this.fileService.openFile(fileName);

    return { link: formatLinkDownload(fileName) };
  }
}
