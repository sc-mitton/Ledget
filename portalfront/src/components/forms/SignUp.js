import React from "react"

import { Form, Link } from "react-router-dom"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { object, string, ref } from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form"

import fbLogo from "../../assets/images/fbLogo.svg"
import googleLogo from "../../assets/images/googleLogo.svg"
import logo from "../../assets/images/logo.svg"
import alert from "../../assets/icons/alert.svg"
import PasswordInput from "./PasswordInput"
import { FormErrorTip } from "./Widgets"
import AuthContext from "../../context/AuthContext"
import apiAuth from "../../api/axios"


const schema = object().shape({
    email: string().email("Please enter a valid email address.")
        .required("Please enter your email address."),
    password: string()
        .test("Password must be at least 10 characters long.",
            (value) => value.length >= (10) ? true : false
        ).required("Password must be at least 10 characters long."),
    confirmPassword: string().oneOf([ref('password'), null], 'Passwords must match.')
})

function SignUpForm() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur'
    })
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();
    const { setAuth, setTokenExpiration } = React.useContext(AuthContext);


    const onSubmit = (data) => {
        console.log(data)
    }

    const hasError = (field) => {
        return errors[field] ? true : false;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="sign-up-form" method="post">
            {serverError &&
                <div className="error" ref={errRef}>
                    <img src={alert} alt='' />{serverError}
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
                />
                {hasError('email') && <FormErrorTip msg={''} />}
            </div>
            <div className="inline-error">{errors.email?.message}</div>
            <PasswordInput
                confirmPassword={true}
                register={register}
            />
            <span>{errors.password?.message}</span>
            <span>{errors.confirmPassword?.message}</span>
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
        <div className='window sign-up-window'>
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <h3>Create Account</h3>
            <SignUpForm />
            <SocialSignup />
            <div className="login-prompt-container">
                <span>Already using Ledget?  </span>
                <Link to="/login">Sign In</Link>
            </div>
        </div>

    )
}

export default SignUpWindow
