import { create } from 'zustand';

interface CollectionsState {
  // Selection mode (long-press a card to start selecting collections for bulk delete)
  selectionMode: boolean;
  selectedCollectionIds: Set<string>;
  enterSelectionMode: (collectionId: string) => void;
  toggleCollectionSelection: (collectionId: string) => void;
  exitSelectionMode: () => void;
}

export const useCollectionsStore = create<CollectionsState>((set) => ({
  selectionMode: false,
  selectedCollectionIds: new Set(),
  enterSelectionMode: (collectionId) =>
    set({ selectionMode: true, selectedCollectionIds: new Set([collectionId]) }),
  toggleCollectionSelection: (collectionId) =>
    set((state) => {
      const next = new Set(state.selectedCollectionIds);
      if (next.has(collectionId)) {
        next.delete(collectionId);
      } else {
        next.add(collectionId);
      }
      return {
        selectedCollectionIds: next,
        selectionMode: next.size > 0,
      };
    }),
  exitSelectionMode: () => set({ selectionMode: false, selectedCollectionIds: new Set() }),
}));
