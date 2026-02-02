import { create } from 'zustand';

interface ProductsState {
  searchQuery: string;
  hasNotifications: boolean;
  setSearchQuery: (query: string) => void;
  toggleNotifications: () => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  searchQuery: '',
  hasNotifications: true,
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleNotifications: () => set((state) => ({ hasNotifications: !state.hasNotifications })),
}));
