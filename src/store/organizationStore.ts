import { create } from 'zustand';
import { Organization, Employee, ExternalOrganizations, CATEGORIES, EmployeesList } from '../types';
import { toast } from 'react-toastify';

interface OrgState {
	organizations: Organization[];
	externalOrganizations: ExternalOrganizations[];
	selectedOrgId: string | null;
	employees: Employee[];
	isOrgLoading: boolean;
	isExternalOrgLoading: boolean;
	isEmpLoading: boolean;
	employeePage: number;
	totalCount: number;
	categories: CATEGORIES;
	search: string;
	employeesList: EmployeesList[];

	fetchTree: () => Promise<void>;
	fetchExternalTree: () => Promise<void>;
	selectOrg: (organizationId: string, departmentId: string | null) => Promise<void>;
	loadMoreEmployees: () => Promise<void>;
	fetchEmployeesWithParams: (value: string, category: CATEGORIES) => Promise<void>;

	// setCategories: (category: CATEGORIES) => Promise<void>;
	// setSearch: (newValue: string) => Promise<void>;
}

export const useOrgStore = create<OrgState>((set, get) => ({
	organizations: [],
	externalOrganizations: [],
	selectedOrgId: null,
	employees: [], // Список сотрудников при зпуске приложения
	isOrgLoading: false,
	isExternalOrgLoading: false,
	isEmpLoading: true,
	employeePage: 1,
	totalCount: 0,
	categories: 'fullName',
	search: '',
	employeesList: [], // Список сотрудников по параметрам из поисковой строки

	fetchExternalTree: async () => {
		set({ isExternalOrgLoading: true });
		
		try {
			console.log('ЗАПРОС')
			const response = await fetch('http://172.16.153.53:8001/external/phonebook');
			
			if (!response.ok) {
				throw new Error(`Ошибка HTTP! Код статуса: ${response.status}`);
			}

			const resultData = await response.json(); // Парсим JSON-данные

			set({
				externalOrganizations: resultData.result,
				isExternalOrgLoading: false
			});
		} catch (err: any) {
			console.error('Ошибка при получении списка стороних справочников:', err.message);
			toast.error('Ошибка при получении списка стороних справочников. Попробуйте позже!', {
				position: 'top-right',
			});
		}
		
		
	},

	fetchTree: async () => {
		set({ isOrgLoading: true });
		
		try {
			console.log('ЗАПРОС')
			const response = await fetch('http://172.16.153.53:8001/organization/tree');
			
			if (!response.ok) {
				throw new Error(`Ошибка HTTP! Код статуса: ${response.status}`);
			}

			const resultData = await response.json(); // Парсим JSON-данные

			set({
				organizations: resultData.result,
				isOrgLoading: false
			});
		} catch (err: any) {
			console.error('Ошибка при получении списка организаций:', err.message);
			toast.error('Ошибка при получении списка организаций. Попробуйте позже!', {
				position: 'top-right',
			});
		}
		
		
	},

	// selectOrg: async (id, page = 1) => {
	// 	set({ selectedOrgId: id, isEmpLoading: true});

	// 	try {
	// 		console.log('ЗАПРОС')
	// 		const response = await fetch(`http://172.16.153.53:8001/employee?organizationId=${id}`);
			
	// 		if (!response.ok) {
	// 			throw new Error(`Ошибка HTTP! Код статуса: ${response.status}`);
	// 		}

	// 		const resultData = await response.json(); // Парсим JSON-данные

	// 		set({ employees: resultData.result, isEmpLoading: false });
	// 	} catch (err: any) {
	// 		console.error('Ошибка при получении списка сотрудников данной организации:', err.message);
	// 		toast.error('Ошибка при получении списка сотрудников данной организации. Попробуйте позже!', {
	// 			position: 'top-right',
	// 		});
	// 	}
	// },

	selectOrg: async (organizationId, departmentId) => {
		const id = departmentId || organizationId
		set({ selectedOrgId: String(id), isEmpLoading: true });
		console.log('-------------')
		console.log(departmentId)
		console.log(organizationId)
		console.log(id)

		try {
			const url = new URL('http://172.16.153.53:8001/employee');
			url.searchParams.append('organizationId', organizationId);
			if (departmentId) url.searchParams.append('departmentId', String(departmentId));

			const res = await fetch(url.toString());
			if (!res.ok) throw new Error(`HTTP error ${res.status}`);
			const data = await res.json();
			set({ employees: data.result, isEmpLoading: false });
		} catch (err: any) {
			console.error(err);
			toast.error('Ошибка при загрузке сотрудников');
			set({ isEmpLoading: false });
		}
	},

	loadMoreEmployees: async () => {
		console.log('loadMoreEmployees')
		const { selectedOrgId, employeePage, employees } = get();
		const nextPage = employeePage + 1;
		set({ isEmpLoading: true });

		try {
			const response = await fetch('http://172.16.153.53:8001/employee');
			
			if (!response.ok) {
				throw new Error(`Ошибка HTTP! Код статуса: ${response.status}`);
			}

			const resultData = await response.json(); // Парсим JSON-данные
			console.log(resultData)

			set({
				employeePage: nextPage,
				employees: resultData.result,
				totalCount: resultData.totalCount,
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
		set({ isEmpLoading: true, employeesList: [] });

		try {
			const response = await fetch(`http://172.16.153.53:8001/employee/search?value=${value}&type=${category}`);
			
			if (!response.ok) {
				throw new Error(`Ошибка HTTP! Код статуса: ${response.status}`);
			}

			const resultData = await response.json(); // Парсим JSON-данные
			console.log(resultData)

			set({
				employeesList: resultData.result,
				isEmpLoading: false,
			});
		} catch (err: any) {
			console.error('Ошибка при получении списка сотрудников:', err.message);
			toast.error('Ошибка при получении списка сотрудников. Попробуйте позже!', {
				position: 'top-right',
			});
		}
	},

	// setCategories: async (newCategory) => {
	// 	console.log('setCategories')
	// 	set({ categories: newCategory });
	// },

	// setSearch: async (newValue) => {
	// 	console.log('setSearch')
	// 	set({ search: newValue });
	// },
}));