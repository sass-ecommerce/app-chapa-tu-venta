import { create } from 'zustand';

export type ViewMode = 'grid' | 'list';
export type TabValue = 'all' | 'active' | 'inactive';
export type SortBy = 'recent' | 'price_asc' | 'price_desc';

interface ProductsState {
  // Search & notifications
  searchQuery: string;
  hasNotifications: boolean;
  setSearchQuery: (query: string) => void;
  toggleNotifications: () => void;

  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Sort order
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;

  // Tab selection
  selectedTab: TabValue;
  setSelectedTab: (tab: TabValue) => void;

  // Category filters
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  clearCategories: () => void;

  // Selection mode (long-press a card to start selecting products for bulk delete)
  selectionMode: boolean;
  selectedProductIds: Set<string>;
  enterSelectionMode: (productId: string) => void;
  toggleProductSelection: (productId: string) => void;
  exitSelectionMode: () => void;
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

  // Sort order
  sortBy: 'recent',
  setSortBy: (sort) => set({ sortBy: sort }),

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

  // Selection mode
  selectionMode: false,
  selectedProductIds: new Set(),
  enterSelectionMode: (productId) =>
    set({ selectionMode: true, selectedProductIds: new Set([productId]) }),
  toggleProductSelection: (productId) =>
    set((state) => {
      const next = new Set(state.selectedProductIds);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return {
        selectedProductIds: next,
        selectionMode: next.size > 0,
      };
    }),
  exitSelectionMode: () => set({ selectionMode: false, selectedProductIds: new Set() }),
}));
