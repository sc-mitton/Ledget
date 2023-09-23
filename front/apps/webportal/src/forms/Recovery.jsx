import React, { useEffect, useRef, useState } from 'react'

import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence } from "framer-motion"

import './style/Recovery.css'
import Otc from './Otc'
import { WindowLoadingBar } from '@pieces'
import { FormError, GrnWideButton, SlideMotionDiv, PlainTextInput, BackButton } from '@ledget/shared-ui'
import forgotPassword from '@assets/images/forgotPassword.svg'
import { useLazyGetRecoveryFlowQuery, useCompleteRecoveryFlowMutation } from '@features/orySlice'
import { useFlow } from '@ledget/ory-sdk'

const RecoveryForm = ({ flow, setEmail, submit }) => {
    const emailRef = useRef(null)

    useEffect(() => {
        emailRef.current.focus()
    }, [])

    return (
        <>
            <div>
                <h2>Forgot password?</h2>
                <div style={{ margin: '8px 0', width: '70%' }}>
                    <span>
                        Enter the email connected to your account and we'll
                        send you a recovery code.
                    </span>
                </div>
            </div>
            <div id="forgot-password-image-container">
                <img src={forgotPassword} alt="Forgot password" />
            </div>
            <form id="recovery-form" onSubmit={submit}>
                <PlainTextInput
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    ref={emailRef}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
                <GrnWideButton
                    style={{ color: 'var(--green-dark4)' }}
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

const RecoveryVerificationForm = ({ email, submit, flow, isCompleteSuccess }) => {
    const navigate = useNavigate()
    const [searchParams, setsearchParams] = useSearchParams()
    const [codeAttempted, setCodeAttempted] = useState(false)
    const [csrfToken, setCsrfToken] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        submit(e)
        setCodeAttempted(true)
    }

    useEffect(() => {
        if (flow) {
            flow.ui.nodes.find((n) => {
                n.attributes.name === 'csrf_token'
                    && (setCsrfToken(n.attributes.value))
            })
        }
    }, [flow])

    useEffect(() => {
        let timeout
        if (isCompleteSuccess && codeAttempted) {
            setTimeout(() => {
                // navigate('/login')
            }, 1000)
        }
        return () => clearTimeout(timeout)
    }, [isCompleteSuccess])

    const [test, setTest] = useState(false)
    useEffect(() => {
        const timeout = setTimeout(() => {
            setTest(true)
        }
            , 4000)
        return () => clearTimeout(timeout)
    }, [])

    return (
        <>
            <div>
                <div style={{ margin: '0 0 8px -4px' }}>
                    <BackButton
                        onClick={() => {
                            searchParams.delete('step')
                            setsearchParams(searchParams)
                        }}
                        style={{ float: 'none' }}
                    />
                </div>
                <h2>Recovery Code</h2>
                <div style={{ margin: '4px 0' }}>
                    <span>Enter the code sent to your email </span>
                </div>
            </div>
            <div
                id="forgot-password-image-container"
                className={`${(test) ? 'finished' : 'unfinished'}`}
            // codeAttempted && isCompleteSuccess
            >
                <img src={forgotPassword} alt="Forgot password" />
                <div className="success-circle" />
                <div className="success-circle" />
            </div>
            <form id="recovery-verification-form" onSubmit={handleSubmit}>
                <Otc codeLength={6} />
                <input type="hidden" name="csrf_token" value={csrfToken} />
                <input type="hidden" name="email" value={email} />
                <div className="verification-button-container">
                    <GrnWideButton
                        name="method"
                        type="submit"
                        value="code"
                        style={{ color: 'var(--green-dark4)' }}
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

    const {
        flow,
        fetchFlow,
        submit,
        flowStatus,
        completedFlowData
    } = useFlow(
        useLazyGetRecoveryFlowQuery,
        useCompleteRecoveryFlowMutation,
        'recovery'
    )

    const {
        isFetchingFlow,
        isCompleteSuccess,
        submittingFlow,
        isCompleteError,
        errMsg
    } = flowStatus

    useEffect(() => {
        if (searchParams.get('step') !== 'verify' && isCompleteSuccess) {
            searchParams.set('step', 'verify')
            setSearchParams(searchParams)
        }
    }, [isCompleteSuccess])

    useEffect(() => { fetchFlow() }, [])
    const [email, setEmail] = useState("")

    return (
        <div className="window" id="recovery-window">
            <WindowLoadingBar visible={isFetchingFlow || submittingFlow} />
            <FormError msg={errMsg} />
            {isCompleteError && !errMsg &&
                <FormError msg={"Something went wrong, please try again later."} />}
            <AnimatePresence mode="wait">
                {searchParams.get('step') === 'verify'
                    ?
                    <SlideMotionDiv
                        id="recovery-verification-form-container"
                        key="recovery-verification-form-container"
                        last
                    >
                        <RecoveryVerificationForm
                            email={email}
                            flow={completedFlowData}
                            submit={submit}
                            isCompleteSuccess={isCompleteSuccess}
                        />
                    </SlideMotionDiv>
                    :
                    <SlideMotionDiv
                        className="recovery-form-container"
                        key="recovery-form-container"
                        first={Boolean(flow)}
                    >
                        <RecoveryForm
                            setEmail={setEmail}
                            flow={flow}
                            submit={submit}
                            isCompleteSuccess={isCompleteSuccess}
                        />
                    </SlideMotionDiv>
                }
            </AnimatePresence>
        </div>
    )
}

export default RecoverAccount
