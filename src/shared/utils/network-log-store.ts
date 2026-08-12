import { create } from 'zustand';

const MAX_LOGS = 200;

export type NetworkLogStatus = 'pending' | 'success' | 'error';

export interface NetworkLogEntry {
  id: string;
  method: string;
  url: string;
  path: string;
  status?: number;
  statusText?: string;
  duration?: number;
  timestamp: number;
  requestData?: unknown;
  responseData?: unknown;
  error?: string;
  state: NetworkLogStatus;
}

interface NetworkLogState {
  logs: NetworkLogEntry[];
  startLog: (entry: Omit<NetworkLogEntry, 'state'>) => void;
  resolveLog: (id: string, patch: Partial<NetworkLogEntry>) => void;
  clearLogs: () => void;
}

export const useNetworkLogStore = create<NetworkLogState>((set) => ({
  logs: [],
  startLog: (entry) =>
    set((state) => ({
      logs: [{ ...entry, state: 'pending' as const }, ...state.logs].slice(0, MAX_LOGS),
    })),
  resolveLog: (id, patch) =>
    set((state) => ({
      logs: state.logs.map((log) => (log.id === id ? { ...log, ...patch } : log)),
    })),
  clearLogs: () => set({ logs: [] }),
}));
