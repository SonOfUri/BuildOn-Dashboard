import { create } from 'zustand';
import { useDashboardStore } from '@/store/useDashboardStore'; // Import your Dashboard store

type BalanceData = {
  assetName: string;
  assetImg: string;
  balance: number;
  marketValue: string;
  netProfit: string;
  netProfitColor: string;
  collateralImg: string;
  collateralStatus: string;
  tokenPrice: number;
};

interface BalanceState {
  balanceData: BalanceData[];
  collateralVal: number | string; // Add collateralVal
  availBal: number | string;       // Add availBal
  setBalanceData: (data: BalanceData[]) => void;
  setCollateralVal: (value: number | string) => void; // Setter for collateralVal
  setAvailBal: (value: number | string) => void;       // Setter for availBal
  clearBalanceData: () => void;
  loadBalanceData: () => void; // No parameters needed
}

export const useBalanceStore = create<BalanceState>((set) => ({
  balanceData: [],
  collateralVal: '0',  // Initialize collateralVal
  availBal: '0',       // Initialize availBal
  setBalanceData: (data) => {
    set({ balanceData: data });
    const currentAddress = useDashboardStore.getState().user; // Get the address from the Dashboard store
    localStorage.setItem("balanceData", JSON.stringify(data));
    localStorage.setItem("currentAddress", currentAddress); // Save current address to local storage
  },
  setCollateralVal: (value) => set({ collateralVal: value }), // Set collateralVal
  setAvailBal: (value) => set({ availBal: value }),           // Set availBal
  clearBalanceData: () => {
    set({ balanceData: [], collateralVal: '0', availBal: '0' }); // Clear collateralVal and availBal
    localStorage.removeItem("balanceData");
    localStorage.removeItem("currentAddress"); // Clear stored address too
  },
  loadBalanceData: () => {
    const storedData = localStorage.getItem("balanceData");
    const storedAddress = localStorage.getItem("currentAddress");
    const currentAddress = useDashboardStore.getState().user; // Get the address from the Dashboard store

    // If the stored address is different from the current one, clear the stored data
    if (storedAddress && storedAddress !== currentAddress) {
      localStorage.removeItem("balanceData");
      localStorage.removeItem("currentAddress");
      set({ balanceData: [], collateralVal: '0', availBal: '0' }); // Clear values
    } else if (storedData) {
      set({ balanceData: JSON.parse(storedData) });
    }
  },
}));
