import { Body, Controller, Post } from '@nestjs/common';

import { XlsxService } from './services/xlsx.service';

import { XlsxDataInput } from 'src/dto/xlsx.input';

@Controller('xlsx')
export class XlsxController {
  constructor(private readonly xlsxService: XlsxService) {}

  @Post()
  async export(@Body() data: XlsxDataInput) {
    return await this.xlsxService.export(data);
  }
}
