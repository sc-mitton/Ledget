import React, { useRef, useState, useEffect, useContext, createContext } from "react"

import { Link, useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { object, string } from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"

import './style/Login.css'
import logo from "@assets/images/logo.svg"
import logoIcon from "@assets/images/logoIcon.svg"
import BackArrow from "@assets/icons/BackArrow"
import SocialAuth from "./SocialAuth"
import PasswordInput from "./inputs/PasswordInput"
import { PasskeySignIn } from "./inputs/PasswordlessForm"
import Checkbox from "./inputs/Checkbox"
import { FormError, WindowLoadingBar } from "../pieces"
import { LoginFlowContext, LoginFlowContextProvider } from "../../context/Flow"
import CsrfToken from "./inputs/CsrfToken"

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
    const { register, handleSubmit, formState: { errors } } =
        useForm({ resolver: yupResolver(schema), mode: 'onBlur' })
    const { ref, ...rest } = register('email')
    const { flow } = useContext(LoginFlowContext)
    const { setEmail } = useContext(emailContext)
    const rememberRef = useRef()
    const emailRef = useRef()

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
                    className="btn-main btn-chcl"
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
    const { flow, submit, csrf } = useContext(LoginFlowContext)

    return (
        <>
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <h2>Sign in to Ledget</h2>
            <EmailForm />
            <SocialAuth flow={flow} submit={submit} csrf={csrf} />
            <div className="below-window-container">
                <span>Don't have an account? </span>
                <Link to={{ pathname: "/register", state: { direction: 1 } }}>
                    Sign Up
                </Link>
            </div>
            <WindowLoadingBar visible={!flow} />
        </>
    )
}

const AuthenticationForm = () => {
    const { flow, submit, responseError, csrf } = useContext(LoginFlowContext)
    const { email } = useContext(emailContext)

    const handleSubmit = (e) => {
        e.preventDefault()

        if (pwdRef.current.value === '') {
            pwdRef.current.focus()
        } else {
            submit(e)
        }
    }

    const pwdRef = useRef()

    useEffect(() => {
        pwdRef.current.focus()
    }, [])

    return (
        <>
            <form
                action={flow?.ui.action}
                method={flow?.ui.method}
                onSubmit={handleSubmit}
                id="authentication-form"
            >
                {responseError && <FormError msg={responseError} />}
                <PasswordInput ref={pwdRef} />
                {/* <div id="forgot-password-container">
                    <Link to="/recovery" tabIndex={0} >Forgot Password?</Link>
                </div> */}
                <input
                    type="hidden"
                    name="identifier"
                    value={email || ''}
                />
                <CsrfToken csrf={csrf} />
                <button
                    className='btn-chcl btn-main'
                    name="method"
                    value="password"
                    type="submit"
                >
                    Sign In
                </button>
                {(typeof (PublicKeyCredential) != "undefined") && <PasskeySignIn />}
            </form >
        </>
    )
}

const AuthenticationWindow = () => {
    const { flow, authenticating, } = useContext(LoginFlowContext)
    const { email, setEmail } = useContext(emailContext)
    const initialEmailValue = useRef(email)

    return (
        <>
            <WindowLoadingBar visible={authenticating || flow == null} />
            <div className="app-logo" >
                <img src={logoIcon} alt="Ledget" />
            </div>
            <div id="email-container">
                <h3>Welcome Back</h3>
                <div>
                    <button
                        className="btn-icon"
                        aria-label="Back"
                        onClick={() => {
                            setEmail(null)
                        }}
                        style={{
                            marginTop: '1px',
                            marginRight: '6px',
                        }}
                    >
                        <BackArrow />
                    </button>
                    <span>{`${initialEmailValue.current}`}</span>
                </div>
            </div>
            <AuthenticationForm />
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

        // if the flow has expired, we need to get a new one
        flowId ? getFlow(flowId).catch(createFlow) : createFlow()
    }, [])

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
        }}
        >
            <AnimatePresence mode="wait">
                {email === null
                    ?
                    <motion.div
                        className='window2'
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
                        className='window2'
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
        </div>
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
