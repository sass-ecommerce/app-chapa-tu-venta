import { create } from 'zustand';

interface ProductsState {
  selectedCategory: string;
  searchQuery: string;
  hasNotifications: boolean;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  toggleNotifications: () => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  selectedCategory: 'All',
  searchQuery: '',
  hasNotifications: true,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleNotifications: () => set((state) => ({ hasNotifications: !state.hasNotifications })),
}));
