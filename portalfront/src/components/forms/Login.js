import React from 'react';
import { useRef, useState, useEffect, useContext } from "react"

import { useNavigate, useLocation, Link } from "react-router-dom"

import fbLogo from "../../assets/images/fbLogo.svg"
import googleLogo from "../../assets/images/googleLogo.svg"
import logo from "../../assets/images/logo.svg"
import hidePassword from "../../assets/icons/hidePassword.svg"
import showPassword from "../../assets/icons/showPassword.svg"
import alert2 from "../../assets/icons/alert2.svg"
import AuthContext from "../../context/AuthContext"
import apiAuth from "../../api/axios"

function LoginForm() {
    const { setAuth, setTokenExpiration } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";

    const emailRef = useRef();
    const pwdRef = useRef();
    const [pswdVisible, setPswdVisible] = useState(false);
    const [pwdInput, setPwdInput] = useState('');

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    const VisibilityIcon = () => {
        return (
            <img
                src={pswdVisible ? hidePassword : showPassword}
                alt="toggle visibility"
                className="hide-password-icon"
                onClick={() => setPswdVisible(!pswdVisible)}
            />
        )
    }

    const handleLoginSubmit = async (event) => {
        event.preventDefault()
        if (emailRef.current.value === '') {
            emailRef.current.focus()
        } else if (pwdRef.current.value === '') {
            pwdRef.current.focus()
        } else {
            apiAuth.post(
                'token/',
                { 'email': emailRef.current.value, 'password': pwdRef.current.value }
            ).then(response => {
                console.log(response.data)
                setUser(response.data?.user)
                setTokenExpiration(response.data?.access_token_expiration)
                navigate(from, { replace: true }, { state: { direction: 1 } })
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        setErrMsg("Wrong email or password.")
                    } else {
                        setErrMsg(error.response.error)
                    }
                } else if (error.request) {
                    setErrMsg("Server is not responding")
                } else {
                    setErrMsg("Hmm, something went wrong, please try again.")
                }
            })
        }
    }

    return (
        <form onSubmit={handleLoginSubmit} className="login-form" noValidate>
            {errMsg &&
                <div className="server-error">
                    <img src={alert2} alt='' />
                    {errMsg}
                </div>
            }
            <div>
                <div className="input-container">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        val={emailRef}
                        placeholder="Email"
                        ref={emailRef}
                        required
                    />
                </div>
                <div className="input-container">
                    <input
                        type={pswdVisible ? "text" : "password"}
                        placeholder="Password"
                        val={pwdRef}
                        ref={pwdRef}
                        onChange={(e) => {
                            e.target.value !== '' ?
                                setPwdInput(true)
                                : setPwdInput(false)
                        }}
                        required
                    />
                    {pwdInput ? <VisibilityIcon /> : null}
                </div>
                <div className="forgot-password-container">
                    <a id="forgot-password" href="/">Forgot Password?</a>
                </div>
                <div>
                    <input
                        className="submit-button"
                        type="submit"
                        value="Sign In"
                    />
                </div>
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
        <div className='window login-window'>
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <LoginForm />
            <SocialLogin />
            <div className="sign-up-prompt-container">
                <span>Don't have an account? </span>
                <Link to={{
                    pathname: "/register",
                    state: { direction: 1 }
                }}>Sign Up</Link>
            </div>
        </div>
    )
}

export default LoginWindow
