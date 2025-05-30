export interface Organization {
  id: string;
  name: string;
  children: Organization[];
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  mail: string;
  phone: string;
}