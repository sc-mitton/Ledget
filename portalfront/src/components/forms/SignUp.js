import React from "react"
import { Link } from "react-router-dom"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

import fbLogo from "../../assets/images/fbLogo.svg"
import googleLogo from "../../assets/images/googleLogo.svg"
import logo from "../../assets/images/logo.svg"
import alert from "../../assets/icons/alert.svg"
import PasswordInput from "./PasswordInput"
import AuthContext from "../../context/AuthContext"
import api from "../../api/axios"

function SignUpForm() {
    const navigate = useNavigate();

    const { setAuth, setTokenExpiration } = React.useContext(AuthContext);
    const [errMsg, setErrMsg] = useState('');

    const emailRef = useRef('');
    const pwdRef = useRef('');
    const confirmPwdRef = useRef('');
    const errRef = useRef('');

    // Handle bad responses from the server
    const handleBadResponse = (response) => {
        if (response.status === 400) {
            setErrMsg('That email is already taken.')
        } else if (response.status === 408) {
            setErrMsg('Unable to reach server, please try again later.')
        } else if (response.status === 404) {
            setErrMsg('404 Resource not found.')
        } else {
            setErrMsg('Sign up failed.');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        try {
            registerUser(event)
        } catch (err) {
            setErrMsg('Sign up failed.');
        }
    }

    const registerUser = async () => {
        console.log(pwdRef.current.value)
        const response = await api.post(
            'user/',
            { 'email': emailRef.current.value, 'password': pwdRef.current.value },
            { 'headers': { 'Content-Type': 'application/json' } }
        )
        if (response.status === 201) {
            setAuth(response.data?.full_name)
            setTokenExpiration(response.data?.expiration)
            navigate('/subscriptions')
        } else {
            handleBadResponse(response);
        }
    }


    return (
        <form onSubmit={handleSubmit} className="sign-up-form" method="post">
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
                    placeholder="Email"
                    ref={emailRef}
                    required
                />
            </div>
            <PasswordInput
                confirmPassword={true}
                pwdRef={pwdRef}
                confirmPwdRef={confirmPwdRef}
            />
            <div>
                <input type="submit" id="sign-up" value="Sign Up" />
            </div>
        </form>
    )
}

function SocialSignup() {
    return (
        <div className="social-signup-container">
            <div className="or-continue-with">
                <span>Or sign up with</span>
            </div>
            <div className="social-buttons-container">
                <a id="google-auth-button" href="/">
                    <img src={googleLogo} alt="Google" />
                </a>
                <a id="facebook-auth-button"
                    href="/">
                    <img src={fbLogo} alt="Facebook" />
                </a>
            </div>
        </div>
    )
}

function SignUpWindow() {
    return (
        <div>
            <div className='window sign-up-window'>
                <div className="app-logo" >
                    <img src={logo} alt="Ledget" />
                </div>
                <h3>Create Account</h3>
                <SignUpForm />
                <SocialSignup />
            </div>
            <div className="login-prompt-container">
                <span>Already using Ledget?  </span>
                <Link to="/login">Sign In</Link>
            </div>
        </div>
    )
}

export default SignUpWindow
