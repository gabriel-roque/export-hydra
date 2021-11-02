import { Injectable } from '@nestjs/common';

import { FileService } from 'src/modules/file/services/file.service';

import { XlsxDataInput } from 'src/dto/xlsx.input';

import * as dayjs from 'dayjs';
import * as ExcelJS from 'exceljs';
import * as uuid from 'uuid';

@Injectable()
export class XlsxService {
  private workbook: ExcelJS.Workbook;

  constructor(private readonly fileService: FileService) {}

  private async createWorkBook(data: XlsxDataInput): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    this.workbook = await workbook.xlsx.readFile('static/template.xlsx');
    const presensationSheet = this.workbook.getWorksheet(1);

    workbook.title = 'Jazida Export';
    workbook.subject = data.author.email;
    workbook.created = new Date();
    workbook.creator = 'Jazida.com';
    workbook.description = `Exportação gerada por ${data.author.name} - ${data.author.email}`;
    workbook.lastModifiedBy = 'Jazida Exportação <jazida-export>';
    workbook.manager = 'Jazida Exportação <jazida-export>';

    if (data.company) {
      const companyCell = presensationSheet.getCell('G9');
      companyCell.value = data.company.name;
    } else {
      const labelCompanyCell = presensationSheet.getCell('F9');
      labelCompanyCell.value = '';
    }

    const userCell = presensationSheet.getCell('G10');
    userCell.value = data.author.name;

    const emailCell = presensationSheet.getCell('G11');
    emailCell.value = data.author.email;

    const dateCell = presensationSheet.getCell('G12');
    dateCell.value = dayjs().format('DD/MM/YYYY');
  }

  async export(data: XlsxDataInput) {
    await this.createWorkBook(data);

    const buffer =
      (await this.workbook.xlsx.writeBuffer()) as NodeJS.ArrayBufferView;
    const fileName = `${uuid.v4()}.xlsx`;

    await this.fileService.writeStream(fileName, buffer);
    return fileName;
  }
}
