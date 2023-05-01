import React from "react"

import { Link } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { object, string, ref } from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"

import fbLogo from "../../assets/images/fbLogo.svg"
import googleLogo from "../../assets/images/googleLogo.svg"
import logo from "../../assets/images/logo.svg"
import alert2 from '../../assets/icons/alert2.svg'
import AuthContext from "../../context/AuthContext"
import apiAuth from "../../api/axios"
import { PasswordInput } from "./CustomInputs"

// Schema for yup form validation
const schema = object().shape({
    email: string()
        .email("Please enter a valid email address")
        .required("Please enter your email address"),
    password: string()
        .test("length", "Must be at least 10 characters long",
            (value) => value.length >= (10) ? true : false
        ).required("Enter a password at least 10 characters long"),
    confirmPassword: string()
        .oneOf([ref('password'), null], 'Passwords must match')
})

function SignUpForm() {
    const { register, handleSubmit, formState: { errors, isValid, }, watch, trigger, setError }
        = useForm({ resolver: yupResolver(schema), mode: 'onBlur' })
    const [errMsg, setErrMsg] = useState('')
    const [visible, setVisible] = useState(false)
    const { setTokenExpiration } = React.useContext(AuthContext)
    const navigate = useNavigate()
    const password = watch({ name: 'password' })
    const submitButtonRef = useRef(null)


    const hasError = (field) => {
        return errors[field] ? true : false
    }

    const handleSuccessfulResponse = (response) => {
        sessionStorage.setItem(
            'access_token_expiration',
            response.data?.access_token_expiration
        )
        sessionStorage.setItem(
            'user',
            JSON.stringify(response.data.user)
        )
        navigate('/checkout')
    }

    const handleErrorResponse = (err) => {
        if (err.response.data.email) {
            setError(
                'email',
                { type: 'manual', message: err.response.data.email }
            )
        } else {
            setErrMsg(err.response.status)
        }
    }

    const onSubmit = (data) => {
        apiAuth.post('/user', data)
            .then((response) => {
                handleSuccessfulResponse(response)
            })
            .catch((err) => {
                handleErrorResponse(err)
            })
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault()
            submitButtonRef.current.focus()
        }
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
                    type="email"
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
                    tabIndex={1}
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
            <PasswordInput
                name="password"
                placeholder="Password"
                register={register}
                visible={visible}
                setVisible={setVisible}
                tabIndex={2}
            />
            {hasError('password') &&
                <div id="signup-error-container">
                    <div className="form-error">
                        <img src={alert2} className="error-icon" />
                        {errors.password?.message}
                    </div>
                </div>
            }
            <PasswordInput
                name="confirmPassword"
                placeholder="Confirm password"
                register={register}
                visIcon={false}
                visible={visible}
                setVisible={setVisible}
                tabIndex={3}
                onKeyDown={handleKeyDown}
            />
            {hasError('confirmPassword') &&
                <div id="signup-error-container">
                    <div className="form-error">
                        <img src={alert2} className="error-icon" />
                        {errors.confirmPassword?.message}
                    </div>
                </div>
            }
            <div id="submit-button-container">
                <button
                    className={`${isValid ? 'valid' : 'invalid'}-submit`}
                    id="subscribe-button"
                    type='submit'
                    ref={submitButtonRef}
                    aria-label="Submit form"
                >
                    Sign Up
                </button>
            </div>
        </form>
    )
}

function SocialSignup() {
    return (
        <div className="social-signup-container">
            <div className="or-continue-with">Or sign up with</div>
            <div className="social-buttons-container">
                <button
                    id="google-auth-button"
                    aria-label="Google sign up"
                >
                    <img src={googleLogo} alt="Google" />
                </button>
                <button
                    id="facebook-auth-button"
                    aria-label="Facebook sign up"
                >
                    <img src={fbLogo} alt="Facebook" />
                </button>
            </div>
        </div>
    )
}

function SignUpWindow() {
    return (
        <div className='window sign-up-window'>
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <h3>Create Account</h3>
            <SignUpForm />
            <SocialSignup />
            <div className="login-prompt-container">
                <span>Already using Ledget?  </span>
                <Link to={{
                    pathname: "/login",
                    state: { direction: 1 }
                }}>Sign In</Link>
            </div>
        </div>
    )
}

export default SignUpWindow
