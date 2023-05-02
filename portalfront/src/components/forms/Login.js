import React from 'react'
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
    const { setTokenExpiration } = useContext(AuthContext)

    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/home"

    const emailRef = useRef()
    const pwdRef = useRef()
    const forgotPasswordRef = useRef()
    const [pswdVisible, setPswdVisible] = useState(false)
    const [pwdInput, setPwdInput] = useState('')
    const submitButtonRef = useRef(null)


    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        emailRef.current.focus()
    }, [])

    const VisibilityIcon = () => {
        return (
            <button
                onClick={() => setPswdVisible(!pswdVisible)}
                className="hide-password-button"
                aria-label="toggle password visibility"
            >
                <img
                    src={pswdVisible ? hidePassword : showPassword}
                    alt="toggle visibility"
                    className="hide-password-icon"
                />
            </button>
        )
    }

    const handleSuccessfulResponse = (response) => {
        setTokenExpiration(response.data?.access_token_expiration)
        sessionStorage.setItem(
            'access_token_expiration',
            response.data?.access_token_expiration
        )
        sessionStorage.setItem(
            'user',
            JSON.stringify(response.data.user)
        )
        if (response.data.user.is_customer
            && response.data.user.subscription_status) {
            console.log("navigating to dashboard...") // TODO
        } else {
            navigate('/plans')
        }
    }

    const handleErrorResponse = (error) => {
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
    }

    const handleLoginSubmit = async (event) => {
        event.preventDefault()
        if (emailRef.current.value === '') {
            emailRef.current.focus()
        } else if (pwdRef.current.value === '') {
            pwdRef.current.focus()
        } else {
            apiAuth.post(
                'token',
                { 'email': emailRef.current.value, 'password': pwdRef.current.value }
            ).then(response => {
                handleSuccessfulResponse(response)
            }).catch((error) => {
                handleErrorResponse(error)
            })
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault()
            submitButtonRef.current.focus()
        }
    }

    return (
        <form onSubmit={handleLoginSubmit} className="login-form" noValidate>
            {errMsg &&
                <div className="form-error">
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
                        name="password"
                        val={pwdRef}
                        ref={pwdRef}
                        onChange={(e) => {
                            e.target.value !== '' ?
                                setPwdInput(true)
                                : setPwdInput(false)
                        }}
                        onKeyDown={handleKeyDown}
                        required
                    />
                    {pwdInput ? <VisibilityIcon /> : null}
                </div>
                <div className="forgot-password-container">
                    <Link to="#" ref={forgotPasswordRef} tabIndex={0}  >Forgot Password?</Link>
                </div>
                <div>
                    <button
                        id="login-submit"
                        className="valid-submit"
                        name="submit"
                        type="submit"
                        ref={submitButtonRef}
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </form >
    )
}

function SocialLogin() {
    return (
        <div className="social-login-container">
            <div className="or-continue-with">Or continue with</div>
            <div className="social-buttons-container">
                <button
                    id="google-auth-button"
                    aria-label="Google login"
                >
                    <img src={googleLogo} alt="Google" />
                </button>
                <button
                    id="facebook-auth-button"
                    aria-label="Facebook login"
                >
                    <img src={fbLogo} alt="Facebook" />
                </button >
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
            <div
                className="sign-up-prompt-container"
            >
                <span>Don't have an account? </span>
                <Link to={{ pathname: "/register", state: { direction: 1 } }}>
                    Sign Up
                </Link>
            </div>
        </div>
    )
}

export default LoginWindow
