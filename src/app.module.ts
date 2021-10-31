import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { CsvModule } from './modules/csv/csv.module';
import { KmlModule } from './modules/kml/kml.module';
import { XlsxModule } from './modules/xlsx/xlsx.module';

import { AppController } from './app.controller';
import { AuthMiddleware } from './src/middlewares/auth.middleware';

import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'output'),
    }),
    XlsxModule,
    CsvModule,
    KmlModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(XlsxModule);
    consumer.apply(AuthMiddleware).forRoutes(CsvModule);
    consumer.apply(AuthMiddleware).forRoutes(KmlModule);
  }
}
