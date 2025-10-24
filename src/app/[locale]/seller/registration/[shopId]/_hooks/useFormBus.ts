import { create } from "zustand";

interface FormBus {
  submit?: () => Promise<boolean>;
  setSubmit: (submit: () => Promise<boolean>) => void;
}

const useFormBus = create<FormBus>((set) => ({
  submit: undefined,
  setSubmit: (submit) => {
    set({ submit });
  },
}));
export default useFormBus;
