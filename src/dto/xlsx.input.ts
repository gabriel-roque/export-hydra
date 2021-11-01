import { Author, Column, Company, Row } from './common.input';

import { IsNotEmpty } from 'class-validator';

export class XlsxDataInput {
  @IsNotEmpty()
  author: Author;

  company: Company;

  @IsNotEmpty()
  columns: Column[];

  @IsNotEmpty()
  rows: Row[];
}
