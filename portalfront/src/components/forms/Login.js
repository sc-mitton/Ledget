import React, { useRef, useState, useEffect, useContext } from "react"

import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

import './style/Login.css'
import webAuthn from "../../assets/icons/webAuthn.svg"
import Help from "../../assets/icons/Help"
import logo from "../../assets/images/logo.svg"
import FacebookLogo from "../../assets/icons/FacebookLogo"
import GoogleLogo from "../../assets/icons/GoogleLogo"
import alert2 from "../../assets/icons/alert2.svg"
import AuthContext from "../../context/AuthContext"
import { PasswordInput } from "./CustomInputs"
import { Checkbox } from "./CustomInputs"
import apiAuth from "../../api/axios"

function SocialLogin() {
    return (
        <div className="social-login-container">
            <div>Or sign in with</div>
            <div>
                <button
                    className="social-auth-button"
                    id='google-login'
                    aria-label="Google login"
                >
                    <GoogleLogo />
                </button>
                <button
                    className="social-auth-button"
                    id='facebook-login'
                    aria-label="Facebook login"
                >
                    <FacebookLogo />
                </button >
            </div>
        </div>
    )
}

function LoginWindow() {
    const { setTokenExpiration } = useContext(AuthContext)
    const [email, setEmail] = useState('')

    const navigate = useNavigate()

    const LoginForm = () => {
        const [errMsg, setErrMsg] = useState('')
        const emailRef = useRef()

        useEffect(() => {
            emailRef.current.focus()
        }, [])

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
            } else {
                setEmail(emailRef.current.value)
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
                            placeholder="Email"
                            ref={emailRef}
                            required
                        />
                    </div>
                    <div id="remember-me-checkbox-container">
                        <Checkbox id='remember-me' label='Save login method' />
                    </div>
                    <button
                        className='charcoal-button'
                        id="next"
                        name="enter-password"
                        type="submit"
                        aria-label="Next"
                    >
                        Continue
                    </button>
                </div>
            </form >
        )
    }

    const InitialContent = () => {
        return (
            <>
                <div className="app-logo" >
                    <img src={logo} alt="Ledget" />
                </div>
                <h2>Sign In</h2>
                <LoginForm />
                <SocialLogin />
                <div
                    className="below-window-container"
                >
                    <span>Don't have an account? </span>
                    <Link
                        className="underline-link-animation"
                        to={{ pathname: "/register", state: { direction: 1 } }}
                    >
                        Sign Up
                    </Link>
                </div>
            </>
        )
    }

    const AuthenticateContent = () => {

        return (
            <>
                <div className="app-logo" >
                    <img src={logo} alt="Ledget" />
                </div>
                <form id="authentication-content-container">
                    <PasswordInput />
                    <div>
                        <button
                            className='charcoal-button'
                            id="sign-in"
                            name="sign-in"
                            type="submit"
                            aria-label="Sign in"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
                <div id="passwordless-options">
                    <div id="passwordless-options-header">
                        Passwordless Options
                        <div className="help-icon">
                            <Help />
                        </div>
                    </div>
                    <div>
                        <button
                            name="passwordless-options"
                            type="submit"
                        >
                            <img src={webAuthn} id="webauthn-icon" alt='webauthn icon' />
                        </button>
                    </div>
                </div>
                <div
                    className="below-window-container"
                >
                    <Link to="#" tabIndex={0} >Forgot Password?</Link>
                </div>
            </>
        )
    }

    return (
        <AnimatePresence mode="wait">
            {email === '' ?
                <motion.div
                    className='window login-window'
                    key="initial"
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ ease: "easeInOut", duration: 0.25 }}
                >
                    <InitialContent />
                </motion.div>
                :
                <motion.div
                    className='window login-window'
                    key="authenticate"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ease: "easeInOut", duration: 0.25 }}
                >
                    <AuthenticateContent />
                </motion.div>
            }
        </AnimatePresence>
    )
}

export default LoginWindow
