import { create } from "zustand";

interface OpenRequest {
  name: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  parameters?: Record<string, string>;
  body?: string;
}

interface OpenRequests {
  requests: OpenRequest[];
  activeRequestName: string | null;

  addRequest: (request: OpenRequest) => void;
  removeRequest: (index: number) => void;
  clearRequests: () => void;
  setActiveRequestName: (name: string | null) => void;
}

const useOpenRequestsStore = create<OpenRequests>()((set) => ({
  requests: [],
  activeRequestName: null,
  addRequest: (request: OpenRequest) =>
    set((state) => ({
      requests: [...state.requests, request],
      activeRequestName: request.name,
    })),
  removeRequest: (index: number) =>
    set((state) => {
      return {
        requests: state.requests.filter((_, i) => i !== index),
        activeRequestName:
          state.activeRequestName === state.requests[index].name ? null : state.activeRequestName,
      };
    }),
  clearRequests: () => set({ requests: [], activeRequestName: null }),
  setActiveRequestName: (name: string | null) => {
    set({ activeRequestName: name });
  },
}));

export default useOpenRequestsStore;
