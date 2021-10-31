import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { XlsxService } from './services/xlsx.service';

import { XlsxController } from './xlsx.controller';

import { AuthMiddleware } from 'src/src/middlewares/auth.middleware';

@Module({
  providers: [XlsxService],
  exports: [XlsxService],
  controllers: [XlsxController],
})
export class XlsxModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'xlsx', method: RequestMethod.POST });
  }
}
