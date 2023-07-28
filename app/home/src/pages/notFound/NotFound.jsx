import React from 'react'

import { useNavigate } from 'react-router-dom'

import './NotFound.css'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="window" id="not-found-window">
            <div>
                <h1>404 Not Found</h1>
                <button
                    className="btn-primary-green"
                    aria-label="Return home"
                    onClick={() => navigate('/budget')}
                >
                    Return home
                </button>
            </div>
        </div>
    )
}

export default NotFound
