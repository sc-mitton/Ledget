import React from 'react';
import { useRef, useState, useEffect, useContext } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"

import fbLogo from "../../assets/images/fbLogo.svg"
import googleLogo from "../../assets/images/googleLogo.svg"
import logo from "../../assets/images/logo.svg"
import alert from "../../assets/icons/alert.svg"
import PasswordInput from "./PasswordInput"
import AuthContext from "../../context/AuthContext"
import api from "../../api/axios"


const API_URL = process.env.REACT_APP_API_URL;

function LoginForm(status = 'empty') {
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

    const handleBadResponse = (response) => {
        if (response.status === 401) {
            setErrMsg('Wrong username or password.');
        } else if (response.status === 400) {
            setErrMsg('Bad Request');
        } else if (response.status === 404 || response.status === 408) {
            setErrMsg('Unable to reach server, please try again later.')
        } else {
            setErrMsg('Login Failed');
        }
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        try {
            login()
        } catch (err) {
            setErrMsg('Login Failed');
        }
    };

    const login = async () => {
        const response = await api.post(
            'token/',
            { 'email': emailRef.current, 'password': pwdRef.current, },
            { headers: { 'Content-Type': 'application/json' }, }
        )
        if (response.status === 200) {
            setAuth(response.data?.full_name)
            setTokenExpiration(response.data?.expiration)
        } else {
            handleBadResponse(response)
        }
        navigate(from, { replace: true })
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
                    onChange={(e) => emailRef.current = e.target.value}
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
