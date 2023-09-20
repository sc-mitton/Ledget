import React, { useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"

import "./style/Verification.css"
import verifyEmail from "@assets/images/verifyEmail.svg"
import CsrfToken from "./inputs/CsrfToken"
import ResendButton from "./inputs/ResendButton"
import Otc from "./Otc"
import { WindowLoadingBar } from "@pieces"
import { BlackWideButton, FormError, JiggleDiv } from "@ledget/shared-ui"
import { useFlow } from "@ledget/ory-sdk"
import { useLazyGetVerificationFlowQuery, useCompleteVerificationFlowMutation } from '@features/orySlice'

const VerificationForm = ({ flow, error, submit }) => {

    const [otcDisabled, setOtcDisabled] = useState(false)
    const [reset, setReset] = useState(false)

    const [user, setUser] = useState({})
    useEffect(() => {
        setUser(
            JSON.parse(sessionStorage.getItem('user'))
        )
    }, [])

    useEffect(() => {
        flow ? setOtcDisabled(false) : setOtcDisabled(true)
    }, [flow])

    useEffect(() => {
        error && setReset(true)
    }, [error])

    return (
        <>
            <form
                action={flow?.ui.action}
                method={flow?.ui.method}
                onSubmit={submit}
            >
                <Otc codeLength={6} reset={reset} setReset={setReset} />

                {flow && <CsrfToken csrf={flow.csrf_token} />}

                <input type="hidden" name="email" value={user.traits?.email} />

                <BlackWideButton type="submit" name="method" value="code" disabled={otcDisabled}>
                    Submit
                </BlackWideButton>
            </form>
            <form
                action={flow?.ui.action}
                method={flow?.ui.method}
                onSubmit={submit}
            >
                <ResendButton aria-label="Resend email" type="submit" name="method" value="code" />
                {flow && <CsrfToken csrf={flow.csrf_token} />}
                <input type="hidden" name="email" value={user?.traits?.email} />
            </form>
        </>
    )
}

const Verification = () => {
    const [jiggle, setJiggle] = useState(false)
    const [unhandledIdMessage, setUnhandledIdMessage] = useState('')
    const navigate = useNavigate()
    const { flow, completedFlowData, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetVerificationFlowQuery,
        useCompleteVerificationFlowMutation,
        'verification'
    )
    const {
        errMsg,
        isFetchingFlow,
        submittingFlow,
        isCompleteSuccess
    } = flowStatus

    useEffect(() => {
        fetchFlow()
    }, [])

    useEffect(() => {
        const timeout = setTimeout(() => {
            setJiggle(false)
        }, 1000)
        return () => clearTimeout(timeout)
    }, [jiggle])

    // Response code handler
    useEffect(() => {
        const messages = completedFlowData?.ui?.messages || []
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
                    navigate('/checkout')
                    break
                case (1080003 || 1080002):
                    // Email w/ code/link sent
                    break
                default:
                    setUnhandledIdMessage('Well this is awkward... something went wrong.\n Please try back again later.')
                    break
            }
        }
    }, [isCompleteSuccess])

    return (
        <JiggleDiv className="window" id="verification-window" jiggle={jiggle}>
            <WindowLoadingBar visible={isFetchingFlow || submittingFlow} />
            <div className="window-header">
                <h2>Email Verification</h2>
                <h4>Step 3 of 4</h4>
            </div>
            <div id="verification-form-container">
                <div>
                    <img id="verify-your-email" src={verifyEmail} alt="Verify Email" />
                </div>
                {errMsg
                    ?
                    <div id="verification-form-error-container">
                        {unhandledIdMessage && <FormError msg={unhandledIdMessage} />}
                        <FormError msg={errMsg} />
                    </div>
                    :
                    <>
                        <h2>Verify your email address</h2>
                        <div className="subheader">
                            <span>Enter the code we sent to your email address </span>
                            <span>to verify your account:</span>
                        </div>
                        <VerificationForm flow={flow} error={errMsg} submit={submit} />
                    </>
                }
            </div>
        </ JiggleDiv>
    )
}


export default Verification
