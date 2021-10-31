/* eslint-disable @typescript-eslint/no-var-requires */
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus(): any {
    return {
      app: require('../package').name,
      version: require('../package').version,
      status: true,
    };
  }
}
