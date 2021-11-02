import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class Column {
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: string;

  width?: number;
}

export class Row {
  color?: string;
  bold?: boolean;
}

export class Author {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;
}

export class Company {
  @IsNotEmpty()
  name: string;
}

export class Tab {
  @IsNotEmpty()
  name: string;

  @IsString()
  color?: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Column)
  columns: Column[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Row)
  rows: Row[];
}
