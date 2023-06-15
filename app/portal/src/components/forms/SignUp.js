import React, { useContext, useEffect, createContext, useState, useRef } from "react"

import { Form, Link, useSearchParams } from "react-router-dom"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"

import './style/SignUp.css'
import logo from "../../assets/images/logo.svg"
import Help from "../../assets/icons/Help"
import webAuthn from "../../assets/icons/webAuthn.svg"
import SocialAuth from "./SocialAuth"
import { FormError } from "../widgets/Widgets"
import { RegisterFlowContext, RegisterFlowContextProvider } from "../../context/Flow"
import { WindowLoadingBar } from "../widgets/Widgets"
import { PasswordInput } from "./CustomInputs"
import WebAuthnModal from "./modals/WebAuthn"

// Context for user info
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
const schema = yup.object().shape({
    name: yup.string()
        .required('Please enter your name')
        .matches(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'Please enter a valid name')
        .test('two-words', 'Missing last name', (value) => {
            if (value) {
                const words = value.trim().split(' ')
                return words.length === 2
            }
            return true
        }),
    email: yup.string()
        .email('Email is invalid')
        .required('Please enter your email address'),
})

function UserInfoForm() {
    // Form for user info

    const { register, handleSubmit, formState: { errors }, trigger }
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
        <form onSubmit={handleSubmit((e) => submit(e))} className="sign-up-form" noValidate>
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

const UserInfoWindow = () => {
    // Form window for entering user info (name, email), or signing in with social auth

    const { flow, submit, CsrfToken } = useContext(RegisterFlowContext)

    return (
        <>
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <div className="signup-steps-container">
                <span>Step 1 of 3</span>
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
            <WindowLoadingBar visible={!flow} />
        </>
    )
}

const passwordSchema = yup.object().shape({
    password: yup.string()
        .required('Please enter a password')
        .min(10, 'Password must be at least 10 characters'),
    confirmPassword: yup.string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password'), null], 'Passwords must match')
})

const AuthSelectionWindow = () => {
    const { userInfo } = useContext(userInfoContext)
    const { flow, responseError, CsrfToken, registering, submit } = useContext(RegisterFlowContext)
    const { register, handleSubmit, formState: { errors }, trigger } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(passwordSchema)
    })
    const [pwdVisible, setPwdVisible] = useState(false)
    const [webAuthnModalVisible, setWebAuthnModalVisible] = useState(false)

    return (
        <>
            <WebAuthnModal visible={webAuthnModalVisible} setVisible={setWebAuthnModalVisible} />
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <div className="signup-steps-container">
                <span>Step 2 of 3</span>
            </div>
            <WindowLoadingBar visible={registering} />
            <form
                action={flow.ui.action}
                method={flow.ui.method}
                onSubmit={handleSubmit((data, e) => submit(e))}
                id="authentication-form"
            >
                {responseError && <FormError msg={responseError} />}
                <PasswordInput
                    name='password'
                    register={register}
                    pwdVisible={pwdVisible}
                    setPwdVisible={setPwdVisible}
                    trigger={trigger}
                />
                {errors['password'] && <FormError msg={errors.password?.message} />}
                <PasswordInput
                    name='confirmPassword'
                    inputType="confirm-password"
                    placeholder="Confirm"
                    register={register}
                    pwdVisible={pwdVisible}
                    setPwdVisible={setPwdVisible}
                    trigger={trigger}
                />
                {errors['confirmPassword'] && <FormError msg={errors.confirmPassword?.message} />}
                <CsrfToken />
                <input type='hidden' name='traits.email' value={userInfo.email} />
                <input type='hidden' name='traits.name.first' value={userInfo.name.split(' ')[0]} />
                <input type='hidden' name='traits.name.last' value={userInfo.name.split(' ')[1]} />
                <button
                    className='charcoal-button'
                    id="sign-in"
                    name="method"
                    value="password"
                    type="submit"
                >
                    Create
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
                            aria-label="Sign in with passwordless options"
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
            {Object.keys(userInfo).length === 0 ?
                <motion.div
                    className='window'
                    key="sign-up"
                    initial={{ opacity: 0, x: !loaded ? 0 : -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                >
                    <UserInfoWindow />
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
