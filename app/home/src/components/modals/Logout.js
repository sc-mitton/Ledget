import React, { useRef, useState, useEffect } from 'react'

import { useSpring, animated } from '@react-spring/web'

import withModal from '../../components/utils/withModal'
import { UserContext } from '../../context/UserContext'
import "./styles/Logout.css"

function Logout(props) {
    const { logout } = React.useContext(UserContext)
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
        if (seconds === 0) {
            logout()
        }
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
