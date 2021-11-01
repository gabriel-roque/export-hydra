import { IsNotEmpty } from 'class-validator';

export class Column {
  key: string;
  value: string;
  color?: string;
}

export class Row {
  color?: string;
  bold?: boolean;
}

export class Author {
  name: string;
  email: string;
  companyName?: string;
}

export class CommonData {
  @IsNotEmpty()
  author: Author;

  @IsNotEmpty()
  columns: Column[];

  @IsNotEmpty()
  rows: Row[];
}
