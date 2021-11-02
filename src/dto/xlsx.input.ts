import { Author, Company, Tab } from './common.input';

import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

class Group {
  @IsNotEmpty()
  name: string;
}
export class XlsxDataInput {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Author)
  author: Author;

  @ValidateNested({ each: true })
  @Type(() => Company)
  company?: Company;

  @ValidateNested({ each: true })
  @Type(() => Group)
  group?: Group;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Tab)
  tabs: Tab[];
}
