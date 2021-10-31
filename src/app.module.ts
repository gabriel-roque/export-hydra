import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { CsvModule } from './modules/csv/csv.module';
import { KmlModule } from './modules/kml/kml.module';
import { XlsxModule } from './modules/xlsx/xlsx.module';

import { AppController } from './app.controller';

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
export class AppModule {}
