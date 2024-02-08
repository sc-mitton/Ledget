import { useLocation, useNavigate, Link } from 'react-router-dom'
import { BlackPillButtonWithArrow } from '@ledget/ui'
import { LedgetLogo } from '@ledget/media'
import { useColorScheme } from '@ledget/ui'

const Header = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { isDark } = useColorScheme()

    const splitPath = location.pathname.split("/")

    const text = {
        login: 'Don\'t have an account?',
        register: 'Already have an account?',
    }

    return (
        <header id="top-header">
            <div>
                <a href="/login" tabIndex={0} aria-label="login page">
                    <LedgetLogo darkMode={isDark} />
                </a>
            </div>
            <div>
                {splitPath[splitPath.length - 1] === 'register'
                    &&
                    <>
                        {`${text.register}`}&nbsp;
                        <Link to="/login" tabIndex={0} >Login</Link>
                    </>
                }
                {splitPath[splitPath.length - 1] === 'login'
                    &&
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {`${text.login}`}
                        <BlackPillButtonWithArrow
                            onClick={() => navigate('/register')}
                            aria-label="Sign Up"
                            style={{ marginLeft: '.5rem' }}
                        >
                            Sign Up
                        </BlackPillButtonWithArrow>
                    </div>
                }
            </div>
        </header>
    )
}

export default Header
