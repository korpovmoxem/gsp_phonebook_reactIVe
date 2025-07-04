import { create } from 'zustand';
import getAvailableApiBase from "../utils/apiClient";
import {
  Organization,
  ExternalOrganizations,
  CATEGORIES,
  EmployeesList,
  CurrentEmployeeInfo,
  EmployeesListTree,
} from '../types';
import { toast } from 'react-toastify';
import { buildOrgIndexId, buildOrgIndexTreeId } from '../utils/buildOrgIndex';
import { OrgMap } from '../utils/buildOrgIndex';
import axios from 'axios';


interface OrgState {
    organizations: Organization[];
    externalOrganizations: ExternalOrganizations[];
    selectedOrgId: string | null;
    employees?: EmployeesListTree;
    isOrgLoading: boolean;
    isExternalOrgLoading: boolean;
    isEmpLoading: boolean;
    categories: CATEGORIES;
    search: string;
    employeesList: EmployeesList[];
    orgMap: OrgMap;
    orgMapId: OrgMap;
    isEmployeeInfoModalOpen: boolean;
    currentEmployeeInfo?: CurrentEmployeeInfo,
    isCurrentEmployeeLoading: boolean,
    isEditInformation: boolean,
    isLoadingCode: boolean,
    

    fetchTree: () => Promise<void>;
    fetchExternalTree: () => Promise<void>;
    selectOrg: (organizationId: string, departmentId: string | null, withChildren?: string) => Promise<void>;
    fetchEmployeesWithParams: (value: string, category: CATEGORIES) => Promise<void>;
    fetchCurrentEmployeeInfo: (idEmployee: string, idOrganization: string) => Promise<void>;

    setIsEmployeeInfoModalOpen: (currentState: boolean) => void;
    setIsEditInformation: (currentState: boolean) => void;

    fetchVerificatinCode: (idEmployee: string, idOrganization: string) => Promise<void>;

    saveEmployeeInfo: (personalMobile: string, cityPhone: string, workPlace: number | null, address: string, code: string) => Promise<void>; 

    // Для SearchBar
    fetchEmployeeForSearchBar: (searchValue: string, category: string) => Promise<void>;
    isEmployeeForSearchBarLoading: boolean;
    EmployeesListLimit: EmployeesList[]
}

export const useOrgStore = create<OrgState>((set, get) => ({
    organizations: [],
    externalOrganizations: [],
    selectedOrgId: null,
    employees: undefined,
    isOrgLoading: false,
    isExternalOrgLoading: false,
    isEmpLoading: true,
    categories: 'fullName' as CATEGORIES,
    search: '',
    employeesList: [],
    orgMap: new Map(),
    orgMapId: new Map(),
    isEmployeeInfoModalOpen: false,
    currentEmployeeInfo: undefined,
    isCurrentEmployeeLoading: false,
    isEditInformation: false,
    isLoadingCode: false,
    isEmployeeForSearchBarLoading: false,
    EmployeesListLimit: [],

    fetchExternalTree: async () => {
        set({ isExternalOrgLoading: true });
        try {
            const base = await getAvailableApiBase();
            const response = await fetch(`${base}/external/phonebook`);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                const data = await response.json();
            set({
                externalOrganizations: data.result,
                isExternalOrgLoading: false,
            });
        } catch (error: any) {
            console.error('Ошибка загрузки внешних организаций:', error.message);
            toast.error('Ошибка при загрузке внешних справочников');
            set({ isExternalOrgLoading: false });
        }
    },

    fetchTree: async () => {
        set({ isOrgLoading: true });


        const STORAGE_KEY = 'lastVisitDate';
        const ORGANIZATIONS_LIST = 'orgList';

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const storedDate = localStorage.getItem(STORAGE_KEY);

        if (!storedDate) {
            // Дата не сохранена — просто запоминаем текущую
            localStorage.setItem(STORAGE_KEY, today);
        } else if (storedDate !== today) {
            // Даты не совпадают → очищаем localStorage
            localStorage.removeItem(ORGANIZATIONS_LIST)
            localStorage.setItem(STORAGE_KEY, today);
        }

        try {
            const savedOrgList = localStorage.getItem(ORGANIZATIONS_LIST);
            if (!savedOrgList) {
                const base = await getAvailableApiBase();
                const response = await fetch(`${base}/organization/tree`);
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                const data = await response.json();
                localStorage.setItem(ORGANIZATIONS_LIST, JSON.stringify(data.result));

                const builtOrgMap = buildOrgIndexTreeId(data.result);
                const builtOrgMapId = buildOrgIndexId(data.result);
                set({
                    organizations: data.result,
                    orgMap: builtOrgMap,
                    orgMapId: builtOrgMapId,
                    isOrgLoading: false,
                });
            } else {
                const builtOrgMap = buildOrgIndexTreeId(JSON.parse(savedOrgList));
                const builtOrgMapId = buildOrgIndexId(JSON.parse(savedOrgList));
                set({
                    organizations: JSON.parse(savedOrgList),
                    orgMap: builtOrgMap,
                    orgMapId: builtOrgMapId,
                    isOrgLoading: false,
                });
            }
        } catch (error: any) {
            console.error('Ошибка загрузки организаций:', error.message);
            toast.error('Ошибка при загрузке организаций');
            set({ isOrgLoading: false });
        }
    },

    selectOrg: async (organizationId, departmentId, withChildren) => {
        set({employeesList: []})
        const targetId = departmentId || organizationId;
        set({ selectedOrgId: targetId, isEmpLoading: true });

        try {
            const base = await getAvailableApiBase();
            const url = new URL(`${base}/employee`);
            
            if (departmentId) url.searchParams.append('departmentId', departmentId);
            if (withChildren) {
                url.searchParams.append('withChildren', withChildren);
            }
            url.searchParams.append('organizationId', organizationId);
            const response = await fetch(url.toString());
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            const data = await response.json();

            set({
                employees: data.result,
                isEmpLoading: false,
            });
        } catch (error: any) {
            console.error('Ошибка загрузки сотрудников:', error.message);
            toast.error('Ошибка при загрузке сотрудников');
            set({ isEmpLoading: false });
        }
    },

    fetchEmployeesWithParams: async (value, category) => {
        set({ isEmpLoading: true, employeesList: [], selectedOrgId: null, employees: undefined });

        try {
            const base = await getAvailableApiBase();
            const response = await fetch(
            `${base}/employee/search?value=${value}&type=${category}`
            );
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            const data = await response.json();

            set({
                employeesList: data.result,
                isEmpLoading: false,
            });
        } catch (error: any) {
            console.error('Ошибка поиска сотрудников:', error.message);
            toast.error('Ошибка при поиске сотрудников');
            set({ isEmpLoading: false });
        }
    },

    setIsEmployeeInfoModalOpen: (currentState) =>{
        set({isEmployeeInfoModalOpen: currentState}) //, currentEmployeeInfo: undefined
        set({ isLoadingCode: false });
    },

    setIsEditInformation: (currentState) =>{
        set({isEditInformation: currentState})
        set({ isLoadingCode: false });
    },

    fetchCurrentEmployeeInfo: async (idEmployee, idOrganization) => {
        set({isCurrentEmployeeLoading: true})

        try {
            const base = await getAvailableApiBase();
            const response = await fetch(
            `${base}/employee/detail?id=${idEmployee}&organizationId=${idOrganization}`
            );
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            const data = await response.json();

            set({
                currentEmployeeInfo: data.result,
            });
        } catch (error: any) {
            console.error('Ошибка получения информации о сотруднике:', error.message);
            toast.error('Ошибка получения информации о сотруднике. Поробуйте позже');
        } finally {
            set({ isCurrentEmployeeLoading: false });
        }
    },

    fetchVerificatinCode: async (idEmployee, idOrganization) => {
        set({isLoadingCode: true})

        try {
            const base = await getAvailableApiBase();
            const response = await fetch(`${base}/employee/verification`, {
                method: 'POST',  
                headers: { 'Content-Type': 'application/json' },  
                body: JSON.stringify({
                    "id": idEmployee,
                    "organizationId": idOrganization
                })
            })
            
            if (!response.ok) {
                if (response.status !== 200 && response.status !== 429) {
                    set({ isLoadingCode: false });
                }
                // Получаем тело ответа как JSON или текст
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error: ${response.status}`);
            }
            toast.info('Письмо с кодом направлено на Вашу электронную почту')

        } catch (error: any) {
            console.error('Ошибка при получении кода: ', error.message);
            toast.error(`Ошибка при получении кода.\n${error.message && error.message}`);
            
        }
    },

    saveEmployeeInfo: async (personalMobile, cityPhone, workPlace, address, code) => {
        const employeeId = get().currentEmployeeInfo?.id
        const organizationId = get().currentEmployeeInfo?.organizationId

        try {
            const base = await getAvailableApiBase();
            const response = await fetch(`${base}/employee/edit?verification_code=${code}`, {
                method: 'PATCH',  
                headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },  
                body: JSON.stringify({
                    "id": employeeId,
                    "organizationId": organizationId,
                    "mobileNumberPersonal": personalMobile,
                    "externalNumberCorp": cityPhone,
                    "workPlace": workPlace,
                    "address": address
                })
            })
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

            set({
                isLoadingCode: false,
                isEditInformation: false,
            });
            toast.success('Данные успешно изменены.');

        } catch (error: any) {
            console.error('Ошибка при сохраннии данных: ', error.message);
            toast.error('Ошибка при сохранении данных');
            
        } finally {
            set({ isLoadingCode: false });
        }
    },

    fetchEmployeeForSearchBar: async (value, category) => {
        set({isEmployeeForSearchBarLoading: true})

        if (value.length < 2) {
            set({
                EmployeesListLimit: [],
            });
        } else {
            try {
                const base = await getAvailableApiBase();
                const response = await axios.get(
                    `${base}/employee/search?value=${value}&type=${category}&limit=10`
                );
                if (response.status !== 200 ) throw new Error(`HTTP error: ${response.status}`);

                set({
                    EmployeesListLimit: response.data.result,
                });
            

            } catch (error: any) {
                console.error('Ошибка при получении списка найденных сотрудников', error);
                toast.error('Ошибка при получении списка найденных сотрудников');
            } finally {
                set({ isEmployeeForSearchBarLoading: false });
            }
        }
        
    },
}));