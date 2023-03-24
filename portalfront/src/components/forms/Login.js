import React from 'react';
import { useRef, useState, useEffect, useContext } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"

import fbLogo from "../../assets/images/fbLogo.svg"
import googleLogo from "../../assets/images/googleLogo.svg"
import logo from "../../assets/images/logo.svg"
import alert from "../../assets/icons/alert.svg"
import PasswordInput from "./PasswordInput"
import AuthContext from "../../context/AuthContext"
import apiAuth from "../../api/axios"


function LoginForm() {
    const { setAuth, setTokenExpiration } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";

    const emailRef = useRef();
    const pwdRef = useRef();
    const errRef = useRef('');

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        const response = await apiAuth.post(
            'token/',
            { 'email': emailRef.current.value, 'password': pwdRef.current.value }
        ).then(response => {
            setAuth(response.data?.full_name)
            setTokenExpiration(response.data?.expiration)
            navigate(from, { replace: true })
        }).catch((error) => {
            if (error.response) {
                setErrMsg(error.response.status)
            } else if (error.request) {
                setErrMsg("Server is not responding")
            } else {
                setErrMsg("Hmm, something went wrong, please try again.")
            }
        })
    }

    return (
        <form onSubmit={handleLoginSubmit} className="login-form">
            {errMsg &&
                <div className="error" ref={errRef}>
                    <img src={alert} alt='' />{errMsg}
                </div>
            }
            <div>
                <input
                    type="email"
                    id="email"
                    name="email"
                    val={emailRef}
                    placeholder="Email"
                    ref={emailRef}
                    required
                />
                <PasswordInput
                    pwdRef={pwdRef}
                />
            </div>
            <div className="forgot-password-container">
                <a id="forgot-password" href="/">Forgot Password?</a>
            </div>
            <div>
                <input type="submit" id="login" value="Sign In" />
            </div>
        </form>
    )
}

function SocialLogin() {
    return (
        <div className="social-login-container">
            <div className="or-continue-with">
                <span>Or continue with</span>
            </div>
            <div className="social-buttons-container">
                <a id="google-auth-button" href="/">
                    <img src={googleLogo} alt="Google" />
                </a>
                <a id="facebook-auth-button" href="/">
                    <img src={fbLogo} alt="Facebook" />
                </a>
            </div >
        </div>
    )
}

function LoginWindow() {

    return (
        <div>
            <div className='window login-window'>
                <div className="app-logo" >
                    <img src={logo} alt="Ledget" />
                </div>
                <LoginForm />
                <SocialLogin />
            </div>
            <div className="sign-up-prompt-container">
                <span>Don't have an account? </span>
                <Link to="/register">Sign Up</Link>
            </div>
        </div>
    )
}

export default LoginWindow
