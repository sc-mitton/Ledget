import React, { useContext, useEffect, createContext, useState } from "react"

import { Link, useSearchParams } from "react-router-dom"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"

import './style/SignUp.css'
import SocialAuth from "./SocialAuth"
import { FormError, FormErrorTip } from "../widgets/Widgets"
import { RegisterFlowContext, RegisterFlowContextProvider } from "../../context/Flow"
import { WindowLoadingBar } from "../widgets/Widgets"
import PasswordInput from "./inputs/PasswordInput"
import PasswordlessForm from "./inputs/PasswordlessForm"
import SignUpFlowHeader from "./SignUpFlowHeader"
import CsrfToken from "./inputs/CsrfToken"

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
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string()
        .required()
        .email('Email is invalid'),
})

function UserInfoForm() {
    // Form for user info

    const { register, handleSubmit, formState: { errors }, trigger }
        = useForm({ resolver: yupResolver(schema), mode: 'onSubmt', reValidateMode: 'onBlur' })
    const { csrf, responseError } = useContext(RegisterFlowContext)
    const { setUserInfo } = useContext(userInfoContext)

    const hasErrorMsg = (field) => {
        return errors[field]?.message && !errors[field]?.message.includes('required')
    }

    const hasRequiredError = (field) => {
        return errors[field] && errors[field]?.message.includes('required')
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
                    name="firstName"
                    placeholder="First name"
                    {...register('firstName')}
                    onBlur={(e) => {
                        if (e.target.value) {
                            trigger("firstName")
                        }
                    }}
                />
                {hasRequiredError('firstName') && <FormErrorTip />}
            </div>
            <div className="input-container">
                <input
                    id="name"
                    name="lastName"
                    placeholder="Last name"
                    {...register('lastName')}
                    onBlur={(e) => {
                        if (e.target.value) {
                            trigger("lastName")
                        }
                    }}
                />
                {hasRequiredError('lastName') && <FormErrorTip />}
            </div>
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
                {hasRequiredError('email') && <FormErrorTip />}
            </div>
            <CsrfToken csrf={csrf} />
            {hasErrorMsg('email') &&
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

    const { flow, submit, csrf } = useContext(RegisterFlowContext)

    return (
        <>
            <WindowLoadingBar visible={!flow} />
            <SignUpFlowHeader step={1} steps={4} />
            <h2>Create Account</h2>
            <UserInfoForm />
            <SocialAuth flow={flow} submit={submit} csrf={csrf} />
            <div className="below-window-container">
                <span>Have an account?  </span>
                <Link to={{
                    pathname: "/login",
                    state: { direction: 1 }
                }}>Sign In</Link>
            </div>
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

const AuthenticationForm = () => {
    const [pwdVisible, setPwdVisible] = useState(false)
    const { userInfo } = useContext(userInfoContext)
    const { flow, responseError, csrf, submit } = useContext(RegisterFlowContext)
    const { register, handleSubmit, formState: { errors }, trigger } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(passwordSchema)
    })

    return (
        <>
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
                <CsrfToken csrf={csrf} />
                <input type='hidden' name='traits.email' value={userInfo.email} />
                <input type='hidden' name='traits.name.first' value={userInfo.firstName} />
                <input type='hidden' name='traits.name.last' value={userInfo.lastName} />
                <button className='charcoal-button main-submit' name="method" value="password" type="submit">
                    Create
                </button>
            </form >
            {typeof (PublicKeyCredential) != "undefined" &&
                <PasswordlessForm flow={flow}>
                    <input type='hidden' name='traits.email' value={userInfo.email} />
                    <input type='hidden' name='traits.name.first' value={userInfo.firstName} />
                    <input type='hidden' name='traits.name.last' value={userInfo.lastName} />
                    <input type='hidden' name='webauthn_register_displayname' value={userInfo.email} />
                </PasswordlessForm>
            }
        </>
    )
}

const AuthSelectionWindow = () => {
    const { registering } = useContext(RegisterFlowContext)

    return (
        <>
            <WindowLoadingBar visible={registering} />
            <SignUpFlowHeader step={2} steps={4} />
            {typeof (PublicKeyCredential) != "undefined"
                ?
                <h2>Sign In Method</h2>
                :
                <h2>Create a Password</h2>
            }
            <AuthenticationForm />
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
        // Get new flow if it's expired
        flowId ? getFlow(flowId).catch(createFlow) : createFlow()
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
