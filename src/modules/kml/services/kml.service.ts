import { Injectable } from '@nestjs/common';

import { FileService } from 'src/modules/file/services/file.service';

import { TypeTemplates } from '../enum/templates.enum';

import { Description, KmlFolderData, Vertice } from '../dto/kml-folder.input';

import * as fs from 'fs';
import Handlebars from 'handlebars';
import * as uuid from 'uuid';

@Injectable()
export class KmlService {
  constructor(private readonly fileService: FileService) {
    this.registerPartials();
  }

  async exportByFolder(data: KmlFolderData) {
    data.folders.forEach((folder) => {
      folder.processes.forEach((process) => {
        process.coordinates = this.generateCoorinatesByVertices(
          process.vertices,
        );
        if (process.description) {
          process.descriptionHTML = this.generateDescrptionKml(
            process.description,
          );
        }
      });
    });

    const kml = this.buildKml(data, TypeTemplates.kmlByFolder);

    const fileName = `${uuid.v4()}.kmz`;
    await this.fileService.writeStream(fileName, kml);
    return fileName;
  }

  private generateDescrptionKml(desc: Description): string {
    const templateFile = this.loadTemplate('description-process');

    const view = Handlebars.compile(templateFile, { noEscape: true });
    return view({ ...desc });
  }

  private generateCoorinatesByVertices(vertices: Vertice[]): string {
    return vertices
      .map((vertice) => {
        return [vertice.lng, vertice.lat, 0].join(',');
      })
      .join(' ');
  }

  /* istanbul ignore next */
  private buildKml(data: any, template: TypeTemplates): string {
    const templateFile = this.loadTemplate(template);

    const view = Handlebars.compile(templateFile, { noEscape: true });
    return view(data);
  }

  /* istanbul ignore next */
  private registerPartials(): void {
    const PARTIALS_DIR = 'src/modules/kml/templates/partials';
    const files = fs.readdirSync(PARTIALS_DIR);

    files.forEach((file: string) => {
      const name = file.split(/[.]/g)[0];
      const partial = fs
        .readFileSync(`${PARTIALS_DIR}/${name}.hbs`)
        .toString('utf8');
      Handlebars.registerPartial(name, partial);
    });
  }

  /* istanbul ignore next */
  private loadTemplate(template: string): string {
    return fs
      .readFileSync(`src/modules/kml/templates/${template}.hbs`)
      .toString('utf8');
  }
}
