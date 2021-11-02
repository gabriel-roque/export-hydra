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

  async export(data: XlsxDataInput): Promise<string> {
    await this.createWorkBook(data);

    data.tabs.forEach((tab) => {
      const sheet = this.workbook.addWorksheet(tab.name, {
        properties: { tabColor: { argb: tab?.color } },
      });

      sheet.columns = tab.columns.map((column) => {
        return {
          key: column.key,
          header: column.value,
          width: column.width || 20,
        };
      });

      sheet.columns.forEach((col) => {
        col.eachCell((cell) => {
          const collumnCell = sheet.getCell(cell.address);

          collumnCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF00B365' },
          };

          collumnCell.font = {
            bold: true,
            name: 'Arial',
            color: { argb: 'FFFFFFFF' },
          };
        });
      });

      tab.rows.forEach((row, i) => {
        let objectRow = {};
        Object.keys(row).map((prop) => {
          objectRow = { [prop]: row[prop].value, ...objectRow };
        });

        const rowInserted = sheet.insertRow(i + 2, { ...objectRow });

        Object.keys(row).forEach((prop) => {
          rowInserted.model.cells.forEach((cell) => {
            if (row[prop].value === cell.value) {
              if (row[prop].color) {
                sheet.getCell(String(cell.address)).fill = {
                  pattern: 'solid',
                  type: 'pattern',
                  fgColor: { argb: row[prop].color },
                };
              }
            }
          });
        });
      });
    });

    const buffer =
      (await this.workbook.xlsx.writeBuffer()) as NodeJS.ArrayBufferView;
    const fileName = `${uuid.v4()}.xlsx`;

    await this.fileService.writeStream(fileName, buffer);
    return fileName;
  }
}
