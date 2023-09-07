import React, { useState, useEffect } from 'react'

import "./styles/Logout.css"
import { ory } from '@flow/ory'
import { withSmallModal } from '@ledget/shared-utils'
import { SecondaryButton, GreenSubmitButton } from '@ledget/shared-ui'

function Logout(props) {
    const [seconds, setSeconds] = useState(30)
    const [loggingOut, setLoggingOut] = useState(false)

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
        await ory.logout(import.meta.env.VITE_LOGOUT_REDIRECT_URL)
        setLoggingOut(false)
    }

    useEffect(() => {
        seconds <= 0 && handleLogout()
    }, [seconds])

    return (
        <div>
            <h2>Sign out of your account?</h2>
            <div id="logout-countdown">
                <span>Your session will end in {seconds} seconds.</span>
            </div>
            <div style={{ display: 'flex', 'justifyContent': 'end', marginTop: '8px' }}>
                <SecondaryButton
                    onClick={() => props.setVisible(false)}
                    aria-label="Cancel"
                >
                    Cancel
                </SecondaryButton>
                <GreenSubmitButton
                    submitting={loggingOut}
                    aria-label="Sign out"
                >
                    {Logout}
                </GreenSubmitButton>
            </div>
        </div>
    )
}

const LogoutModal = withSmallModal(Logout)

export default LogoutModal
