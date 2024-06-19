export type ToastType = 'success' | 'info' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  timer?: number;
  actionLink?: string;
  actionMessage?: string;
  hasLoadingBar?: boolean;
}

export interface NewToast extends Omit<ToastItem, 'id'> {}

export interface RootStateWithToast {
  toast: {
    freshToast: ToastItem[];
  };
  [key: string]: any;
}
