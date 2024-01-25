import { useState, useEffect } from "react"

import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import axios from "axios"

import './style/Login.scss'
import SocialAuth from "./SocialAuth"
import { PasskeySignIn } from "./inputs/PasswordlessForm"
import CsrfToken from "./inputs/CsrfToken"
import { WindowLoadingBar } from "@pieces/index"
import {
    DarkWideButton,
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
import { useFlow } from '@ledget/ory'
import { useLazyGetLoginFlowQuery, useCompleteLoginFlowMutation } from '@features/orySlice'
import { useRefreshDevicesMutation } from '@features/deviceSlice'


const schema = z.object({
    email: z.string().min(1, { message: 'required' }).email({ message: 'Invalid email' }),
    remember: z.union([z.boolean(), z.string()])
})

interface EmailFormProps {
    flow: any
    setEmail: React.Dispatch<React.SetStateAction<string | undefined>>
    socialSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const EmailForm = ({ flow, setEmail, socialSubmit }: EmailFormProps) => {
    const { register, handleSubmit, formState: { errors }, setFocus } =
        useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), mode: 'onBlur' })

    const submit = (data: z.infer<typeof schema>) => {
        if (data.remember) {
            localStorage.setItem('login-email', JSON.stringify(data.email))
        } else {
            localStorage.removeItem('login-email')
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
                        placeholder="Email"
                        {...register('email')}
                    />
                    {errors['email'] && <FormError msg={errors['email'].message || ''} />}
                    <div id="remember-me-checkbox-container">
                        <Checkbox
                            id='remember'
                            label='Remember me'
                            {...register('remember')}
                        />
                    </div>
                    <DarkWideButton>Continue</DarkWideButton>
                </div>
            </form >
            <SocialAuth flow={flow} submit={socialSubmit} />
        </>
    )
}

const LookupSecretPrompt = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    return (
        <div className="mfa-prompt--container">
            <span>Or use a&nbsp;</span>
            <button
                type="button"
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

const TotpMfa = ({ finished }: { finished: boolean }) => {
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
            <DarkWideButton name="method" value={searchParams.get('mfa') || ''}>
                Submit
            </DarkWideButton>
        </>
    )
}

const RecoveryMfa = ({ finished }: { finished: boolean }) => {
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
            <DarkWideButton name="method" value={searchParams.get('mfa') || ''}>
                Submit
            </DarkWideButton>
        </>
    )
}

const Password = () => (
    <div id="password-auth--container">
        <PasswordInput autoFocus required />
        <DarkWideButton name="method" value="password">
            Sign In
        </DarkWideButton>
        {(typeof (PublicKeyCredential) != "undefined") && <PasskeySignIn />}
    </div>
)

interface OryFormWrapperProps {
    children: React.ReactNode
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    flow?: { csrf_token: string, [key: string]: any }
    errMsg?: string[]
    email: string
    setEmail: React.Dispatch<React.SetStateAction<string | undefined>>
}

const OryFormWrapper = ({ children, onSubmit, flow, errMsg, email, setEmail }: OryFormWrapperProps) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    return (
        <form onSubmit={onSubmit}>
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
                        if (searchParams.get('mfa')) {
                            searchParams.delete('mfa')
                            setSearchParams(searchParams)
                        } else if (searchParams.get('aal') === 'aal1') {
                            setEmail(undefined)
                        } else {
                            navigate('/login')
                        }
                    }}
                >
                    {searchParams.get('mfa') ? '' : email}
                </BackButton>
            </div>
            {errMsg && <FormError msg={errMsg} />}
            {children}
            <CsrfToken csrf={flow?.csrf_token} />
        </form>
    )
}

const Login = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const [email, setEmail] = useState<string>()
    const [healthCheckResult, setHealthCheckResult] = useState<'aal2_required' | 'aal15_required' | 'healthy'>()

    const [refreshDevices, { isLoading: isRefreshingDevices, isSuccess: devicesRefreshedSuccess }, refreshDevicesError] = useRefreshDevicesMutation()

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

    // In the event that a user has logged in with their first factor,
    // but they require a 2nd factor, the app will redirect the user to the
    // login page and we want to automatically go to the 2nd factor step.
    // No flows should be fetched until this is first checked, since this always
    // needs to happen first.
    useEffect(() => {
        axios.get(import.meta.env.VITE_LEDGET_API_URI + 'user/me', { withCredentials: true }).then(res => {
            window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
        }).catch(err => {
            if (err?.response?.data?.code === 'AAL2_REQUIRED') {
                console.log('here1')
                setHealthCheckResult('aal2_required')
            } else if (err?.response?.data?.code === 'AAL15_REQUIRED') {
                console.log('here2')
                setHealthCheckResult('aal15_required')
            } else {
                setHealthCheckResult('healthy')
            }
        })
    }, [])

    // After health check result, set proper mfa if needed
    useEffect(() => {
        if (healthCheckResult === 'aal2_required') {
            searchParams.set('mfa', 'totp')
            setSearchParams(searchParams)
        } else {
            fetchFlow({ aal: 'aal1' })
        }
    }, [healthCheckResult])

    // Fetching the flow logic
    useEffect(() => {
        const mfa = searchParams.get('mfa')
        const aal = searchParams.get('aal')
        if (!healthCheckResult) return

        if (!mfa && aal !== 'aal2') {
            fetchFlow({ aal: 'aal1' })
        } else if (mfa === 'totp') {
            fetchFlow({ aal: 'aal2' })
        }
    }, [searchParams.get('mfa')])

    // Refresh devices on finishing login steps
    useEffect(() => {
        if (isCompleteSuccess || errId === 'session_already_available') {
            refreshDevices()
        }
    }, [isCompleteSuccess])

    // Watch for complete devices error indicating mfa is needed
    useEffect(() => {
        if (refreshDevicesError === 'totp') {
            searchParams.set('mfa', 'totp')
            setSearchParams(searchParams)
        }
    }, [refreshDevicesError])

    // Handle Login Finished
    useEffect(() => {
        if (devicesRefreshedSuccess) {
            if (searchParams.get('mfa')) {
                const timeout = setTimeout(() => {
                    window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
                }, 1000)
                return () => clearTimeout(timeout)
            } else {
                window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
            }
        }
    }, [devicesRefreshedSuccess])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        submit(e)
    }

    const oryFormArgs = {
        flow,
        errMsg,
        setEmail,
        email: email || '',
        onSubmit: handleSubmit
    }

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
                    <WindowLoadingBar
                        visible={[isGettingFlow, isCompletingFlow, isRefreshingDevices].some(Boolean)}
                    />
                </SlideMotionDiv>
                :
                <JiggleDiv jiggle={isCompleteError} className="wrapper-window" key={`${searchParams.get('mfa')}`}>
                    {/* 1st Factor */}
                    {!searchParams.get('mfa') &&
                        <SlideMotionDiv
                            className='nested-window'
                            key="aal1-step"
                            position={searchParams.get('mfa') ? 'first' : 'last'}
                        >
                            <OryFormWrapper {...oryFormArgs}>
                                <Password />
                                <input type="hidden" name="identifier" value={email || ''} />
                            </OryFormWrapper>
                        </SlideMotionDiv>
                    }
                    {/* Totp 2nd Factor */}
                    {['totp', 'lookup_secret'].includes(searchParams.get('mfa') || '') &&
                        <SlideMotionDiv className='nested-window' key={`${searchParams.get('mfa')}`} position={'last'}>
                            <OryFormWrapper {...oryFormArgs}>
                                <TotpMfa finished={devicesRefreshedSuccess} />
                            </OryFormWrapper>
                        </SlideMotionDiv>
                    }
                    {/* Recovery Code 2nd Factor */}
                    {searchParams.get('mfa') === 'lookup_secret' &&
                        <SlideMotionDiv className='nested-window' key={`${searchParams.get('mfa')}`} position={'last'}>
                            <OryFormWrapper {...oryFormArgs}>
                                <RecoveryMfa finished={devicesRefreshedSuccess} />
                            </OryFormWrapper>
                        </SlideMotionDiv>
                    }
                    <WindowLoadingBar
                        visible={[isGettingFlow, isCompletingFlow, isRefreshingDevices].some(Boolean)}
                    />
                </JiggleDiv>
            }
        </AnimatePresence>
    )
}

export default Login
