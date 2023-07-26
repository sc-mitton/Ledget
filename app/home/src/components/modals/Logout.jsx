import React, { useState, useEffect } from 'react'

import { useDispatch } from 'react-redux'

import withModal from '@utils/withModal'
import logout from '@flow/logout'
import "./styles/Logout.css"
import { LoadingRing } from '../widgets/Widgets'

function Logout(props) {
    const [seconds, setSeconds] = useState(30)
    const [loggingOut, setLoggingOut] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds - 1)
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [])

    const handleLogout = async () => {
        setLoggingOut(true)
        const loggedOut = await logout()
        if (loggedOut) {
            // loggedOut && dispatch(logoutUser)
            window.location.href = import.meta.env.VITE_LOGOUT_REDIRECT_URL
        }
        setLoggingOut(false)
    }

    useEffect(() => {
        seconds === 0 && handleLogout()
    }, [seconds])

    return (
        <div>
            <h2>Leave Ledget?</h2>
            <div id="logout-countdown">
                <span>Your session will end in {seconds} seconds.</span>
            </div>
            <div style={{ display: 'flex', 'justifyContent': 'end', marginTop: '8px' }}>
                <button
                    className='btn-secondary'
                    onClick={() => props.setVisible(false)}
                >
                    Cancel
                </button>
                <button
                    className='btn-primary-green'
                    onClick={() => handleLogout()}
                    aria-label="Logout"
                >
                    <LoadingRing visible={loggingOut}>
                        <div style={{ color: loggingOut ? 'transparent' : 'inherit' }}>
                            Logout
                        </div>
                    </LoadingRing>
                </button>
            </div>
        </div>
    )
}

const LogoutModal = withModal(Logout)

export default LogoutModal
