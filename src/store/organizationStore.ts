import { create } from 'zustand';
import { Organization, Employee } from '../types';
import { toast } from 'react-toastify';

interface OrgState {
	organizations: Organization[];
	selectedOrgId: string | null;
	employees: Employee[];
	isOrgLoading: boolean;
	isEmpLoading: boolean;
	employeePage: number;
	totalCount: number;

	fetchTree: () => Promise<void>;
	selectOrg: (id: string, page?: number) => Promise<void>;
	loadMoreEmployees: () => Promise<void>;
}

export const useOrgStore = create<OrgState>((set, get) => ({
	organizations: [],
	selectedOrgId: null,
	employees: [],
	isOrgLoading: false,
	isEmpLoading: false,
	employeePage: 1,
	totalCount: 0,

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

	selectOrg: async (id, page = 1) => {
		set({ selectedOrgId: id, isEmpLoading: true, employeePage: page });
		const res = await fetch(`/api/employees?organizationId=${id}&page=${page}&pageSize=10`);
		const data = await res.json();
		set({ employees: data.employees, totalCount: data.totalCount, isEmpLoading: false });
	},

	loadMoreEmployees: async () => {
		console.log('loadMoreEmployees')
		const { selectedOrgId, employeePage, employees } = get();
		const nextPage = employeePage + 1;
		set({ isEmpLoading: true });
		// const res = await fetch(`/api/employees?organizationId=${selectedOrgId}&page=${nextPage}&pageSize=10`);
		// const data = await res.json();
		const data = {"employees": [
						{
							"id": "E001",
							"name": "Иван Иванов",
							"position": "Руководитель отдела",
							"mail": "ivan.ivanov@company.ru",
							"phone": "+79123456789"
						},
						{
							"id": "E002",
							"name": "Мария Смирнова",
							"position": "Менеджер проектов",
							"mail": "maria.smirnova@company.ru",
							"phone": "+79876543210"
						},
						{
							"id": "E003",
							"name": "Алексей Кузнецов",
							"position": "Разработчик ПО",
							"mail": "aleksey.kuznetsov@company.ru",
							"phone": "+79123456781"
						},
						{
							"id": "E004",
							"name": "Анна Петрова",
							"position": "Дизайнер UI/UX",
							"mail": "anna.petrova@company.ru",
							"phone": "+79876543211"
						},
						{
							"id": "E005",
							"name": "Дмитрий Сидоров",
							"position": "Тестировщик QA",
							"mail": "dmitry.sidorov@company.ru",
							"phone": "+79123456782"
						},
						{
							"id": "E006",
							"name": "Елена Сергеева",
							"position": "Маркетолог",
							"mail": "elena.sergeeva@company.ru",
							"phone": "+79876543212"
						},
						{
							"id": "E007",
							"name": "Максим Фёдоров",
							"position": "Финансовый аналитик",
							"mail": "maksim.fedorov@company.ru",
							"phone": "+79123456783"
						},
						{
							"id": "E008",
							"name": "Светлана Кузнецова",
							"position": "HR-менеджер",
							"mail": "svetlana.kuznetsova@company.ru",
							"phone": "+79876543213"
						},
						{
							"id": "E009",
							"name": "Андрей Павлов",
							"position": "SMM специалист",
							"mail": "andrey.pavlov@company.ru",
							"phone": "+79123456784"
						},
						{
							"id": "E010",
							"name": "Наталья Алексеева",
							"position": "Юрист",
							"mail": "natalya.alekseeva@company.ru",
							"phone": "+79876543214"
						}
					], "totalCount": 100}
		set({
			employeePage: nextPage,
			employees: data.employees,
			totalCount: data.totalCount,
			isEmpLoading: false,
		});
	},
}));