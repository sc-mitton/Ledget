
import './toast.css'

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
}

export const Toast = ({ message, type }: ToastItem) => {
  return (
    <div className="toast--container">
      {message}
    </div>
  )
}
