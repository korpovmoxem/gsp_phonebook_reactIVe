import { create } from "zustand";
import { EmployeeState } from "../types";
import getAvailableApiBase from "../utils/apiClient";


export const useEmployeeStore = create<EmployeeState>((set, get) => ({
    employeeData: {},
    loadEmployeeData: async (employeeId, orgId, size) => {
        const base = await getAvailableApiBase();
        const sizeKey = size === "512" ? "large" : "small";
        set((state) => ({
            employeeData: {
                ...state.employeeData,
                [employeeId]: {
                    ...state.employeeData[employeeId],
                    [sizeKey]: "loading"
                }
            },
        }));

        try {
            const response = await fetch(
                `${base}/employee/image?id=${employeeId}&organizationId=${orgId}&photoSize=${size}`
            );
            if (!response.ok) throw new Error("Ошибка загрузки");
            const data = await response.json();
            set((state) => ({
                employeeData: {
                    ...state.employeeData,
                    [employeeId]: {
                        ...state.employeeData[employeeId],
                        [sizeKey]: data.result
                    }
                },
            }));
        } catch (error) {
            set((state) => ({
                employeeData: {
                    ...state.employeeData,
                    [employeeId]: {
                        ...state.employeeData[employeeId],
                        [sizeKey]: "error"
                    }
                },
            }));
        }
    },
}));