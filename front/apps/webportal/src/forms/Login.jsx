import React, { useRef, useState, useEffect } from "react"

import { Link } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { object, string } from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
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
    JiggleDiv
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

const AuthenticatorMfa = () => (
    <>
        <h3>Enter your authenticator code</h3>
        <div style={{ margin: '20px 0' }}>
            <PlainTextInput name="totp" placeholder="Code" />
        </div>
        <GrnWideButton name="method" value='totp'>
            Submit
        </GrnWideButton>
    </>
)

const EmailMfa = () => (
    <div>Hello World</div>
)

const Password = React.forwardRef((props, ref) => {
    useEffect(() => { ref.current?.focus() }, [])

    return (
        <>
            <PasswordInput ref={ref} />
            <div id="forgot-password-container">
                <Link to="/recovery" tabIndex={0}>Forgot Password?</Link>
            </div>
            <GrnWideButton name="method" value="password">
                Sign In
            </GrnWideButton>
            {(typeof (PublicKeyCredential) != "undefined") && <PasskeySignIn />}
        </>
    )
})

const AuthenticationForm = (props) => {
    const [searchParams] = useSearchParams()
    const { flow, fetchFlow, errMsg, email, setEmail, submit } = props
    const pwdRef = useRef(null)

    useEffect(() => {
        if (searchParams.get('mfa') === 'totp') {
            fetchFlow({ aal: 'aal2', refresh: true })
        } else {
            console.log('handle email / phone mfa')
        }
    }, [searchParams.get('mfa')])

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

    return (
        <form
            action={flow?.ui.action}
            method={flow?.ui.method}
            onSubmit={handleSubmit}
        >
            <div id="email-container">
                <h3>Welcome Back</h3>
                <BackButton withText={false} onClick={() => { setEmail(null) }}>
                    {email}
                </BackButton>
            </div>
            {errMsg &&
                <div style={{ marginBottom: '12px' }}>
                    <FormError msg={errMsg} />
                </div>
            }
            <AnimatePresence mode="wait">
                {searchParams.get('aal') === 'aal1'
                    ?
                    <>
                        <SlideMotionDiv key="aal1" first={searchParams.get('aal') === 'aal2'}>
                            <Password ref={pwdRef} />
                        </SlideMotionDiv>
                    </>
                    :
                    <>
                        <SlideMotionDiv key="aal2" last>
                            {searchParams.get('mfa') === 'totp' && <AuthenticatorMfa />}
                            {searchParams.get('mfa') === 'email' && <EmailMfa />}
                        </SlideMotionDiv>
                    </>
                }
            </AnimatePresence>
            <input type="hidden" name="identifier" value={email || ''} />
            <CsrfToken csrf={flow?.csrf_token} />
        </form>
    )
}

const Login = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [email, setEmail] = useState(null)
    const [submitting, setSubmitting] = useState(false)
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
        if (searchParams.get('aal') !== 'aal2') {
            fetchFlow({ aal: 'aal1', refresh: true })
        }
    }, [])

    useEffect(() => {
        submittingFlow && setSubmitting(true)
        isCompleteError && setSubmitting(false)
    }, [submittingFlow, isCompleteError])

    // Handle success
    useEffect(() => {
        if (isCompleteSuccess || errId === 'session_already_available') {
            ledgetapi.post('/devices')
                .then((res) => {
                    window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
                }).catch((err) => {
                    if (err.response.status === 422) {
                        setSearchParams({ mfa: err.response.data.error })
                    } else {
                        console.warn(err)
                    }
                }).finally(() => {
                    setSubmitting(false)
                })
        }
    }, [isCompleteSuccess])

    return (
        <AnimatePresence mode="wait">
            {email === null
                ?
                <SlideMotionDiv className='window' key="initial" first={Boolean(flow)}>
                    <EmailForm setEmail={setEmail} flow={flow} socialSubmit={submit} />
                    <WindowLoadingBar visible={isFetchingFlow} />
                </SlideMotionDiv>
                :
                <JiggleDiv jiggle={isCompleteError} className="wrapper-window">
                    <SlideMotionDiv className='nested-window' key="authenticate" last>
                        <AuthenticationForm
                            flow={flow}
                            submit={submit}
                            fetchFlow={fetchFlow}
                            errMsg={errMsg}
                            email={email}
                            setEmail={setEmail}
                        />
                        <WindowLoadingBar visible={submitting || isFetchingFlow} />
                    </SlideMotionDiv>
                </JiggleDiv>
            }
        </AnimatePresence>
    )
}

export default Login
