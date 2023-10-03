import { useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"

import "./style/Verification.css"
import CsrfToken from "./inputs/CsrfToken"
import { WindowLoadingBar } from "@pieces"
import { GrnWideButton, FormError, JiggleDiv, StatusPulse, Otc, ResendButton } from "@ledget/shared-ui"
import { VerifyEmail } from '@ledget/shared-assets'
import { useFlow } from "@ledget/ory-sdk"
import { useLazyGetVerificationFlowQuery, useCompleteVerificationFlowMutation } from '@features/orySlice'

const VerificationForm = ({ flow, isCompleteError, submit, refreshSuccess }) => {
    const [otcDisabled, setOtcDisabled] = useState(false)

    useEffect(() => {
        flow ? setOtcDisabled(false) : setOtcDisabled(true)
    }, [flow])

    return (
        <>
            <form
                key={isCompleteError ? Date.now() : 'verification-form'}
                action={flow?.ui.action}
                method={flow?.ui.method}
                onSubmit={submit}
            >
                <Otc codeLength={6} />
                {flow && <CsrfToken csrf={flow.csrf_token} />}
                <input
                    type="hidden"
                    name="email"
                    value={JSON.parse(sessionStorage.getItem('identifier'))}
                />
                <GrnWideButton
                    type="submit"
                    name="method"
                    value="code"
                    disabled={otcDisabled}
                >
                    Submit
                </GrnWideButton>
            </form>
            <form
                action={flow?.ui.action}
                method={flow?.ui.method}
                onSubmit={submit}
            >
                <div id="resend-btn-container">
                    <ResendButton
                        success={refreshSuccess}
                        aria-label="Resend email"
                        type="submit"
                        name="method"
                        value="code"
                    />
                </div>
                {flow && <CsrfToken csrf={flow.csrf_token} />}
                <input
                    type="hidden"
                    name="email"
                    value={JSON.parse(sessionStorage.getItem('identifier'))}
                />
            </form>
        </>
    )
}

const Verification = () => {
    const [jiggle, setJiggle] = useState(false)
    const [codeIsCorrect, setCodeIsCorrect] = useState(false)
    const [unhandledIdMessage, setUnhandledIdMessage] = useState('')
    const [refreshSuccess, setRefreshSuccess] = useState(false)
    const navigate = useNavigate()
    const { flow, result, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetVerificationFlowQuery,
        useCompleteVerificationFlowMutation,
        'verification'
    )
    const {
        errMsg,
        isCompleteError,
        isGettingFlow,
        isCompletingFlow,
        isCompleteSuccess
    } = flowStatus

    useEffect(() => { fetchFlow() }, [])

    useEffect(() => {
        const timeout = setTimeout(() => {
            setJiggle(false)
        }, 1000)
        return () => clearTimeout(timeout)
    }, [jiggle])

    useEffect(() => {
        let timeout
        if (codeIsCorrect) {
            timeout = setTimeout(() => {
                navigate('/checkout')
            }, 1200)
        }
        return () => clearTimeout(timeout)
    }, [codeIsCorrect])

    // Lower refreshSuccess flag
    useEffect(() => {
        let timeout = setTimeout(() => {
            setRefreshSuccess(false)
        }, 1200)
        return () => clearTimeout(timeout)
    }, [refreshSuccess])

    // Response code handler
    useEffect(() => {
        const messages = result?.ui?.messages || []
        for (const message of messages) {
            switch (message.id) {
                case (4070006):
                    // Invalid code
                    setJiggle(true)
                    break
                case (407005 || 407003):
                    // Expired verification flow
                    // Send new email & navigate to verification page
                    // which will create a new verification flow
                    navigate('/verification')
                    break
                case (1080002):
                    // Successful verification
                    setCodeIsCorrect(true)
                    break
                case (1080003):
                    // Email w/ code/link sent
                    setRefreshSuccess(true)
                    break
                default:
                    setUnhandledIdMessage('Well this is awkward... something went wrong.\n Please try back again later.')
                    break
            }
        }
    }, [isCompleteSuccess])

    return (
        <JiggleDiv className="window" id="verification-window" jiggle={jiggle}>
            <WindowLoadingBar visible={isGettingFlow || isCompletingFlow} />
            <div className="window-header">
                <h2>Verify Email Address</h2>
                <h4>Step 3 of 4</h4>
            </div>
            <div id="verification-form-container">
                <div id='verify-graphic--container'>
                    <VerifyEmail
                        stroke={codeIsCorrect ? 'var(--green-hlight)' : 'var(--window)'}
                    />
                    <div id="verification-pulse-status">
                        <StatusPulse
                            positive={codeIsCorrect}
                            colorDefaultPositive={false}
                            size={'small'}
                        />
                    </div>
                </div>
                {errMsg
                    ?
                    <div id="verification-form-error-container">
                        {unhandledIdMessage && <FormError msg={unhandledIdMessage} />}
                        <FormError msg={errMsg} />
                    </div>
                    :
                    <>
                        <div className="subheader">
                            <span>Enter the code we sent to your email address </span>
                            <span>to verify your account:</span>
                        </div>
                        <VerificationForm
                            flow={flow}
                            isCompleteError={isCompleteError}
                            refreshSuccess={refreshSuccess}
                            submit={submit}
                        />
                    </>
                }
            </div>
        </ JiggleDiv>
    )
}


export default Verification
