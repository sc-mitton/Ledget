import React from 'react'

import { useNavigate } from 'react-router-dom'

import './styles/Authentication.css'
import { LockIcon } from '@ledget/assets'
import { GrayButton } from '@ledget/ui'
import { useGetMeQuery } from '@features/userSlice'

const PasswordReset = () => {
    const { data: user } = useGetMeQuery()
    const navigate = useNavigate()

    const formatDate = (date) => {
        const d = new Date(date)
        const options = { month: 'short', day: 'numeric', year: 'numeric' }
        return d.toLocaleDateString('en-US', options)
    }

    const formatTime = (date) => {
        const d = new Date(date)
        const options = { hour: 'numeric', minute: 'numeric' }
        return d.toLocaleTimeString('en-US', options)
    }

    return (
        <>
            <h3 className="header2">Authentication</h3>
            <div className="inner-window" id="authentication-methods">
                <div className="authentication-method">
                    <div><LockIcon /></div>
                    <div>
                        <span>Password</span>
                        {user.password_last_changed &&
                            <span>Last changed {formatDate(user.password_last_changed)}
                                at {formatTime(user.password_last_changed)}</span>}
                    </div>
                    <div>
                        <GrayButton
                            onClick={() => navigate('/profile/security/change-password')}
                            aria-label="Change password"
                        >
                            change
                        </GrayButton>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PasswordReset
