import React, { useRef, useState, useEffect, useContext, createContext } from "react"

import { Link, useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { object, string } from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"

import './style/Login.css'
import SocialAuth from "./SocialAuth"
import { PasskeySignIn } from "./inputs/PasswordlessForm"
import CsrfToken from "./inputs/CsrfToken"
import { WindowLoadingBar } from "@pieces"
import { LoginFlowContext, LoginFlowContextProvider } from "@context/Flow"
import {
    GrnWideButton,
    TextInput,
    Checkbox,
    FormError,
    PasswordInput,
    BackButton,
    SlideMotionDiv,
    PlainTextInput
} from "@ledget/shared-ui"

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

    const submit = (e) => {
        e.preventDefault()
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
    }

    return (
        <form onSubmit={handleSubmit((data, e) => submit(e))} className="login-form">
            <div>
                <PlainTextInput
                    type="email"
                    name="email"
                    placeholder="Email"
                    {...rest}
                    ref={(e) => {
                        ref(e)
                        emailRef.current = e
                    }}
                />
                {errors['email'] && <FormError msg={errors['email'].message} />}
                <div id="remember-me-checkbox-container">
                    <Checkbox
                        id='remember'
                        label='Remember me'
                        name='remember'
                        ref={rememberRef}
                    />
                </div>
                <GrnWideButton>Continue</GrnWideButton>
            </div>
        </form >
    )
}

const InitialWindow = () => {
    const { flow, submit, csrf } = useContext(LoginFlowContext)

    return (
        <>
            <div className="window-header">
                <h2>Sign in to Ledget</h2>
            </div>
            <EmailForm />
            <SocialAuth flow={flow} submit={submit} csrf={csrf} />
            <WindowLoadingBar visible={!flow} />
        </>
    )
}

const AuthenticationForm = () => {
    const { flow, submit, responseError, csrf } = useContext(LoginFlowContext)
    const { email } = useContext(emailContext)
    const pwdRef = useRef()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (pwdRef.current.value === '') {
            pwdRef.current.focus()
            return
        }
        submit(e)
    }

    useEffect(() => { pwdRef.current.focus() }, [])

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
                <div id="forgot-password-container">
                    <Link to="/recovery" tabIndex={0}>Forgot Password?</Link>
                </div>
                <GrnWideButton name="method" value="password">
                    Sign In
                </GrnWideButton>
                {(typeof (PublicKeyCredential) != "undefined") && <PasskeySignIn />}

                <input type="hidden" name="identifier" value={email || ''} />
                <CsrfToken csrf={csrf} />
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
            <div id="email-container">
                <h3>Welcome Back</h3>
                <div>
                    <BackButton
                        withText={false}
                        onClick={() => { setEmail(null) }}
                        style={{ marginTop: '1px', marginRight: '6px' }}
                    >
                        <span>{`${initialEmailValue.current}`}</span>
                    </BackButton>
                </div>
            </div>
            <AuthenticationForm />
        </>
    )
}

function LoginFlow() {
    const { email } = useContext(emailContext)
    const { getFlow, createFlow } = useContext(LoginFlowContext)
    const [searchParams] = useSearchParams()

    useEffect(() => {
        // we might redirect to this page after the flow is initialized,
        // so we check for the flowId in the URL
        const flowId = searchParams.get("flow")
        // if the flow has expired, we need to get a new one
        flowId ? getFlow(flowId).catch(createFlow) : createFlow()
    }, [])

    return (
        <AnimatePresence mode="wait">
            {email === null
                ?
                <SlideMotionDiv className='window' key="initial" first>
                    <InitialWindow />
                </SlideMotionDiv>
                :
                <SlideMotionDiv className='window' key="authenticate" last>
                    <AuthenticationWindow />
                </SlideMotionDiv>
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
