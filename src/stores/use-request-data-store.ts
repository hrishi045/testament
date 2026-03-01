import { create } from "zustand";

interface RequestData {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;

  setRequestData: (data: Partial<RequestData>) => void;
  reset: () => void;
}

const useRequestDataStore = create<RequestData>()((set, get) => ({
  method: "GET",
  url: "",
  headers: {},
  body: "",

  setRequestData: (data: Partial<RequestData>) => set((prev) => ({ ...prev, ...data })),

  reset: () =>
    set({
      method: "GET",
      url: "",
      headers: {},
      body: "",
    }),
}));

export default useRequestDataStore;
