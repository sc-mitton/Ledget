import React, { useState, useEffect } from "react"

import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { object, string, boolean } from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { set, useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"

import './style/Login.css'
import SocialAuth from "./SocialAuth"
import { PasskeySignIn } from "./inputs/PasswordlessForm"
import CsrfToken from "./inputs/CsrfToken"
import { WindowLoadingBar } from "@pieces"
import { ledgetapi } from "@api"
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
    RecoveryCodeGraphic
} from "@ledget/shared-ui"
import { useFlow } from "@ledget/ory-sdk"
import { useLazyGetLoginFlowQuery, useCompleteLoginFlowMutation } from '@features/orySlice'


const schema = object().shape({
    email: string().email("Invalid email address"),
    remember: boolean()
})

const EmailForm = ({ flow, setEmail, socialSubmit }) => {
    const { register, handleSubmit, formState: { errors }, setFocus } =
        useForm({ resolver: yupResolver(schema), mode: 'onBlur' })

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

const Mfa = ({ finished }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [loaded, setLoaded] = useState(false)

    // Map of method name to input code name
    const inputNameMap = {
        totp: 'totp_code',
        lookup_secret: 'lookup_secret'
    }

    const LookupSecretPrompt = () => (
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

    useEffect(() => {
        !loaded && setLoaded(true)
    }, [])

    return (
        <>
            {searchParams.get('mfa') === 'lookup_secret' &&
                <div className="mfa-container">
                    <RecoveryCodeGraphic finished={finished} />
                    <h4>Enter your recovery code</h4>
                </div >
            }
            {
                searchParams.get('mfa') === 'totp' &&
                <div className="mfa-container">
                    <TotpAppGraphic finished={finished} />
                    <h4>Enter your authenticator code</h4>
                    <LookupSecretPrompt />
                </div>
            }
            {
                searchParams.get('mfa') === 'hotp' &&
                <div className="mfa-container">
                    <RecoveryCodePrompt />
                    <h4>Enter the code sent to your email</h4>
                    <LookupSecretPrompt />
                </div>
            }
            <div style={{ margin: '20px 0' }}>
                <PlainTextInput
                    name={inputNameMap[searchParams.get('mfa')]}
                    placeholder='Code'
                />
            </div>
            <GrnWideButton
                name="method"
                value={searchParams.get('mfa')}
            >
                Submit
            </GrnWideButton>
        </>
    )
}

const Password = () => (
    <div id="password-auth--container">
        <PasswordInput autofocus required />
        <GrnWideButton name="method" value="password">
            Sign In
        </GrnWideButton>
        {(typeof (PublicKeyCredential) != "undefined") && <PasskeySignIn />}
    </div>
)

const Login = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const [email, setEmail] = useState(null)
    const [showLoadingBar, setShowLoadingBar] = useState(false)
    const [finished, setFinished] = useState(false)

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
        isCompletingFlow && setShowLoadingBar(true)
    }, [isCompletingFlow])
    useEffect(() => {
        isCompleteError && setShowLoadingBar(false)
    }, [isCompleteError])

    useEffect(() => {
        const mfa = searchParams.get('mfa')
        const aal = searchParams.get('aal')

        if (!mfa && aal !== 'aal2') {
            fetchFlow({ aal: 'aal1', refresh: true })
        } else if (mfa === 'totp') {
            fetchFlow({ aal: 'aal2', refresh: true })
        } else {
            console.log('handle email / phone mfa')
        }
    }, [searchParams.get('mfa')])

    // Handle success
    useEffect(() => {
        if (isCompleteSuccess || errId === 'session_already_available') {
            ledgetapi.post('/devices')
                .then((res) => {
                    setFinished(true)
                }).catch((err) => {
                    if (err.response.status === 422) {
                        setSearchParams({ mfa: err.response.data.error })
                    } else {
                        console.warn(err)
                    }
                }).finally(() => {
                    setShowLoadingBar(false)
                })
        }
    }, [isCompleteSuccess])

    // Handle Finished
    useEffect(() => {
        let timeout
        if (finished && searchParams.get('mfa')) {
            setTimeout(() => {
                window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
            }, 1200)
        } else if (finished) {
            window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
        }
        return () => clearTimeout(timeout)
    }, [finished])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (searchParams.get('aal')) {
            submit(e)
        } else {
            console.log('handle submitting email / phone mfa')
        }
    }

    const AuthForm = ({ children }) => (
        <form action={flow?.ui.action} method={flow?.ui.method} onSubmit={handleSubmit}>
            <div id="email-container">
                <h3>Welcome Back</h3>
                <BackButton
                    type="button"
                    withText={false}
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
                    {searchParams.get('aal') === 'aal2' ? 'back' : email}
                </BackButton>
            </div>
            {errMsg &&
                <div style={{ marginBottom: '12px' }}>
                    <FormError msg={errMsg} />
                </div>
            }
            {children}
            <CsrfToken csrf={flow?.csrf_token} />
        </form>
    )

    return (
        <AnimatePresence mode="wait">
            {email === null && !searchParams.get('mfa')
                ?
                <SlideMotionDiv className='window' key="initial" first={Boolean(flow)}>
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
                <JiggleDiv jiggle={isCompleteError} className="wrapper-window">
                    {/* 1st Factor */}
                    {!searchParams.get('mfa') &&
                        <SlideMotionDiv
                            className='nested-window'
                            key="aal1-step"
                            last={!searchParams.get('mfa')}
                            first={searchParams.get('mfa')}
                        >
                            <AuthForm>
                                <Password />
                                <input type="hidden" name="identifier" value={email || ''} />
                            </AuthForm>
                        </SlideMotionDiv>
                    }
                    {/* 2nd Factor */}
                    {['totp', 'lookup_secret', 'hotp'].includes(searchParams.get('mfa')) &&
                        <SlideMotionDiv className='nested-window' key="aal2-step" last>
                            <AuthForm>
                                <Mfa finished={finished} />
                            </AuthForm>
                        </SlideMotionDiv>
                    }
                    <WindowLoadingBar visible={showLoadingBar || isGettingFlow} />
                </JiggleDiv>
            }
        </AnimatePresence>
    )
}

export default Login
