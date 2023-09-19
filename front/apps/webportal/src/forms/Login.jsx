import React, { useRef, useState, useEffect, useContext } from "react"

import { Link } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
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
    Checkbox,
    FormError,
    PasswordInput,
    BackButton,
    SlideMotionDiv,
    PlainTextInput,
    JiggleDiv
} from "@ledget/shared-ui"


const schema = object().shape({
    email: string().email("Invalid email address"),
})

const EmailForm = ({ setEmail }) => {
    const { register, handleSubmit, formState: { errors } } =
        useForm({ resolver: yupResolver(schema), mode: 'onBlur' })
    const { ref, ...rest } = register('email')
    const { flow } = useContext(LoginFlowContext)
    const rememberRef = useRef()
    const emailRef = useRef()

    useEffect(() => {
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

const AuthenticationForm = ({ email }) => {
    const { flow, submit, responseError, csrf } = useContext(LoginFlowContext)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (pwdRef.current.value === '') {
            pwdRef.current.focus()
            return
        }
        submit(e)
    }

    const pwdRef = useRef()
    useEffect(() => { pwdRef.current.focus() }, [])

    return (
        <>
            <form
                action={flow?.ui.action}
                method={flow?.ui.method}
                onSubmit={handleSubmit}
                id="authentication-form"
            >
                <JiggleDiv jiggle={responseError}>
                    <PasswordInput ref={pwdRef} />
                </JiggleDiv>
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

const LoginFlow = () => {
    const [email, setEmail] = useState(null)
    const { flow, fetchFlow, isFetchingFlow, submit, csrf, submittingFlow } = useContext(LoginFlowContext)

    useEffect(() => {
        fetchFlow({ aal: 'aal1', refresh: true })
    }, [])

    return (
        <AnimatePresence mode="wait">
            {email === null
                ?
                <SlideMotionDiv className='window' key="initial" first>
                    <div className="window-header">
                        <h2>Sign in to Ledget</h2>
                    </div>
                    <EmailForm setEmail={setEmail} />
                    <SocialAuth flow={flow} submit={submit} csrf={csrf} />
                    <WindowLoadingBar visible={isFetchingFlow} />
                </SlideMotionDiv>
                :
                <SlideMotionDiv className='window' key="authenticate" last>
                    <WindowLoadingBar visible={submittingFlow || isFetchingFlow} />
                    <div id="email-container">
                        <h3>Welcome Back</h3>
                        <div>
                            <BackButton
                                withText={false}
                                onClick={() => { setEmail(null) }}
                                style={{ marginTop: '1px', marginRight: '6px' }}
                            >
                                <span>{`${email}`}</span>
                            </BackButton>
                        </div>
                    </div>
                    <AuthenticationForm email={email} />
                </SlideMotionDiv>
            }
        </AnimatePresence>
    )
}

const Login = () => (
    <LoginFlowContextProvider>
        <LoginFlow />
    </LoginFlowContextProvider>
)

export default Login
