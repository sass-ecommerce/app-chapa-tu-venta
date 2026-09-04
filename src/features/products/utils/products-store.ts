import { create } from 'zustand';

interface ProductsState {
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

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
  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

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
