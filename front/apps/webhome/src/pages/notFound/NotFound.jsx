import React from 'react'

import { useNavigate } from 'react-router-dom'
import { Desert } from '@components/pieces'
import { BlackPrimaryButton } from '@ledget/ui'

import './NotFound.css'

const NotFound = ({ hasBackground }) => {
    const navigate = useNavigate()

    return (
        <div
            className="window"
            id="not-found-window"
            style={{
                ...(!hasBackground ? { backgroundColor: 'none', boxShadow: 'none' } : {})
            }}
        >
            <div>
                <Desert />
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
