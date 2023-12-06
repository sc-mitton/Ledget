import { useEffect, useState } from "react"

import { useNavigate } from 'react-router-dom'

import './styles/ForceVerification.css'
import { withModal } from '@ledget/ui'
import {
    FormError,
    JiggleDiv,
    VerificationForm
} from "@ledget/ui"
import { useFlow } from '@ledget/ory'
import { useGetMeQuery } from '@features/userSlice'
import { useLazyGetVerificationFlowQuery, useCompleteVerificationFlowMutation } from '@features/orySlice'

const ForceVerification = withModal((props) => {
    const { data: user } = useGetMeQuery()
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
                props.closeModal()
            }, 1000)
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
        <>
            <div>
                <h2>Verify Your Email Address</h2>
            </div>
            <div id="force-verification-form--container">
                {errMsg
                    ?
                    <div id="verification-form-error-container">
                        {unhandledIdMessage && <FormError msg={unhandledIdMessage} />}
                        <FormError msg={errMsg} />
                    </div>
                    :
                    <>
                        <div className="subheader">
                            <span>
                                Looks like you still need to verify your email address,
                                enter the code we sent you below.
                            </span>
                        </div>
                        <JiggleDiv jiggle={jiggle}>
                            <VerificationForm
                                flow={flow}
                                refreshSuccess={refreshSuccess}
                                submit={submit}
                                identifier={user?.email}
                                resendOnLoad={true}
                                loading={isGettingFlow}
                                submitting={isCompletingFlow}
                            />
                        </ JiggleDiv>
                    </>
                }
            </div>
        </>
    )
})

export default function (props) {
    const navigate = useNavigate()

    return (
        <ForceVerification
            hasExit={false}
            overLayExit={false}
            onClose={() => navigate(-1)}
            disableClose={true}
            maxWidth={props.maxWidth || '21.875rem'}
            blur={1}
        />
    )
}
