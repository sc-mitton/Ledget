import React from 'react'
import { useRef, useState, useEffect, useContext } from "react"

import { useNavigate, useLocation, Link } from "react-router-dom"

import './style/Login.css'
import webAuthn from "../../assets/icons/webAuthn.svg"
import FacebookLogo from "../../assets/icons/FacebookLogo"
import GoogleLogo from "../../assets/icons/GoogleLogo"
import alert2 from "../../assets/icons/alert2.svg"
import AuthContext from "../../context/AuthContext"
import apiAuth from "../../api/axios"

function LoginForm() {
    const { setTokenExpiration } = useContext(AuthContext)

    const navigate = useNavigate()

    const emailRef = useRef()
    const pwdRef = useRef()
    const submitButtonRef = useRef(null)

    const [errMsg, setErrMsg] = useState('')

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
                        type="identifier"
                        id="identifier"
                        name="identifier"
                        val={emailRef}
                        placeholder="Email or Phone"
                        ref={emailRef}
                        required
                    />
                </div>
                <div>
                    <button
                        className='charcoal-button'
                        id="next"
                        name="enter-password"
                        type="submit"
                        ref={submitButtonRef}
                    >
                        Next
                    </button>
                </div>
            </div>
        </form >
    )
}

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

    return (
        <div className='window login-window'>
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
        </div>
    )
}

export default LoginWindow
