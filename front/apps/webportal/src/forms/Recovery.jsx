import React, { useEffect, useRef, useState } from 'react'

import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence } from "framer-motion"

import './style/Recovery.css'
import { WindowLoadingBar } from '@pieces'
import { ledgetapi } from "@api"
import { FormError, GrnWideButton, SlideMotionDiv, PlainTextInput, BackButton, StatusPulse, Otc } from '@ledget/ui'
import forgotPassword from '@assets/images/forgotPassword.svg'
import { useLazyGetRecoveryFlowQuery, useCompleteRecoveryFlowMutation } from '@features/orySlice'
import { useFlow } from '@ledget/ory'

const Error = ({ msg }) => (
    <div className="recovery-error--container">
        {msg
            ?
            <FormError msg={errMsg} />
            :
            <FormError msg={"Something went wrong, please try again later."} />
        }
    </div>
)

const MainGraphic = ({ unLocked }) => (
    <div
        className={`${(unLocked) ? 'unlocked' : 'locked'}`}
        id="image-container"
    >
        <img src={forgotPassword} alt="Forgot password" />
        <StatusPulse positive={unLocked} size="medium" />
    </div>
)

const RecoveryForm = ({ flow, submit, isCompleteError, errMsg }) => {
    const emailRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        emailRef.current.focus()
    }, [])

    return (
        <>
            <div>
                <div style={{ margin: '0 0 .5em -.25em' }}>
                    <BackButton
                        onClick={() => { navigate('/login') }}
                        style={{ float: 'none' }}
                    />
                </div>
                <h2>Forgot password?</h2>
                <div style={{ margin: '.5em 0' }}>
                    <span>
                        Enter the email connected to your account and we'll
                        send you a recovery code.
                    </span>
                </div>
                {(isCompleteError || errMsg) && <Error msg={errMsg} />}
            </div>
            <MainGraphic />
            <form
                onSubmit={submit}
                className="recovery-form"
            >
                <PlainTextInput
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    ref={emailRef}
                    name="email"
                />
                <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
                <GrnWideButton
                    style={{ color: 'var(--main-dark4)' }}
                    name='method'
                    type="submit"
                    value="code"
                >
                    Send code
                </GrnWideButton>
            </form>
        </>
    )
}

const RecoveryVerificationForm = ({ submit, flow, codeSuccess, isCompleteError, errMsg }) => {
    const [searchParams, setsearchParams] = useSearchParams()
    const [csrfToken, setCsrfToken] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        submit(e)
    }

    useEffect(() => {
        if (flow) {
            flow.ui.nodes.find((n) => {
                n.attributes.name === 'csrf_token'
                    && (setCsrfToken(n.attributes.value))
            })
        }
    }, [flow])

    return (
        <>
            <div>
                <div style={{ margin: '0 0 .5em -.25em' }}>
                    <BackButton
                        onClick={() => {
                            searchParams.delete('step')
                            setsearchParams(searchParams)
                        }}
                        style={{ float: 'none' }}
                    />
                </div>
                <h2>Recovery Code</h2>
                <div style={{ margin: '.25em 0' }}>
                    <span>Enter the code sent to your email </span>
                </div>
                {(isCompleteError || errMsg) && <Error msg={errMsg} />}
            </div>
            <MainGraphic unLocked={codeSuccess} />
            <form
                id="recovery-verification-form"
                className="recovery-form"
                onSubmit={handleSubmit}
            >
                <Otc codeLength={6} />
                <input type="hidden" name="csrf_token" value={csrfToken} />
                <div className="verification-button-container">
                    <GrnWideButton
                        name="method"
                        type="submit"
                        value="code"
                        style={{ color: 'var(--main-dark4)' }}
                    >
                        Verify Code
                    </GrnWideButton>
                </div>
            </form>
        </>
    )
}

const RecoverAccount = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [codeSuccess, setCodeSuccess] = useState(false)

    const {
        flow,
        fetchFlow,
        submit,
        flowStatus,
        result
    } = useFlow(
        useLazyGetRecoveryFlowQuery,
        useCompleteRecoveryFlowMutation,
        'recovery'
    )

    const {
        isGettingFlow,
        isCompleteSuccess,
        isCompletingFlow,
        isCompleteError,
        completeError,
        errMsg
    } = flowStatus

    useEffect(() => {
        // If 422 error, redirect to login
        let timeout
        if (completeError?.status === 422) {

            ledgetapi.post('/devices')
                .then((res) => {

                    setCodeSuccess(true)
                    timeout = setTimeout(() => {
                        window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
                    }, 1200)

                }).catch((err) => {

                    if (err.response.status === 422) {
                        setCodeSuccess(true)
                        timeout = setTimeout(() => {
                            navigate({
                                pathname: '/login',
                                query: {
                                    aal: 'aal2',
                                    mfa: err.response.data.error
                                }
                            })
                        }, 1200)
                    } else {
                        console.warn(err)
                    }

                })
        }
        return () => clearTimeout(timeout)
    }, [completeError])

    useEffect(() => {
        if (searchParams.get('step') !== 'verify' && isCompleteSuccess) {
            searchParams.set('step', 'verify')
            setSearchParams(searchParams)
        }
    }, [isCompleteSuccess])

    useEffect(() => { fetchFlow() }, [])

    return (
        <div className="window" id="recovery-window">
            <WindowLoadingBar visible={isGettingFlow || isCompletingFlow} />
            <AnimatePresence mode="wait">
                {searchParams.get('step') === 'verify'
                    ?
                    // Verify Step
                    <SlideMotionDiv
                        className="recovery-form"
                        id="recovery-verification-form-container"
                        key="recovery-verification-form-container"
                        position={'last'}
                    >
                        <RecoveryVerificationForm
                            flow={result}
                            submit={submit}
                            finished={codeSuccess}
                            isCompleteError={isCompleteError}
                            errMsg={errMsg}
                        />
                    </SlideMotionDiv>
                    :
                    // Initial Step
                    <SlideMotionDiv
                        id="recovery-code-form-container"
                        key="recovery-code-form-container"
                        position={flow ? 'last' : 'fixed'}
                    >
                        <RecoveryForm
                            flow={flow}
                            submit={submit}
                            isCompleteError={isCompleteError}
                            errMsg={errMsg}
                        />
                    </SlideMotionDiv>
                }
            </AnimatePresence>
        </div>
    )
}

export default RecoverAccount
