import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { XlsxService } from './services/xlsx.service';

import { FileModule } from '../file/file.module';
import { XlsxController } from './xlsx.controller';

import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  imports: [FileModule],
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
