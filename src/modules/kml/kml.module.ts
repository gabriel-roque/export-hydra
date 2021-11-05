import { Module } from '@nestjs/common';

import { KmlService } from './services/kml.service';

import { FileModule } from '../file/file.module';
import { KmlController } from './kml.controller';

@Module({
  imports: [FileModule],
  providers: [KmlService],
  exports: [KmlService],
  controllers: [KmlController],
})
export class KmlModule {}
