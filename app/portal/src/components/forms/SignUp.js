import React, { useContext, useEffect, createContext, useState } from "react"

import { Link, useSearchParams } from "react-router-dom"
import { object, string } from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"

import './style/SignUp.css'
import logo from "../../assets/images/logo.svg"
import SocialAuth from "./SocialAuth"
import { FormError } from "../widgets/Widgets"
import { RegisterFlowContext, RegisterFlowContextProvider } from "../../context/Flow"
import { WindowLoadingBar } from "../widgets/Widgets"

const userInfoContext = createContext({})

const UserInfoContextProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({})

    return (
        <userInfoContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </userInfoContext.Provider>
    )
}

// Schema for yup form validation
const schema = object().shape({
    name: string()
        .required('Please enter your name')
        .matches(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'Please enter a valid name')
        .test('two-words', 'Missing last name', (value) => {
            if (value) {
                const words = value.trim().split(' ')
                return words.length === 2
            }
            return true
        }),
    email: string()
        .email('Email is invalid')
        .required('Please enter your email address'),
})

function SignUpForm() {
    return (
        <>
        </>
    )
}

function UserInfoForm() {
    const { register, handleSubmit, formState: { errors }, trigger, setError }
        = useForm({ resolver: yupResolver(schema), mode: 'onBlur' })
    const { CsrfToken, responseError } = useContext(RegisterFlowContext)
    const { setUserInfo } = useContext(userInfoContext)

    const hasError = (field) => {
        return errors[field] ? true : false
    }

    const submit = (data) => {
        setUserInfo(data)
    }

    return (
        <form onSubmit={handleSubmit((e) => submit(data))} className="sign-up-form" noValidate>
            {responseError && <FormError msg={responseError} />}
            <div className="input-container">
                <input
                    id="name"
                    name="name"
                    placeholder="First and last name"
                    {...register('name')}
                    onBlur={(e) => {
                        if (e.target.value) {
                            trigger("name")
                        }
                    }}
                />
            </div>
            {hasError('name') && <FormError msg={errors.name?.message} />}
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
                />
            </div>
            <CsrfToken />
            {hasError('email') &&
                <div id="signup-error-container">
                    <FormError msg={errors.email?.message} />
                </div>
            }
            <div>
                <button
                    className='charcoal-button continue-button'
                    type='submit'
                    aria-label="Submit form"
                >
                    Continue
                </button>
            </div>
        </form>
    )
}

const SignUpWindow = () => {
    const { flow, submit, CsrfToken } = useContext(RegisterFlowContext)

    return (
        <>
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <h2>Create Account</h2>
            <UserInfoForm />
            <SocialAuth flow={flow} submit={submit} CsrfToken={CsrfToken} />
            <div className="below-window-container">
                <span>Have an account?  </span>
                <Link to={{
                    pathname: "/login",
                    state: { direction: 1 }
                }}>Sign In</Link>
            </div>
            {!flow && <WindowLoadingBar />}
        </>
    )
}

const AuthSelectionWindow = () => {
    const { userInfo, setUserInfo } = useContext(userInfoContext)
    const { flow, responseError, CsrfToken, registering } = useContext(RegisterFlowContext)

    return (
        <>
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <div id="email-container">
                <span>{`${userInfo.email}`}</span>
                <a
                    onClick={() => setUserInfo({})}
                >
                    change
                </a>
            </div>
            {registering && <WindowLoadingBar />}
            <form
                action={flow.ui.action}
                method={flow.ui.method}
                onSubmit={submit}
                id="authentication-form"
            >
                {responseError && <FormError msg={responseError} />}
                <PasswordInput ref={pwdRef} />
                {error && <FormError msg={error} />}
                <div id="forgot-password-container">
                    <Link to="#" tabIndex={0} >Forgot Password?</Link>
                </div>
                <CsrfToken />
                <input
                    type="hidden"
                    name="identifier"
                    value={userInfo.email || ''}
                />
                <button
                    className='charcoal-button'
                    id="sign-in"
                    name="method"
                    value="password"
                    type="submit"
                    aria-label="Sign in"
                >
                    Continue
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

function SignUpFlow() {
    const { createFlow, getFlow } = useContext(RegisterFlowContext)
    const { userInfo } = useContext(userInfoContext)
    const [searchParams] = useSearchParams()
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        // we might redirect to this page after the flow is initialized,
        // so we check for the flowId in the URL
        const flowId = searchParams.get("flow")
        if (flowId) {
            getFlow(flowId).catch(createFlow) // Get new flow if it's expired
            return
        }
        createFlow()
    }, [])

    useEffect(() => { setLoaded(true) }, [])

    return (
        <AnimatePresence mode="wait">
            {userInfo ?
                <motion.div
                    className='window'
                    key="sign-up"
                    initial={{ opacity: 0, x: !loaded ? 0 : -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                >
                    <SignUpWindow />
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
                    <AuthSelectionWindow />
                </motion.div>
            }
        </AnimatePresence>
    )
}

const SignUp = () => {
    return (
        <RegisterFlowContextProvider>
            <UserInfoContextProvider>
                <SignUpFlow />
            </UserInfoContextProvider>
        </RegisterFlowContextProvider>
    )
}


export default SignUp
