import { Injectable } from '@nestjs/common';

import { FileService } from 'src/modules/file/services/file.service';

import { XlsxDataInput } from '../dto/xlsx.input';
import { Column, Row, Tab } from 'src/dto/common.input';

import * as dayjs from 'dayjs';
import * as ExcelJS from 'exceljs';
import * as uuid from 'uuid';

@Injectable()
export class XlsxService {
  private workbook: ExcelJS.Workbook;

  constructor(private readonly fileService: FileService) {}

  private async createWorkBookTemplate(data: XlsxDataInput): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    this.workbook = await workbook.xlsx.readFile('static/template.xlsx');
    const presensationSheet = this.workbook.getWorksheet(1);

    this.workbook.title = 'Jazida Export';
    this.workbook.subject = data.author.email;
    this.workbook.created = new Date();
    this.workbook.creator = 'Jazida.com';
    this.workbook.description = `Exportação gerada por ${data.author.name} - ${data.author.email}`;
    this.workbook.lastModifiedBy = 'Jazida Exportação <jazida-export>';
    this.workbook.manager = 'Jazida Exportação <jazida-export>';

    if (data?.company) {
      const companyCell = presensationSheet.getCell('E9');
      companyCell.value = data.company.name;
    } else {
      const labelCompanyCell = presensationSheet.getCell('D9');
      labelCompanyCell.value = '';
    }

    if (data?.group) {
      const groupCell = presensationSheet.getCell('E10');
      groupCell.value = data.group.name;
    } else {
      const labelgroupCell = presensationSheet.getCell('D10');
      labelgroupCell.value = '';
    }

    const userCell = presensationSheet.getCell('E11');
    userCell.value = data.author.name;

    const emailCell = presensationSheet.getCell('E12');
    emailCell.value = data.author.email;

    const dateCell = presensationSheet.getCell('E13');
    dateCell.value = dayjs().format('DD/MM/YYYY');
  }

  async export(data: XlsxDataInput): Promise<string> {
    await this.createWorkBookTemplate(data);

    data.tabs.forEach((tab) => {
      const sheet = this.createWorkSheet(tab);

      sheet.columns = this.setCollumns(tab.columns);
      this.setStylesCollumns(sheet);

      tab.rows.forEach((row, i) => {
        const objectRow = this.mapObjectRow(row);
        const rowInserted = sheet.insertRow(i + 2, { ...objectRow });

        Object.keys(row).forEach((prop) => {
          rowInserted.model.cells.forEach((cell) => {
            if (row[prop].value === cell.value) {
              if (row[prop].color)
                this.setColorCell(sheet, cell, row[prop].color);
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

  private createWorkSheet(tab: Tab): ExcelJS.Worksheet {
    return this.workbook.addWorksheet(tab.name, {
      properties: { tabColor: { argb: tab?.color } },
    });
  }

  private mapObjectRow(row: Row): any {
    let objectRow = {};
    Object.keys(row).map((prop) => {
      objectRow = { [prop]: row[prop].value, ...objectRow };
    });
    return objectRow;
  }

  private setCollumns(columns: Column[]): Partial<ExcelJS.Column>[] {
    return columns.map((column) => {
      return {
        key: column.key,
        header: column.value,
        width: column.width || 20,
      };
    });
  }

  private setStylesCollumns(sheet: ExcelJS.Worksheet): void {
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
  }

  private setColorCell(
    sheet: ExcelJS.Worksheet,
    cell: ExcelJS.CellModel,
    color: string,
  ): void {
    sheet.getCell(String(cell.address)).fill = {
      pattern: 'solid',
      type: 'pattern',
      fgColor: { argb: color },
    };
  }
}
