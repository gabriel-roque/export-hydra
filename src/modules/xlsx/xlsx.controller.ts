import { Body, Controller, Post } from '@nestjs/common';

import { XlsxDataInput } from 'src/dto/xlsx.input';

@Controller('xlsx')
export class XlsxController {
  @Post()
  async export(@Body() data: XlsxDataInput) {
    // TODO
  }
}
