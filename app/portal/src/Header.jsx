import React from 'react'

import { useLocation, Link } from 'react-router-dom'

import logo from "@assets/images/logo.svg"

const Header = () => {
    const location = useLocation()

    const splitPath = location.pathname.split("/")

    const text = {
        login: 'Don\'t have an account?',
        register: 'Already have an account?',
    }

    return (
        <header id="top-header">
            <div>
                <img src={logo} alt="Ledget" />
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
                    <>
                        {`${text.login}`}&nbsp;
                        <Link to="/register" tabIndex={0} >Sign Up</Link>
                    </>
                }
            </div>
        </header>
    )
}

export default Header
