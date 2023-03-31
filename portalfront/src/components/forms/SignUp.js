import React from "react"

import { Link } from "react-router-dom"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { object, string, ref } from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form"

import fbLogo from "../../assets/images/fbLogo.svg"
import googleLogo from "../../assets/images/googleLogo.svg"
import logo from "../../assets/images/logo.svg"
import alert from "../../assets/icons/alert.svg"
import AuthContext from "../../context/AuthContext"
import apiAuth from "../../api/axios"
import { PasswordInput } from "./CustomInputs"
import alert2 from '../../assets/icons/alert2.svg';

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
    const { register, handleSubmit, formState: { errors, dirtyFields } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur'
    })
    const [serverError, setServerError] = useState('');
    const [visible, setVisible] = useState(false)
    const { setAuth, setTokenExpiration } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const hasError = (field) => {
        return errors[field] ? true : false;
    }

    const onSubmit = (data) => {
        console.log(data)
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
            </div>
            {hasError('email') &&
                <div id="signup-error-container">

                    <div className="form-error">
                        <img src={alert2} className="error-tip-icon" />
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
            />
            {hasError('password') &&
                <div id="signup-error-container">

                    <div className="form-error">
                        <img src={alert2} className="error-tip-icon" />
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
            />
            {hasError('confirmPassword') &&
                <div id="signup-error-container">
                    <div className="form-error">
                        <img src={alert2} className="error-tip-icon" />
                        {errors.confirmPassword?.message}
                    </div>
                </div>
            }
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
