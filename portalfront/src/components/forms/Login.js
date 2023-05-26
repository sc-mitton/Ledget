import React, { useRef, useState, useEffect, useContext, createContext } from "react"

import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { object, string } from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"

import './style/Login.css'
import webAuthn from "../../assets/icons/webAuthn.svg"
import Help from "../../assets/icons/Help"
import logo from "../../assets/images/logo.svg"
import SocialAuth from "./SocialAuth"
import { PasswordInput } from "./CustomInputs"
import { Checkbox } from "./CustomInputs"
import { FormError, WindowLoadingBar } from "../widgets/Widgets"
import { LoginFlowContext, LoginFlowContextProvider } from "../../context/Flow"

const emailContext = createContext(null)

const EmailContextProvider = ({ children }) => {
    const [email, setEmail] = useState('')

    return (
        <emailContext.Provider value={{ email, setEmail }}>
            {children}
        </emailContext.Provider>
    )
}

const schema = object().shape({
    email: string().email("Invalid email address."),
})

const EmailForm = () => {
    const emailRef = useRef()
    const { register, handleSubmit, formState: { errors } } =
        useForm({ resolver: yupResolver(schema), mode: 'onBlur' })
    const { ref, ...rest } = register('email')
    const { flow } = useContext(LoginFlowContext)
    const { setEmail } = useContext(emailContext)

    useEffect(() => {
        flow && emailRef.current.focus()
    }, [flow])

    return (
        <form
            onSubmit={handleSubmit(() => setEmail(emailRef.current.value))}
            className="login-form"
            noValidate
        >
            <div>
                <div className="input-container">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        {...rest}
                        ref={(e) => {
                            ref(e)
                            emailRef.current = e
                        }}
                    />
                </div>
                {errors['email'] && <FormError msg={errors['email'].message} />}
                <div id="remember-me-checkbox-container">
                    <Checkbox
                        id='remember'
                        label='Remember me'
                        name='remember'
                    />
                </div>
                <button
                    className='charcoal-button'
                    id="next"
                    name="enter-password"
                    aria-label="Continue"
                    type="submit"
                >
                    Continue
                </button>
            </div>
        </form >
    )
}

const InitialWindow = () => {
    const { flow, submit, CsrfToken } = useContext(LoginFlowContext)

    return (
        <>
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <h2>Sign In</h2>
            <EmailForm />
            <SocialAuth flow={flow} submit={submit} CsrfToken={CsrfToken} />
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
            {!flow && <WindowLoadingBar />}
        </>
    )
}

const AuthenticationWindow = () => {
    const pwdRef = useRef()
    const [error, setError] = useState('')
    const { flow, submit, responseError, authenticating, CsrfToken } = useContext(LoginFlowContext)
    const { email, setEmail } = useContext(emailContext)

    useEffect(() => {
        pwdRef.current.focus()
    }, [])

    return (
        <>
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <div id="email-container">
                <span>{`${email}`}</span>
                <a
                    onClick={() => setEmail('')}
                >
                    change
                </a>
            </div>
            {authenticating && <WindowLoadingBar />}
            <form
                action={flow.ui.action}
                method={flow.ui.method}
                onSubmit={submit}
                id="authentication-form"
            >
                <PasswordInput ref={pwdRef} />
                {error && <FormError msg={error} />}
                {responseError && <FormError msg={responseError} />}
                <div id="forgot-password-container">
                    <Link to="#" tabIndex={0} >Forgot Password?</Link>
                </div>
                <CsrfToken />
                <input
                    type="hidden"
                    name="identifier"
                    value={email || ''}
                />
                <button
                    className='charcoal-button'
                    id="sign-in"
                    name="method"
                    value="password"
                    type="submit"
                    aria-label="Sign in"
                >
                    Sign In
                </button>
                <div id="passwordless-options">
                    <div id="passwordless-options-header" >
                        Passwordless
                        <div className="help-icon">
                            <Help />
                        </div>
                    </div>
                    <div id="passwordless-options-container">
                        <button
                            name="passwordless-options"
                            type="submit"
                        >
                            <img src={webAuthn} id="webauthn-icon" alt='webauthn icon' />
                        </button>
                    </div>
                </div>
            </form >
        </>
    )
}


function AnimatedWindows() {
    const [loaded, setLoaded] = useState(false)
    const { email } = useContext(emailContext)

    useEffect(() => {
        setLoaded(true)
    }, [])

    return (
        <AnimatePresence mode="wait">
            {email === '' ?
                <motion.div
                    className='window'
                    key="initial"
                    initial={{ opacity: 0, x: !loaded ? 0 : -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                >
                    <InitialWindow />
                </motion.div>
                :
                <motion.div
                    className='window'
                    key="authenticate"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                >
                    <AuthenticationWindow />
                </motion.div>
            }
        </AnimatePresence>
    )
}

const LoginWindow = () => {
    return (
        <LoginFlowContextProvider>
            <EmailContextProvider>
                <AnimatedWindows />
            </EmailContextProvider>
        </LoginFlowContextProvider>
    )
}

export default LoginWindow
