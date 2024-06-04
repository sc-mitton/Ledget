import { useState, useEffect } from "react"

import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { useSearchParams } from "react-router-dom"
import axios from "axios"

import styles from './styles/login.module.scss'
import {
    SlideMotionDiv,
    JiggleDiv,
    LinkArrowButton,
    PortalWindow,
    useScreenContext,
    WindowLoadingBar
} from "@ledget/ui"
import { useFlow } from '@ledget/ory'
import { useLazyGetLoginFlowQuery, useCompleteLoginFlowMutation } from '@features/orySlice'
import { useRefreshDevicesMutation } from '@features/deviceSlice'
import { hasErrorCode } from '@ledget/helpers'
import OryFormWrapper from "./FormWrapper"
import EmailForm from "./EmailForm"
import {
    LookupSecretMfa,
    Password,
    TotpMfa
} from "./Auth"

const Login = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const { screenSize } = useScreenContext()

    const [email, setEmail] = useState<string>()
    const [healthCheckResult, setHealthCheckResult] = useState<'aal2_required' | 'aal15_required' | 'healthy'>()

    const [refreshDevices, { isLoading: isRefreshingDevices, isSuccess: devicesRefreshedSuccess, error: refreshDevicesError }] = useRefreshDevicesMutation()

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
                setHealthCheckResult('aal2_required')
            } else if (err?.response?.data?.code === 'AAL15_REQUIRED') {
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
            fetchFlow({ aal: 'aal1', refresh: true })
        }
    }, [healthCheckResult])

    // Fetching the flow logic
    useEffect(() => {
        const mfa = searchParams.get('mfa')
        const aal = searchParams.get('aal')
        if (!healthCheckResult) return

        if (!mfa && aal !== 'aal2') {
            fetchFlow({ aal: 'aal1', refresh: true })
        } else if (mfa === 'totp') {
            fetchFlow({ aal: 'aal2', refresh: true })
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
        if (hasErrorCode('TOTP', refreshDevicesError)) {
            searchParams.set('mfa', 'totp')
            setSearchParams(searchParams)
        }
    }, [refreshDevicesError])

    // Handle Login Finished
    useEffect(() => {
        if (devicesRefreshedSuccess) {
            if (searchParams.get('mfa')) {
                const timeout = setTimeout(() => {
                    // window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
                }, 1000)
                return () => clearTimeout(timeout)
            } else {
                // window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
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
                <SlideMotionDiv key="initial" position={flow ? 'first' : 'fixed'}>
                    <PortalWindow className={styles.loginInfoWindow}>
                        <EmailForm setEmail={setEmail} flow={flow} socialSubmit={submit} />
                        <div className={styles.recover} data-size={screenSize}>
                            <LinkArrowButton
                                onClick={() => navigate('/recovery')}
                                aria-label="Recover Account"
                            >
                                Recover Account
                            </LinkArrowButton>
                        </div>
                        <WindowLoadingBar visible={[isGettingFlow, isCompletingFlow, isRefreshingDevices].some(Boolean)} />
                    </PortalWindow>
                </SlideMotionDiv>
                :
                <JiggleDiv jiggle={isCompleteError}>
                    {/* 1st Factor */}
                    {!searchParams.get('mfa') &&
                        <SlideMotionDiv
                            className={styles.fullScreen}
                            key="password-login"
                            position={isCompleteSuccess ? 'first' : 'last'}
                        >
                            <PortalWindow>
                                <OryFormWrapper {...oryFormArgs}>
                                    <Password />
                                    <input type="hidden" name="identifier" value={email || ''} />
                                </OryFormWrapper>
                                <WindowLoadingBar visible={[isGettingFlow, isCompletingFlow, isRefreshingDevices].some(Boolean)} />
                            </PortalWindow>
                        </SlideMotionDiv>
                    }
                    {/* Totp 2nd Factor */}
                    {searchParams.get('mfa') === 'totp' &&
                        <SlideMotionDiv key='mfa-totp' position={'last'} className={styles.fullScreen}>
                            <PortalWindow>
                                <OryFormWrapper {...oryFormArgs}>
                                    <TotpMfa finished={devicesRefreshedSuccess} />
                                </OryFormWrapper>
                                <WindowLoadingBar visible={[isGettingFlow, isCompletingFlow, isRefreshingDevices].some(Boolean)} />
                            </PortalWindow>
                        </SlideMotionDiv>
                    }
                    {/* Recovery Code 2nd Factor */}
                    {searchParams.get('mfa') === 'lookup_secret' &&
                        <SlideMotionDiv key='lookup-secret' position={'last'} className={styles.fullScreen}>
                            <PortalWindow>
                                <OryFormWrapper {...oryFormArgs}>
                                    <LookupSecretMfa finished={devicesRefreshedSuccess} />
                                </OryFormWrapper>
                                <WindowLoadingBar visible={[isGettingFlow, isCompletingFlow, isRefreshingDevices].some(Boolean)} />
                            </PortalWindow>
                        </SlideMotionDiv>
                    }
                </JiggleDiv>
            }
        </AnimatePresence>
    )
}

export default Login
