
import './styles/Toast.css'

export const Toast = ({ message, type }: ToastItem) => {
    return (
        <div className="toast--container">
            {message}
        </div>
    )
}
