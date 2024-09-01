import { create } from "zustand";

interface BikeStoreState {
  totalNetworks: number;
  totalCountries: number;
  setTotalNetworks: (totalNetworks: number) => void;
  setTotalCountries: (totalCountries: number) => void;
}

export const useBikeStore = create<BikeStoreState>((set) => ({
  totalNetworks: 0,
  totalCountries: 0,
  setTotalCountries: (totalCountries) => set({ totalCountries }),
  setTotalNetworks: (totalNetworks) => set({ totalNetworks }),
}));
