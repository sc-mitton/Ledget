
import './styles/Toast.css'

const Toast = ({ msg }) => {
    return (
        <div className="toast--container">
            {msg}
        </div>
    )
}

export default Toast
