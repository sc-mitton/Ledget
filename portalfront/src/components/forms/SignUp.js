import React from "react"

import { Link } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { object, string } from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"

import './style/SignUp.css'
import FacebookLogo from "../../assets/icons/FacebookLogo"
import GoogleLogo from "../../assets/icons/GoogleLogo"
import alert2 from '../../assets/icons/alert2.svg'
import { Checkbox } from './CustomInputs'

// Schema for yup form validation
const schema = object().shape({
    email: string()
        .email('Email is invalid.')
        .required('Please enter your email address.')
})

function SignUpForm() {
    const { register, handleSubmit, formState: { errors, isValid, }, watch, trigger, setError }
        = useForm({ resolver: yupResolver(schema), mode: 'onBlur' })
    const [errMsg, setErrMsg] = useState('')
    const emailRef = useRef()

    useEffect(() => {
        emailRef.current.focus()
    }, [])

    const onSubmit = (data) => {
        console.log(data)
    }

    const hasError = (field) => {
        return errors[field] ? true : false
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="sign-up-form" noValidate>
            {errMsg &&
                <div className="server-error">
                    <img src={alert2} alt='' />{errMsg}
                </div>
            }
            <div className="input-container">
                <input
                    id="email"
                    name="email"
                    placeholder="Email"
                    required
                    {...register('email')}
                    onBlur={(e) => {
                        if (e.target.value) {
                            trigger("email")
                        }
                    }}
                    ref={emailRef}
                />
            </div>
            {hasError('email') &&
                <div id="signup-error-container">
                    <div className="form-error">
                        <img src={alert2} className="error-icon" />
                        {errors.email?.message}
                    </div>
                </div>
            }
            <div id="remember-me-checkbox-container">
                <Checkbox id='remember-me' label='Remember' />
            </div>
            <div>
                <button
                    className='charcoal-button'
                    id="subscribe-button"
                    type='submit'
                    aria-label="Submit form"
                >
                    Next
                </button>
            </div>
        </form>
    )
}

function SocialSignup() {
    return (
        <div className="social-login-container">
            <div>Or sign up with</div>
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

function SignUpWindow() {
    return (
        <div className='window sign-up-window'>
            <h2>Create Account</h2>
            <SignUpForm />
            <SocialSignup />
            <div className="below-window-container">
                <span>Have an account?  </span>
                <Link to={{
                    pathname: "/login",
                    state: { direction: 1 }
                }}>Sign In</Link>
            </div>
        </div>
    )
}

export default SignUpWindow
