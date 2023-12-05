import { useState, useEffect } from "react"

import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"

import './style/Login.css'
import SocialAuth from "./SocialAuth"
import { PasskeySignIn } from "./inputs/PasswordlessForm"
import CsrfToken from "./inputs/CsrfToken"
import { WindowLoadingBar } from "@pieces"
import {
    GrnWideButton,
    Checkbox,
    FormError,
    PasswordInput,
    BackButton,
    SlideMotionDiv,
    PlainTextInput,
    JiggleDiv,
    LinkArrowButton,
    TotpAppGraphic,
    RecoveryCodeGraphic,
    SmsVerifyStatus,
    Otc
} from "@ledget/ui"
import { useFlow } from '@ledget/ory-sdk'
import { useLazyGetLoginFlowQuery, useCompleteLoginFlowMutation } from '@features/orySlice'
import { useRefreshDevicesMutation } from '@features/deviceSlice'
import { useCreateOtpMutation, useVerifyOtpMutation } from '@features/otpSlice'


const schema = z.object({
    email: z.string().min(1, { message: 'required' }).email({ message: 'invalid email' }),
    remember: z.boolean()
})


const EmailForm = ({ flow, setEmail, socialSubmit }) => {
    const { register, handleSubmit, formState: { errors }, setFocus } =
        useForm({ resolver: zodResolver(schema), mode: 'onBlur' })

    const submit = (data) => {
        if (data.remember) {
            localStorage.setItem('loginEmail', JSON.stringify(data.email))
        } else {
            localStorage.removeItem('loginEmail')
        }
        setEmail(data.email)
    }

    useEffect(() => { setFocus('email') }, [])

    return (
        <>
            <div className="window-header">
                <h2>Sign in to Ledget</h2>
            </div>
            <form onSubmit={handleSubmit(submit)} className="login-form">
                <div>
                    <PlainTextInput
                        type="email"
                        name="email"
                        placeholder="Email"
                        {...register('email')}
                    />
                    {errors['email'] && <FormError msg={errors['email'].message} />}
                    <div id="remember-me-checkbox-container">
                        <Checkbox
                            id='remember'
                            label='Remember me'
                            name='remember'
                            {...register('remember')}
                        />
                    </div>
                    <GrnWideButton>Continue</GrnWideButton>
                </div>
            </form >
            <SocialAuth flow={flow} submit={socialSubmit} csrf={flow?.csrf_token} />
        </>
    )
}

const LookupSecretPrompt = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    return (
        <div className="mfa-prompt--container">
            <span>Or use a&nbsp;</span>
            <button
                onClick={() => {
                    searchParams.set('mfa', 'lookup_secret')
                    setSearchParams(searchParams)
                }}
            >
                recovery code
            </button>
        </div>
    )
}

const TotpMfa = ({ finished }) => {
    const [searchParams] = useSearchParams()

    return (
        <>
            <div className="mfa-container">
                <TotpAppGraphic finished={finished} />
                <h4>Enter your authenticator code</h4>
                <LookupSecretPrompt />
            </div>
            <div style={{ margin: '1.25em 0' }}>
                <PlainTextInput
                    name='totp_code'
                    placeholder='Code'
                />
            </div>
            <GrnWideButton name="method" value={searchParams.get('mfa')}>
                Submit
            </GrnWideButton>
        </>
    )
}

const RecoveryMfa = ({ finished }) => {
    const [searchParams] = useSearchParams()

    return (
        <>
            <div className="mfa-container">
                <RecoveryCodeGraphic finished={finished} />
                <h4>Enter your recovery code</h4>
            </div >
            <div style={{ margin: '1.25em 0' }}>
                <PlainTextInput
                    name='lookup_secret'
                    placeholder='Code'
                />
            </div>
            <GrnWideButton name="method" value={searchParams.get('mfa')}>
                Submit
            </GrnWideButton>
        </>
    )
}

const OtpMfa = ({ finished }) => (
    <>
        <div className="mfa-container">
            <SmsVerifyStatus finished={finished} />
            <h4>Enter the code sent to your phone</h4>
            <LookupSecretPrompt />
            <div style={{ margin: '.75em 0' }}>
                <Otc colorful={false} />
            </div>
        </div>
    </>
)

const Password = () => (
    <div id="password-auth--container">
        <PasswordInput autoFocus required />
        <GrnWideButton name="method" value="password">
            Sign In
        </GrnWideButton>
        {(typeof (PublicKeyCredential) != "undefined") && <PasskeySignIn />}
    </div>
)

const Login = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')

    const [createOtp, { data: otp, isLoading: creatingOtp, isSuccess: createdOtp }] = useCreateOtpMutation()
    const [verifyOtp, { isSuccess: otpVerified, isLoading: verifyingOtp, isError: isOtpVerifyError }] = useVerifyOtpMutation()
    const [refreshDevices, { isLoading: isRefreshingDevices, isSuccess: devicesRefreshedSuccess }] = useRefreshDevicesMutation()

    const { flow, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetLoginFlowQuery,
        useCompleteLoginFlowMutation,
        'login'
    )

    const {
        isGettingFlow,
        isCompletingFlow,
        isCompleteSuccess,
        isCompleteError,
        errId,
        errMsg
    } = flowStatus

    useEffect(() => {
        const mfa = searchParams.get('mfa')
        const aal = searchParams.get('aal')

        if (!mfa && aal !== 'aal2') {
            fetchFlow({ aal: 'aal1', refresh: true })
        } else if (mfa === 'totp') {
            fetchFlow({ aal: 'aal2', refresh: true })
        } else {
            createOtp()
        }
    }, [searchParams.get('mfa')])

    // Set otp id search params
    useEffect(() => {
        if (createdOtp) {
            searchParams.set('id', otp.id)
            setSearchParams(searchParams)
        }
    }, [createdOtp])

    // Refresh devices on finishing login steps
    useEffect(() => {
        if (isCompleteSuccess || errId === 'session_already_available' || otpVerified) {
            refreshDevices()
        }
    }, [isCompleteSuccess, otpVerified])

    // Handle Login Finished
    useEffect(() => {
        let timeout
        if (devicesRefreshedSuccess) {
            if (searchParams.get('mfa')) {
                setTimeout(() => {
                    window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
                }, 1000)
            } else {
                window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
            }
        }
        return () => clearTimeout(timeout)
    }, [devicesRefreshedSuccess])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (searchParams.get('aal')) {
            submit(e)
        } else {
            const data = Object.fromEntries(new FormData(e.target))
            verifyOtp({
                id: searchParams.get('id'),
                data: data.code
            })
        }
    }

    const OryFormWrapper = ({ children }) => (
        <form onSubmit={handleSubmit}>
            <div id="email-container">
                <h3>
                    {searchParams.get('mfa')
                        ? '2-Step Verification'
                        : 'Welcome Back'}
                </h3>
                <BackButton
                    type="button"
                    withText={Boolean(searchParams.get('mfa'))}
                    onClick={() => {
                        if (searchParams.get('mfa') === 'lookup_secret') {
                            navigate(-1)
                        } else if (searchParams.get('aal') === 'aal1') {
                            setEmail(null)
                        } else {
                            navigate('/login')
                        }
                    }}
                >
                    {searchParams.get('mfa') ? 'back' : email}
                </BackButton>
            </div>
            {errMsg &&
                <div style={{ marginBottom: '.75em' }}>
                    <FormError msg={errMsg} />
                </div>
            }
            {children}
            <CsrfToken csrf={flow?.csrf_token} />
        </form>
    )

    return (
        <AnimatePresence mode="wait">
            {!email && !searchParams.get('mfa')
                ?
                <SlideMotionDiv className='window' key="initial" position={flow ? 'first' : 'fixed'}>
                    <EmailForm setEmail={setEmail} flow={flow} socialSubmit={submit} />
                    <div className="below-login--container">
                        <LinkArrowButton
                            onClick={() => navigate('/recovery')}
                            aria-label="Recover Account"
                        >
                            Recover Account
                        </LinkArrowButton>
                    </div>
                    <WindowLoadingBar visible={isGettingFlow} />
                </SlideMotionDiv>
                :
                <JiggleDiv jiggle={isCompleteError || isOtpVerifyError} className="wrapper-window">
                    {/* 1st Factor */}
                    {!searchParams.get('mfa') &&
                        <SlideMotionDiv
                            className='nested-window'
                            key="aal1-step"
                            position={searchParams.get('mfa') ? 'first' : 'last'}
                        >
                            <OryFormWrapper>
                                <Password />
                                <input type="hidden" name="identifier" value={email || ''} />
                            </OryFormWrapper>
                        </SlideMotionDiv>
                    }
                    {/* Totp 2nd Factor */}
                    {['totp', 'lookup_secret'].includes(searchParams.get('mfa')) &&
                        <SlideMotionDiv className='nested-window' key="aal2-step" position={'last'}>
                            <OryFormWrapper>
                                <TotpMfa finished={devicesRefreshedSuccess} />
                            </OryFormWrapper>
                        </SlideMotionDiv>
                    }
                    {/* Otp 2nd Factor */}
                    {searchParams.get('mfa') === 'otp' &&
                        <SlideMotionDiv className='nested-window' key="aal2-step" position={'last'}>
                            <OtpMfa finished={devicesRefreshedSuccess} />
                        </SlideMotionDiv>
                    }
                    {/* Recovery Code 2nd Factor */}
                    {searchParams.get('mfa') === 'lookup_secret' &&
                        <SlideMotionDiv className='nested-window' key="aal2-step" position={'last'}>
                            <OryFormWrapper>
                                <RecoveryMfa finished={devicesRefreshedSuccess} />
                            </OryFormWrapper>
                        </SlideMotionDiv>
                    }
                    <WindowLoadingBar visible={verifyingOtp || creatingOtp || isGettingFlow || isCompletingFlow || isRefreshingDevices} />
                </JiggleDiv>
            }
        </AnimatePresence>
    )
}

export default Login
