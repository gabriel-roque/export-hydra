import { Author, Company, Tab } from './common.input';

import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class XlsxDataInput {
  @IsNotEmpty()
  author: Author;

  company: Company;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Tab)
  tabs: Tab[];
}
