import React, { useEffect, useRef, useState } from 'react'

import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence } from "framer-motion"

import './style/Recovery.css'
import Otc from './Otc'
import { WindowLoadingBar, StatusPulse } from '@pieces'
import { FormError, GrnWideButton, SlideMotionDiv, PlainTextInput, BackButton } from '@ledget/shared-ui'
import forgotPassword from '@assets/images/forgotPassword.svg'
import { useLazyGetRecoveryFlowQuery, useCompleteRecoveryFlowMutation } from '@features/orySlice'
import { useFlow } from '@ledget/ory-sdk'

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
        <StatusPulse locked={!unLocked} size="medium" />
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
                <div style={{ margin: '0 0 8px -4px' }}>
                    <BackButton
                        onClick={() => { navigate('/login') }}
                        style={{ float: 'none' }}
                    />
                </div>
                <h2>Forgot password?</h2>
                <div style={{ margin: '8px 0' }}>
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
    const [codeSuccess, setCodeSuccess] = useState(false)

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
        completeError,
        errMsg
    } = flowStatus

    useEffect(() => {
        // If 422 error, redirect to login
        let timeout
        if (completeError?.status === 422) {
            setCodeSuccess(true)
            timeout = setTimeout(() => {
                setSearchParams({})
                navigate('/login')
            }, 1500)
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
            <WindowLoadingBar visible={isFetchingFlow || submittingFlow} />
            <AnimatePresence mode="wait">
                {searchParams.get('step') === 'verify'
                    ?
                    <SlideMotionDiv
                        className="recovery-form"
                        id="recovery-verification-form-container"
                        key="recovery-verification-form-container"
                        last
                    >
                        <RecoveryVerificationForm
                            flow={completedFlowData}
                            submit={submit}
                            codeSuccess={codeSuccess}
                            isCompleteError={isCompleteError}
                            errMsg={errMsg}
                        />
                    </SlideMotionDiv>
                    :
                    <SlideMotionDiv
                        id="recovery-code-form-container"
                        key="recovery-code-form-container"
                        first={Boolean(flow)}
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
