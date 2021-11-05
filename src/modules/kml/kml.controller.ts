import { formatLinkDownload } from 'src/utils/urls.util';

import { Body, Controller, Post } from '@nestjs/common';

import { KmlService } from './services/kml.service';

import { KmlFolderData } from './dto/kml-folder.input';

@Controller('kml')
export class KmlController {
  constructor(private readonly kmlService: KmlService) {}

  @Post('folder')
  async exportByFolder(@Body() data: KmlFolderData): Promise<{ link: string }> {
    const fileName = await this.kmlService.exportByFolder(data);
    return { link: formatLinkDownload(fileName) };
  }
}
