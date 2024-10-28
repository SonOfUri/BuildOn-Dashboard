import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DashboardState {
  user: string;
  health: number | string;
  fig: string;
  address: string | null; // Add address to the store
  setUser: (user: string) => void;
  setHealth: (health: number | string) => void;
  setFig: (fig: string) => void;
  setAddress: (address: string | null) => void; // Setter for address
  resetAddress: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      user: 'User',
      health: '0',
      fig: '0.00',
      address: null, // Initialize address as null
      setUser: (user: string) => set(() => ({ user })),
      setHealth: (health: number | string) => set(() => ({ health })),
      setFig: (fig: string) => set(() => ({ fig })),
      setAddress: (address: string | null) => set(() => ({ address })),
      
     resetAddress: () => set({ address: '0x0000000000000000000000000000000000000000' }),
      
    }),
    {
      name: 'dashboard-storage', // unique name for localStorage
    }
  )
);
