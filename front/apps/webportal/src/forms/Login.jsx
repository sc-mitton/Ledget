import React, { useRef, useState, useEffect, forwardRef } from "react"

import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { object, string } from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"

import './style/Login.css'
import SocialAuth from "./SocialAuth"
import { PasskeySignIn } from "./inputs/PasswordlessForm"
import authenticator from '@assets/images/Authenticator.svg'
import CsrfToken from "./inputs/CsrfToken"
import { WindowLoadingBar, StatusPulse } from "@pieces"
import { ledgetapi } from "@api"
import { CheckMark } from '@ledget/shared-assets'
import {
    GrnWideButton,
    Checkbox,
    FormError,
    PasswordInput,
    BackButton,
    SlideMotionDiv,
    PlainTextInput,
    JiggleDiv,
    LinkArrowButton
} from "@ledget/shared-ui"
import { useFlow } from "@ledget/ory-sdk"
import { useLazyGetLoginFlowQuery, useCompleteLoginFlowMutation } from '@features/orySlice'


const schema = object().shape({
    email: string().email("Invalid email address"),
})

const EmailForm = ({ flow, setEmail, socialSubmit }) => {
    const { register, handleSubmit, formState: { errors } } =
        useForm({ resolver: yupResolver(schema), mode: 'onBlur' })
    const { ref, ...rest } = register('email')
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
        <>
            <div className="window-header">
                <h2>Sign in to Ledget</h2>
            </div>
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
            <SocialAuth flow={flow} submit={socialSubmit} csrf={flow?.csrf_token} />
        </>
    )
}

const AuthenticatorMfa = ({ finished }) => (
    <>
        <div id="authenticator-graphic">
            {finished &&
                <div id="success-checkmark">
                    <CheckMark
                        stroke={'var(--green-dark'}
                    />
                </div>
            }
            <img src={authenticator} alt="Authenticator" />
            <StatusPulse positive={finished} size="medium" />
        </div>
        <h3>Enter your authenticator code</h3>
        <div style={{ margin: '20px 0' }}>
            <PlainTextInput name="totp_code" placeholder="Code" />
        </div>
        <GrnWideButton name="method" value='totp'>
            Submit
        </GrnWideButton>
    </>
)

const EmailMfa = () => (
    <div>Hello World</div>
)

const Password = forwardRef((props, ref) => {
    useEffect(() => { ref.current?.focus() }, [])

    return (
        <div id="password-auth--container">
            <PasswordInput ref={ref} />
            <GrnWideButton name="method" value="password">
                Sign In
            </GrnWideButton>
            {(typeof (PublicKeyCredential) != "undefined") && <PasskeySignIn />}
        </div>
    )
})


const Login = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const [email, setEmail] = useState(null)
    const [showLoadingBar, setShowLoadingBar] = useState(false)
    const [finished, setFinished] = useState(false)
    const pwdRef = useRef(null)

    const { flow, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetLoginFlowQuery,
        useCompleteLoginFlowMutation,
        'login'
    )

    const {
        isFetchingFlow,
        submittingFlow,
        isCompleteSuccess,
        isCompleteError,
        errId,
        errMsg
    } = flowStatus

    useEffect(() => {
        submittingFlow && setShowLoadingBar(true)
    }, [submittingFlow])
    useEffect(() => {
        isCompleteError && setShowLoadingBar(false)
    }, [isCompleteError])

    useEffect(() => {
        const mfa = searchParams.get('mfa')
        const aal = searchParams.get('aal')

        if (!mfa && aal !== 'aal2') {
            fetchFlow({ aal: 'aal1', refresh: true })
        } else if (mfa === 'authenticator') {
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
        if (finished) {
            setTimeout(() => {
                window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
            }, 1500)
        }
        return () => clearTimeout(timeout)
    }, [finished])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (pwdRef.current?.value === '') {
            pwdRef.current?.focus()
            return
        }

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
                    withText={false}
                    onClick={() => {
                        setEmail(null)
                        setSearchParams({ aal: 'aal1' })
                    }}
                >
                    {email || 'back'}
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
                    <WindowLoadingBar visible={isFetchingFlow} />
                    <div id="account-recover--container">
                        <LinkArrowButton
                            onClick={() => navigate('/recovery')}
                            aria-label="Recover Account"
                        >
                            Recover Account
                        </LinkArrowButton>
                    </div>
                </SlideMotionDiv>
                :
                <JiggleDiv jiggle={isCompleteError} className="wrapper-window">
                    {searchParams.get('mfa') &&
                        <SlideMotionDiv
                            className='nested-window'
                            key="authenticate-password"
                            last={!searchParams.get('mfa')}
                            first={searchParams.get('mfa')}
                        >
                            <AuthForm>
                                <Password ref={pwdRef} />
                                <input type="hidden" name="identifier" value={email || ''} />
                            </AuthForm>
                        </SlideMotionDiv>
                    }
                    {searchParams.get('mfa') !== 'authenticator' &&
                        <SlideMotionDiv className='nested-window' key="authenticate-phone" last>
                            <AuthForm>
                                <AuthenticatorMfa finished={finished} />
                            </AuthForm>
                        </SlideMotionDiv>
                    }
                    {searchParams.get('mfa') === 'email' &&
                        <SlideMotionDiv className='nested-window' key="authenticate-email" last>
                            <AuthForm><EmailMfa /></AuthForm>
                        </SlideMotionDiv>
                    }
                    <WindowLoadingBar visible={showLoadingBar || isFetchingFlow} />
                </JiggleDiv>
            }
        </AnimatePresence>
    )
}

export default Login
