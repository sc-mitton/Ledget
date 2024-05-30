import { useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"

import "./style/Verification.scss"
import { WindowLoadingBar } from "@pieces"
import {
    FormError,
    JiggleDiv,
    VerificationForm,
    VerificationStatusGraphic,
    useColorScheme,
    ColumnWindowHeader
} from "@ledget/ui"
import { useFlow } from '@ledget/ory'
import { useLazyGetVerificationFlowQuery, useCompleteVerificationFlowMutation } from '@features/orySlice'

const Verification = () => {
    const [jiggle, setJiggle] = useState(false)
    const [codeIsCorrect, setCodeIsCorrect] = useState(false)
    const [unhandledIdMessage, setUnhandledIdMessage] = useState('')
    const [refreshSuccess, setRefreshSuccess] = useState(false)
    const navigate = useNavigate()
    const { flow, result, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetVerificationFlowQuery,
        useCompleteVerificationFlowMutation,
        'verification')
    const {
        errMsg,
        isGettingFlow,
        isCompletingFlow,
        isCompleteSuccess
    } = flowStatus
    const { isDark } = useColorScheme()

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
                    navigate(0)
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
        <JiggleDiv className="portal-window" id="verification-window" jiggle={jiggle}>
            <WindowLoadingBar visible={isGettingFlow || isCompletingFlow} />
            <ColumnWindowHeader>
                <h2>Verify Email Address</h2>
                <div>Step 3 of 4</div>
            </ColumnWindowHeader>
            <VerificationStatusGraphic finished={codeIsCorrect} dark={isDark} />
            <div id="verification--container">
                {errMsg
                    ?
                    <div id="verification-form-error-container">
                        {unhandledIdMessage && <FormError msg={unhandledIdMessage} />}
                        <FormError msg={errMsg} />
                    </div>
                    :
                    <>
                        <div className="subheader">
                            <span>Enter the code we sent to your email address
                                to verify your account:</span>
                        </div>
                        <VerificationForm
                            flow={flow}
                            refreshSuccess={refreshSuccess}
                            submit={submit}
                            identifier={JSON.parse(sessionStorage.getItem('identifier'))}
                            loading={isGettingFlow}
                            submitting={isCompletingFlow}
                        />
                    </>
                }
            </div>
        </ JiggleDiv>
    )
}


export default Verification
