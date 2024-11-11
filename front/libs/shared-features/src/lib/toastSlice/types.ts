export type ToastType = 'success' | 'info' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  messageId?: string;
  type: ToastType;
  timer?: number;
  actionLink?: string | [string, { screen: string }];
  actionMessage?: string;
  hasLoadingBar?: boolean;
}

export interface NewToast extends Omit<ToastItem, 'id'> { }

export interface RootStateWithToast {
  toast: {
    freshToast: ToastItem[];
  };
  [key: string]: any;
}
