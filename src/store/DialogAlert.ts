import { create } from 'zustand';

export type AlertTypes = '' | 'error' | 'success' | 'warning';

type AlertState = {
  isOpen: boolean;
  title: string;
  type: AlertTypes;
  message: string;
  showAlert: (title: string, type: AlertTypes, message: string) => void;
  hideAlert: () => void;
};

export const useAlertStore = create<AlertState>((set) => ({
  isOpen: false,
  title: '',
  type: '',
  message: '',
  onClose: undefined,
  showAlert: (title: string, type: AlertTypes, message: string) =>
    set({ isOpen: true, title, message, type }),
  hideAlert: () => set({ isOpen: false, title: '', message: '' }),
}));
