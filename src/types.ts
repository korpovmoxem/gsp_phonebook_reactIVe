export interface Organization {
  ID: string | number;
  Name: string;
  Children: Organization[];
  Filial: number | string;
  Inn: number;
  DotLevel: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
}