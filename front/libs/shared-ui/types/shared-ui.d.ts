declare module 'shared-ui' {
    export type ToastType = 'success' | 'error' | 'warning' | 'info';

    export type ToastItem = {
        id: number;
        message: string;
        type: ToastType;
    }
}
