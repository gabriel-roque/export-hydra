import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class Styles {
  line: {
    color: string;
    width: number;
  };
  polygon: {
    color: string;
  };
}

export class Folder {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Styles)
  styles: Styles;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Processs)
  processes: Processs[];
}

export class Vertice {
  @IsNotEmpty()
  lat: string | number;

  @IsNotEmpty()
  lng: string | number;
}

export class Description {
  @ValidateNested({ each: true })
  @Type(() => DataRowDescription)
  datas: DataRowDescription[];
}

export class DataRowDescription {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  value: string;

  link?: string;
}
export class Processs {
  @IsNotEmpty()
  folderId: string;

  @IsNotEmpty()
  number: string;

  coordinates?: string;

  @ValidateNested({ each: true })
  @Type(() => Description)
  description?: Description;

  descriptionHTML?: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Vertice)
  vertices: Vertice[];
}

export class KmlFolderData {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Folder)
  folders: Folder[];
}
