import { create } from "zustand";

interface ResponseData {
  status: number;
  headers: Record<string, string>;
  body: string;
  error?: string;

  setResponseData: (data: Partial<ResponseData>) => void;
  reset: () => void;
}

const useResponseDataStore = create<ResponseData>()((set) => ({
  status: 0,
  headers: {},
  body: "",
  error: undefined,
  isHTMLPage: false,

  setResponseData: (data: Partial<ResponseData>) => set((prev) => ({ ...prev, ...data })),

  reset: () =>
    set({
      status: 0,
      headers: {},
      body: "",
      error: undefined,
    }),
}));

export default useResponseDataStore;
