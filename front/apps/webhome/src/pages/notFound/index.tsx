
import styles from './styles.module.scss'
import { useNavigate } from 'react-router-dom'
import { BlackPrimaryButton } from '@ledget/ui'
import { MainWindow } from '@ledget/ui'

const NotFound = ({ hasBackground = true }) => {
    const navigate = useNavigate()

    return (
        <MainWindow
            className={styles.window}
            style={{
                ...(!hasBackground ? { backgroundColor: 'none', boxShadow: 'none' } : {})
            }}
        >
            <div>
                <h1>404 Not Found</h1>
                <BlackPrimaryButton
                    aria-label="Return home"
                    onClick={() => navigate('/budget')}
                >
                    Return home
                </BlackPrimaryButton>
            </div>
        </MainWindow>
    )
}

export default NotFound
