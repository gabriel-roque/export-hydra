import { IsNotEmpty } from 'class-validator';

export class XlsxDataInput {
  @IsNotEmpty()
  name: string;
}
