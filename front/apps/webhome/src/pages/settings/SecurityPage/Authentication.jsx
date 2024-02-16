import { useNavigate } from 'react-router-dom'

import './styles/Authentication.css'
import { BlueSlimButton } from '@ledget/ui'
import { useGetMeQuery } from '@features/userSlice'
import { Lock } from '@geist-ui/icons'

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
        <section>
            <h4 className="header2">Authentication</h4>
            <div className="inner-window" id="authentication-methods">
                <div className="authentication-method">
                    <div><Lock className='icon' /></div>
                    <div>
                        <span>Password</span>
                        {user.password_last_changed &&
                            <span>Last changed {formatDate(user.password_last_changed)}
                                at {formatTime(user.password_last_changed)}</span>}
                    </div>
                    <div>
                        <BlueSlimButton
                            onClick={() => navigate('/settings/security/change-password')}
                            aria-label="Change password"
                        >
                            change
                        </BlueSlimButton>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PasswordReset
