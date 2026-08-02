import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderStatus, User } from '../types';

interface StoredAccount extends User {
  password: string;
}

type AuthErrorKey = 'auth.emailTaken' | 'auth.invalidCredentials';

interface AuthState {
  user: User | null;
  accounts: StoredAccount[];
  orders: Order[];
  register: (fullName: string, email: string, phone: string, password: string) => { ok: boolean; errorKey?: AuthErrorKey };
  login: (email: string, password: string) => { ok: boolean; errorKey?: AuthErrorKey };
  logout: () => void;
  placeOrder: (order: Omit<Order, 'id' | 'date' | 'status' | 'userId'>) => Order | null;
}

/** Order statuses persisted by the pre-i18n version of the app */
const legacyStatusMap: Record<string, OrderStatus> = {
  'در حال پردازش': 'processing',
  'ارسال شده': 'shipped',
  'تحویل داده شده': 'delivered',
};

/**
 * Mock auth backed by localStorage — good enough to demo the full flow.
 * Swap register/login for real API calls once a backend exists.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accounts: [],
      orders: [],
      register: (fullName, email, phone, password) => {
        const { accounts } = get();
        if (accounts.some((a) => a.email === email)) {
          return { ok: false, errorKey: 'auth.emailTaken' };
        }
        const newAccount: StoredAccount = { id: crypto.randomUUID(), fullName, email, phone, password };
        set({ accounts: [...accounts, newAccount], user: newAccount });
        return { ok: true };
      },
      login: (email, password) => {
        const account = get().accounts.find((a) => a.email === email && a.password === password);
        if (!account) {
          return { ok: false, errorKey: 'auth.invalidCredentials' };
        }
        set({ user: account });
        return { ok: true };
      },
      logout: () => set({ user: null }),
      placeOrder: (order) => {
        const currentUser = get().user;
        if (!currentUser) return null;
        const newOrder: Order = {
          ...order,
          userId: currentUser.id,
          id: `ORD-${Date.now().toString().slice(-8)}`,
          date: new Date().toISOString(),
          status: 'processing',
        };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return newOrder;
      },
    }),
    {
      name: 'riri-auth',
      version: 1,
      migrate: (persisted) => {
        const state = persisted as Partial<AuthState> | undefined;
        if (state?.orders) {
          state.orders = state.orders.map((o) => ({
            ...o,
            status: legacyStatusMap[o.status as string] ?? o.status,
          }));
        }
        return state as AuthState;
      },
    },
  ),
);
