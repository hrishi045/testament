import { create } from "zustand";

interface OpenRequest {
  id: string;
  name: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  parameters?: Record<string, string>;
  body?: string;
}

interface OpenRequests {
  requests: OpenRequest[];
  activeRequestId: string | null;

  addRequest: (request: Partial<OpenRequest>) => void;
  removeRequest: (id: string) => void;
  clearRequests: () => void;
  setActiveRequestId: (id: string | null) => void;
  changeName: (id: string, newName: string) => void;
}

const useOpenRequestsStore = create<OpenRequests>()((set) => ({
  requests: [],
  activeRequestId: null,
  addRequest: (request: OpenRequest) => {
    const id = crypto.randomUUID();
    set((state) => ({
      requests: [...state.requests, { ...request, id }],
      activeRequestId: id,
    }));
  },
  removeRequest: (id: string) =>
    set((state) => {
      return {
        requests: state.requests.filter((request) => request.id !== id),
        activeRequestId:
          state.activeRequestId === id ? null : state.activeRequestId,
      };
    }),
  clearRequests: () => set({ requests: [], activeRequestId: null }),
  setActiveRequestId: (id: string | null) => {
    set({ activeRequestId: id });
  },
  changeName: (id: string, newName: string) => {
    set((state) => {
      const updatedRequests = [...state.requests];
      const index = updatedRequests.findIndex((request) => request.id === id);
      if (index !== -1) {
        updatedRequests[index].name = newName;
      }
      return { requests: updatedRequests };
    });
  },
}));

export default useOpenRequestsStore;
