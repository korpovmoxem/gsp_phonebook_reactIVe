import { create } from "zustand";
import { IconObject, ImageSize } from "../types";

type EmployeeState = {
    employeeData: Record<string, "loading" | "error" | { statuses: IconObject[]; rewards: IconObject[]; photo: string }>;
    loadEmployeeData: (employeeId: string, orgId: string, size: ImageSize) => void;
};

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
    employeeData: {},
    loadEmployeeData: async (employeeId, orgId, size) => {
        set((state) => ({
            employeeData: {
                ...state.employeeData,
                [employeeId]: "loading",
            },
        }));

        try {
            const response = await fetch(
                `http://172.16.153.53:8001/employee/image?id=${employeeId}&organizationId=${orgId}&photoSize=${size}`
            );

            if (!response.ok) throw new Error("Ошибка загрузки");

            const data = await response.json();

            set((state) => ({
                employeeData: {
                    ...state.employeeData,
                    [employeeId]: data.result,
                },
            }));
        } catch (error) {
            console.error(`Ошибка загрузки данных для ${employeeId}:`, error);
            set((state) => ({
                employeeData: {
                    ...state.employeeData,
                    [employeeId]: "error",
                },
            }));
        }
    },
}));