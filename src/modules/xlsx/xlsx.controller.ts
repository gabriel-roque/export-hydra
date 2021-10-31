import { Body, Controller, Post } from '@nestjs/common';

import { XlsxDataInput } from './dto/data.input';

@Controller('xlsx')
export class XlsxController {
  @Post()
  async export(@Body() data: XlsxDataInput) {}
}
