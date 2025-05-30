export interface Organization {
  id: string;
  name: string;
  root?: true;
  organizationId?: string;
  children: Organization[];
}

export interface Employee {
  id: string;
  fullNameRus: string;
  departmentId: string;
  organizationId: string;
  departmentName: string;
  organizationName: string;
  email: string | null;
  positionTitle: string
  telephoneNumberCorp: string;
  businessTrip: boolean;
  unavailable: boolean;
  photo: string | null;
}
