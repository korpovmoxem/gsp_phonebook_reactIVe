export interface Organization {
    id: string;
    name: string;
    root?: true;
    organizationId?: string;
    children: Organization[];
}

export interface ExternalOrganizations {
    id: number;
    url: string;
    name: string;
    order: number;
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

interface Department {
    departmentId: string,
    organizationId: string,
    departmentName: string,
    employees: Employee[]
}

export interface EmployeesList {
    organizaionId: string,
    organizationName: string,
    departments: Department[]
}

export type CATEGORIES = "fullName" | "email" | "position" | "phone";

export interface EmployeeShort {
    id: string,
    organizationId: string,
    fullName: string,
}

export interface CurrentEmployeeInfo extends Employee {
    mobileNumberCorp: string,
    mobileNumberPersonal: string,
    workPlace: string,
    address: string,
    assistants: EmployeeShort[],
    managers: EmployeeShort[],
    [key: string]: any | undefined,
}

export interface EmployeesListTree {
    children: EmployeesListTree[],
    departmentId: string,
    departmentName: string,
    employees: Employee[],
    organizationId: string,
    organizationName: string,
}