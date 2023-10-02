import React, { useEffect, useState } from "react"

import { useSearchParams, useNavigate } from "react-router-dom"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { AnimatePresence } from "framer-motion"

import './style/SignUp.css'
import SocialAuth from "./SocialAuth"
import ledgetapi from '@api/axios'
import { WindowLoadingBar } from "@pieces"
import PasswordlessForm from "./inputs/PasswordlessForm"
import CsrfToken from "./inputs/CsrfToken"
import PasskeyInfoModal from '@modals/PassKey'
import {
    GrnWideButton,
    FormError,
    PasswordInput,
    SlideMotionDiv,
    PlainTextInput,
    BackButton
} from "@ledget/shared-ui"
import { useFlow } from "@ledget/ory-sdk"
import {
    useLazyGetRegistrationFlowQuery,
    useCompleteRegistrationFlowMutation
} from '@features/orySlice'


// Schema for yup form validation
const schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string()
        .required()
        .email('Email is invalid'),
})

const UserInfoWindow = ({ setUserInfo, flow, submit, flowStatus }) => {
    // Form window for entering user info (name, email), or signing in with social auth
    const { register, handleSubmit, formState: { errors } }
        = useForm({ resolver: yupResolver(schema), mode: 'onSubmt', reValidateMode: 'onBlur' })

    return (
        <>
            <WindowLoadingBar visible={flowStatus.isGettingFlow} />
            <div className="window-header">
                <h2>Create Account</h2>
                <h4>Step 1 of 4</h4>
            </div>
            <form
                onSubmit={handleSubmit((e) =>
                    setUserInfo(e)
                )}
                className="sign-up-form"
                noValidate
            >
                <div className="signup-error-container">
                    <FormError msg={flowStatus.errMsg} />
                </div>
                <label htmlFor="name">Name</label>
                <div className="split-inputs">
                    <PlainTextInput
                        id="name"
                        name="firstName"
                        placeholder="First"
                        {...register('firstName')}
                        errors={errors}
                    />
                    <PlainTextInput
                        id="name"
                        name="lastName"
                        placeholder="Last"
                        {...register('lastName')}
                        errors={errors}
                    />
                </div>
                <label htmlFor="email">Email</label>
                <PlainTextInput
                    id="email"
                    name="email"
                    placeholder="Email"
                    required
                    {...register('email')}
                    errors={errors}
                />
                <CsrfToken csrf={flow?.csrf_token} />
                {errors.email?.type !== 'required' &&
                    <div className="signup-error-container">
                        <FormError msg={errors.email?.message} />
                    </div>
                }
                <div
                    style={{ marginTop: '16px' }}
                >
                    <GrnWideButton type='submit' aria-label="Submit form">
                        Continue
                    </GrnWideButton>
                </div>
            </form>
            <SocialAuth flow={flow} submit={submit} csrf={flow?.csrf_token} />
        </>
    )
}

const passwordSchema = yup.object().shape({
    password: yup.string().required().min(10, 'Minimum 10 characters'),
})

const AuthSelectionWindow = ({ userInfo, setUserInfo, flow, flowStatus, submit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onBlur', reValidateMode: 'onBlur',
        resolver: yupResolver(passwordSchema)
    })

    return (
        <>
            <WindowLoadingBar visible={flowStatus.isCompletingFlow} />
            <div className="window-header">
                {typeof (PublicKeyCredential) != "undefined"
                    ?
                    <h2>Sign In Method</h2>
                    :
                    <h2>Create a Password</h2>
                }
                <div id="step--container">
                    <BackButton
                        withText={false}
                        onClick={() => setUserInfo({})}
                    />
                    <h4>Step 2 of 4</h4>
                </div>
            </div>
            <form
                action={flow.ui.action}
                method={flow.ui.method}
                onSubmit={handleSubmit((data, e) => submit(e))}
                id="authentication-form"
            >
                <div className="signup-error-container">
                    <FormError msg={flowStatus.errMsg} />
                </div>
                <label htmlFor="password">Password</label>
                <PasswordInput
                    name='password'
                    placeholder="Enter a password..."
                    error={errors.password}
                    {...register('password')}
                />
                <FormError msg={errors.password?.message} />
                <CsrfToken csrf={flow?.csrf_token} />
                <input type='hidden' name='traits.email' value={userInfo.email} />
                <input type='hidden' name='traits.name.first' value={userInfo.firstName} />
                <input type='hidden' name='traits.name.last' value={userInfo.lastName} />
                <GrnWideButton id="continue-button" name="method" value="password" type="submit">
                    Create
                </GrnWideButton>
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

function SignUp() {
    const navigate = useNavigate()
    const { flow, fetchFlow, submit, result, flowStatus } = useFlow(
        useLazyGetRegistrationFlowQuery,
        useCompleteRegistrationFlowMutation,
        'registration'
    )
    const { isCompleteSuccess, errId } = flowStatus

    const [searchParams] = useSearchParams()
    const [userInfo, setUserInfo] = useState({})

    useEffect(() => { fetchFlow() }, [])

    useEffect(() => {
        if (isCompleteSuccess) {
            sessionStorage.setItem('identifier', JSON.stringify(result.identity?.email))
            ledgetapi.post('devices')
                .then(() => { navigate('/verification') })
                .catch(() => { navigate('/login') })
            // fall back to login if device creation fails
            // since they can always log in and then user will
            // be forced to verify and subscribe there instead
        }
    }, [isCompleteSuccess])

    // If the user is already logged in, redirect to the login redirect URL
    useEffect(() => {
        if (errId === 'session_already_available') {
            window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
        }
    }, [errId])

    return (
        <>
            <AnimatePresence mode="wait">
                {Object.keys(userInfo).length === 0
                    ?
                    <SlideMotionDiv className='window' key="sign-up" first={Boolean(flow)}>
                        <UserInfoWindow
                            setUserInfo={setUserInfo}
                            flow={flow}
                            submit={submit}
                            flowStatus={flowStatus}
                        />
                    </SlideMotionDiv>
                    :
                    <SlideMotionDiv className='window' key="authenticate" last>
                        <AuthSelectionWindow
                            flow={flow}
                            submit={submit}
                            flowStatus={flowStatus}
                            userInfo={userInfo}
                            setUserInfo={setUserInfo}
                        />
                    </SlideMotionDiv>
                }
            </AnimatePresence >
            {searchParams.get('help') === 'true' && <PasskeyInfoModal />}
        </>
    )
}

export default SignUp
