export interface Organization {
    id: string;
    name: string;
    root?: true;
    organizationId?: string;
    children: Organization[];
    treeId: string;
}

export interface ExternalOrganizations {
    id: number;
    url: string;
    name: string;
    order: number;
}

export interface IconObject {
    description: string;
    img: string
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
    statuses: IconObject[];
    achievements: IconObject[];
    photo: string;
}

interface Department {
    departmentId: string,
    organizationId: string,
    departmentName: string,
    employees: Employee[]
}

export interface EmployeesList {
    organizationId: string,
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
    workPlace: number,
    address: string,
    assistants: EmployeeShort[],
    managers: EmployeeShort[],
    externalNumberCorp: string,
    isEditAvailable: boolean;
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

export type ImageSize = '96' | '512'

export type EmployeePhotoData = {
    statuses: IconObject[];
    achievements: IconObject[];
    photo: string;
};
export type EmployeePhotoState = "loading" | "error" | EmployeePhotoData;
export type EmployeePhotoSizes = {
    small?: EmployeePhotoState;
    large?: EmployeePhotoState;
};

export type EmployeeState = {
    employeeData: Record<string, EmployeePhotoSizes>;
    loadEmployeeData: (employeeId: string, orgId: string, size: ImageSize) => void;
};