import { create } from 'zustand';

export type ViewMode = 'grid' | 'list';
export type TabValue = 'all' | 'active' | 'inactive';

interface ProductsState {
  // Search & notifications
  searchQuery: string;
  hasNotifications: boolean;
  setSearchQuery: (query: string) => void;
  toggleNotifications: () => void;

  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Tab selection
  selectedTab: TabValue;
  setSelectedTab: (tab: TabValue) => void;

  // Category filters
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  clearCategories: () => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  // Search & notifications
  searchQuery: '',
  hasNotifications: true,
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleNotifications: () => set((state) => ({ hasNotifications: !state.hasNotifications })),

  // View mode
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),

  // Tab selection
  selectedTab: 'all',
  setSelectedTab: (tab) => set({ selectedTab: tab }),

  // Category filters
  selectedCategories: [],
  toggleCategory: (category) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(category)
        ? state.selectedCategories.filter((c) => c !== category)
        : [...state.selectedCategories, category],
    })),
  clearCategories: () => set({ selectedCategories: [] }),
}));
