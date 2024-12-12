export type ToastType = 'success' | 'info' | 'error';

type ScreenRoute = {
  screen: string;
  params?: ScreenRoute | { [key: string]: any };
}

type NavigationRoute = [string, ScreenRoute];

export interface ToastItem {
  id: string;
  message: string;
  messageId?: string;
  type: ToastType;
  timer?: number;
  actionLink?: string | NavigationRoute;
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
