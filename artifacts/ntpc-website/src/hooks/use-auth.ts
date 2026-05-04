import { create } from 'zustand';

type AuthState = {
  role: 'admin' | 'members' | null;
  token: string | null;
  login: (role: 'admin' | 'members', token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  role: (localStorage.getItem('ntpc_role') as 'admin' | 'members') || null,
  token: localStorage.getItem('ntpc_token') || null,
  login: (role, token) => {
    localStorage.setItem('ntpc_role', role);
    localStorage.setItem('ntpc_token', token);
    set({ role, token });
  },
  logout: () => {
    localStorage.removeItem('ntpc_role');
    localStorage.removeItem('ntpc_token');
    set({ role: null, token: null });
  },
}));
