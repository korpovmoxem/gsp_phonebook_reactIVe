import { create } from 'zustand';

interface AppStore {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    token: string | null;
    setToken: (token: string) => void;
}

export const useThemeStore = create<AppStore>((set) => ({
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
    token: localStorage.getItem('token'),
    toggleTheme: () =>{
        set((state) => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return { theme: newTheme };
        })},
    setToken: (token: string) => {
        localStorage.setItem('token', token);
        set({ token });
    },
}));

// Подписка на все изменения
useThemeStore.subscribe((state) => {
    localStorage.setItem('theme', state.theme);
    if (state.token) {
        localStorage.setItem('token', state.token);
    } else {
        localStorage.removeItem('token');
    }
});