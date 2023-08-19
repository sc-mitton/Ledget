import React from 'react'

import { useNavigate } from 'react-router-dom'
import { Desert } from '@components/pieces'

import './NotFound.css'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="window" id="not-found-window">
            <div>
                <Desert />
                <h1>404 Not Found</h1>
                <button
                    className="btn-chcl btn3"
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
