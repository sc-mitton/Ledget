import React, { useRef, useState, useEffect, useContext, createContext } from "react"

import { Link, useSearchParams } from "react-router-dom"
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
import WebAuthnModal from "./modals/WebAuthn"

const emailContext = createContext({})

const EmailContextProvider = ({ children }) => {
    const [email, setEmail] = useState(null)

    useEffect(() => {
        setEmail(JSON.parse(localStorage.getItem('loginEmail')))
    }, [setEmail])

    return (
        <emailContext.Provider value={{ email, setEmail }}>
            {children}
        </emailContext.Provider>
    )
}

const schema = object().shape({
    email: string().email("Invalid email address"),
})

const EmailForm = () => {
    const emailRef = useRef()
    const { register, handleSubmit, formState: { errors } } =
        useForm({ resolver: yupResolver(schema), mode: 'onBlur' })
    const { ref, ...rest } = register('email')
    const { flow } = useContext(LoginFlowContext)
    const { setEmail } = useContext(emailContext)
    const rememberRef = useRef()

    useEffect(() => {
        // Focus email once flow is set
        flow && emailRef.current.focus()
    }, [flow])

    return (
        <form
            onSubmit={handleSubmit((e) => {
                if (emailRef.current.value === '') {
                    emailRef.current.focus()
                } else {
                    if (rememberRef.current.checked) {
                        localStorage.setItem('loginEmail', JSON.stringify(emailRef.current.value))
                    } else {
                        localStorage.removeItem('loginEmail')
                    }
                    setEmail(emailRef.current.value)
                }
            })}
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
                        ref={rememberRef}
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
                <Link to={{ pathname: "/register", state: { direction: 1 } }}>
                    Sign Up
                </Link>
            </div>
            <WindowLoadingBar visible={!flow} />
        </>
    )
}

const AuthenticationWindow = () => {
    const pwdRef = useRef()
    const { flow, submit, responseError, authenticating, CsrfToken } = useContext(LoginFlowContext)
    const { email, setEmail } = useContext(emailContext)
    const initialEmailValue = useRef(email);
    const [webAuthnModalVisible, setWebAuthnModalVisible] = useState(false)

    useEffect(() => {
        pwdRef.current.focus()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (pwdRef.current.value === '') {
            pwdRef.current.focus()
        } else {
            submit(e)
        }
    }

    return (
        <>
            <WebAuthnModal visible={webAuthnModalVisible} setVisible={setWebAuthnModalVisible} />
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <div id="email-container">
                <span>{`${initialEmailValue.current}`}</span>
                <a
                    onClick={() => setEmail(null)}
                >
                    change
                </a>
            </div>
            <WindowLoadingBar visible={authenticating || flow == null} />
            <form
                action={flow?.ui.action}
                method={flow?.ui.method}
                onSubmit={handleSubmit}
                id="authentication-form"
            >
                {responseError && <FormError msg={responseError} />}
                <PasswordInput ref={pwdRef} />
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
                >
                    Sign In
                </button>
                <div className="passwordless-options">
                    <div className="passwordless-options-header" >
                        Passwordless
                        <button
                            className="help-icon"
                            onClick={() => setWebAuthnModalVisible(true)}
                            aria-label="Learn more about passwordless options"
                            type="button"
                        >
                            <Help />
                        </button>
                    </div>
                    <div className="passwordless-options-container">
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

function LoginFlow() {
    const [loaded, setLoaded] = useState(false)
    const { email } = useContext(emailContext)
    const { getFlow, createFlow } = useContext(LoginFlowContext)
    const [searchParams] = useSearchParams()

    useEffect(() => { setLoaded(true) }, [])

    useEffect(() => {
        // we might redirect to this page after the flow is initialized,
        // so we check for the flowId in the URL
        const flowId = searchParams.get("flow")
        const returnTo = searchParams.get("return_to")
        const aal2 = searchParams.get("aal2")
        // the flow already exists

        // if the flow has expired, we need to get a new one
        flowId ? getFlow(flowId).catch(createFlow) : createFlow()
    }, [])

    return (
        <AnimatePresence mode="wait">
            {email === null ?
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

const Login = () => {

    return (
        <LoginFlowContextProvider>
            <EmailContextProvider>
                <LoginFlow />
            </EmailContextProvider>
        </LoginFlowContextProvider>
    )
}

export default Login
