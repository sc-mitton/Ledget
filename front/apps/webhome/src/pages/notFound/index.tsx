

import { useNavigate } from 'react-router-dom'
import { BlackPrimaryButton } from '@ledget/ui'

import './NotFound.scss'

const NotFound = ({ hasBackground = true }) => {
    const navigate = useNavigate()

    return (
        <div
            className="window main-window"
            id="not-found-window"
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
        </div>
    )
}

export default NotFound
