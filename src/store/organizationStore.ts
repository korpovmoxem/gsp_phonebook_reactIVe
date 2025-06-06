import { create } from 'zustand';
import {
  Organization,
  Employee,
  ExternalOrganizations,
  CATEGORIES,
  EmployeesList,
} from '../types';
import { toast } from 'react-toastify';
import { buildOrgIndex } from '../utils/buildOrgIndex';
import { OrgMap } from '../utils/buildOrgIndex';

interface OrgState {
  organizations: Organization[];
  externalOrganizations: ExternalOrganizations[];
  selectedOrgId: string | null;
  employees: Employee[];
  isOrgLoading: boolean;
  isExternalOrgLoading: boolean;
  isEmpLoading: boolean;
  categories: CATEGORIES;
  search: string;
  employeesList: EmployeesList[];
  orgMap: OrgMap;

  fetchTree: () => Promise<void>;
  fetchExternalTree: () => Promise<void>;
  selectOrg: (organizationId: string, departmentId: string | null) => Promise<void>;
  loadMoreEmployees: () => Promise<void>;
  fetchEmployeesWithParams: (value: string, category: CATEGORIES) => Promise<void>;
}

export const useOrgStore = create<OrgState>((set, get) => ({
  organizations: [],
  externalOrganizations: [],
  selectedOrgId: null,
  employees: [],
  isOrgLoading: false,
  isExternalOrgLoading: false,
  isEmpLoading: true,
  categories: 'fullName',
  search: '',
  employeesList: [],
  orgMap: new Map(),

  fetchExternalTree: async () => {
	console.log('fetchExternalTree')
    set({ isExternalOrgLoading: true });
    try {
      const response = await fetch('http://172.16.153.53:8001/external/phonebook');
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
	console.log('fetchTree')
    set({ isOrgLoading: true });
    try {
      const response = await fetch('http://172.16.153.53:8001/organization/tree');
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();

      const builtOrgMap = buildOrgIndex(data.result);

      set({
        organizations: data.result,
        orgMap: builtOrgMap,
        isOrgLoading: false,
      });
    } catch (error: any) {
      console.error('Ошибка загрузки организаций:', error.message);
      toast.error('Ошибка при загрузке организаций');
      set({ isOrgLoading: false });
    }
  },

  selectOrg: async (organizationId, departmentId) => {
	console.log('selectOrg')
	set({employeesList: []})
    const targetId = departmentId || organizationId;
    set({ selectedOrgId: targetId, isEmpLoading: true });

    try {
      const url = new URL('http://172.16.153.53:8001/employee');
      url.searchParams.append('organizationId', organizationId);
      if (departmentId) url.searchParams.append('departmentId', departmentId);

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

  loadMoreEmployees: async () => {
		console.log('loadMoreEmployees')
		set({ isEmpLoading: true, employeesList: [] });

		try {
			const response = await fetch('http://172.16.153.53:8001/employee');
			
			if (!response.ok) {
				throw new Error(`Ошибка HTTP! Код статуса: ${response.status}`);
			}

			const resultData = await response.json(); // Парсим JSON-данные
			console.log(resultData)

			set({
				employees: resultData.result,
				isEmpLoading: false,
			});
		} catch (err: any) {
			console.error('Ошибка при получении списка сотрудников:', err.message);
			toast.error('Ошибка при получении списка сотрудников. Попробуйте позже!', {
				position: 'top-right',
			});
		}
	},

  fetchEmployeesWithParams: async (value, category) => {
	console.log('fetchEmployeesWithParams')
    set({ isEmpLoading: true, employeesList: [], selectedOrgId: null });

    try {
      const response = await fetch(
       ` http://172.16.153.53:8001/employee/search?value=${value}&type=${category}`
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
}));