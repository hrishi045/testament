import { create } from "zustand";

interface OpenRequest {
  id: string;
  name: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  parameters?: Record<string, string>;
  body?: string;
  beingEdited?: boolean;
}

interface OpenRequests {
  requests: OpenRequest[];
  activeRequestId: string | null;

  addRequest: (request: Partial<OpenRequest>) => void;
  removeRequest: (index: number) => void;
  clearRequests: () => void;
  setActiveRequestId: (id: string | null) => void;
  changeName: (index: number, newName: string) => void;
  setBeingEdited: (index: number, beingEdited: boolean) => void;
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
  removeRequest: (index: number) =>
    set((state) => {
      return {
        requests: state.requests.filter((_, i) => i !== index),
        activeRequestId:
          state.activeRequestId === state.requests[index].name ? null : state.activeRequestId,
      };
    }),
  clearRequests: () => set({ requests: [], activeRequestId: null }),
  setActiveRequestId: (id: string | null) => {
    set({ activeRequestId: id });
  },
  changeName: (index: number, newName: string) => {
    set((state) => {
      const updatedRequests = [...state.requests];
      updatedRequests[index].name = newName;
      return { requests: updatedRequests };
    });
  },
  setBeingEdited: (index: number, beingEdited: boolean) => {
    set((state) => {
      const updatedRequests = [...state.requests];
      updatedRequests[index].beingEdited = beingEdited;
      return { requests: updatedRequests };
    });
  },
}));

export default useOpenRequestsStore;
