import React, { useState, useEffect } from 'react'

import withModal from '../utils/withModal'
import "./styles/Logout.css"

function Logout(props) {
    const [seconds, setSeconds] = useState(30);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds - 1)
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [])

    useEffect(() => {
        // TODO REDUX: dispatch get logout action
    }, [])

    const logout = () => {
        props.setVisible(false)
        // TODO REDUX: dispatch logout action
    }

    return (
        <div>
            <h2>Leave Ledget?</h2>
            <div id="logout-countdown">
                <span>Your session will end in {seconds} seconds.</span>
            </div>
            <div style={{ display: 'flex', 'justifyContent': 'end', marginTop: '8px' }}>
                <button
                    className='btn-secondary'
                    onClick={() => { props.setVisible(false) }}
                >
                    Cancel
                </button>
                <button
                    className='btn-primary-green'
                    onClick={() => { logout() }}
                    aria-label="Logout"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

const LogoutModal = withModal(Logout)

export default LogoutModal
