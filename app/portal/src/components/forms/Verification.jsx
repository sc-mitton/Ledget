import React, { useContext, useEffect, useState, useRef, useCallback } from "react"

import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"

import Otc from "./Otc"
import { VerificationFlowContextProvider, VerificationFlowContext } from "../../context/Flow"
import { WindowLoadingBar } from "../pieces"
import "./style/Verification.css"
import verifyEmail from "@assets/icons/verifyEmail.svg"
import SignUpFlowHeader from "../pieces/SignUpFlowHeader"
import UserContext from "../../context/UserContext"
import CsrfToken from "./inputs/CsrfToken"
import { FormError } from "../pieces"
import ResendButton from "./inputs/ResendButton"
import { set } from "react-hook-form"

const VerificationForm = () => {
    const { flow, submit, csrf, codeError } = useContext(VerificationFlowContext)
    const [otcDisabled, setOtcDisabled] = useState(false)
    const { user } = useContext(UserContext)
    const [reset, setReset] = useState(false)

    useEffect(() => {
        flow ? setOtcDisabled(false) : setOtcDisabled(true)
    }, [flow])

    useEffect(() => {
        codeError && setReset(true)
    }, [codeError])

    return (
        <>
            <form
                action={flow?.ui.action}
                method={flow?.ui.method}
                onSubmit={submit}
            >
                <div id="otc-container">
                    <Otc codeLength={6} reset={reset} setReset={setReset} />
                </div>
                <CsrfToken csrf={csrf} />
                <input
                    type="hidden"
                    name="email"
                    value={user?.traits?.email}
                />
                <button
                    className="btn-chcl btn-main"
                    id="verify-otc"
                    type="submit"
                    value="code"
                    disabled={otcDisabled}
                >
                    Submit
                </button>
            </form>
            <form
                action={flow?.ui.action}
                method={flow?.ui.method}
                onSubmit={submit}
            >
                <ResendButton />
                <CsrfToken csrf={csrf} />
                <input
                    type="hidden"
                    name="email"
                    value={user?.traits?.email}
                />
            </form>
        </>
    )
}

const AnimatedVerification = () => {
    const [jiggle, setJiggle] = useState(false)

    const {
        codeError,
        verifying,
        responseError,
    } = useContext(VerificationFlowContext)

    useEffect(() => {
        if (codeError) {
            setJiggle(true)
        }
    }, [codeError])

    const jiggleVariants = {
        initial: { x: 0 },
        jiggle: {
            x: [-20, 20, 0],
            transition: { duration: .2, type: 'spring', stiffness: 1000, damping: 10 },
        },
    }

    return (
        < motion.div
            className="window"
            id="verification-window"
            initial="initial"
            animate={jiggle ? 'jiggle' : 'initial'}
            variants={jiggleVariants}
            onAnimationComplete={() => setJiggle(false)}
        >
            <WindowLoadingBar visible={verifying} />
            <div className="window-header">
                <SignUpFlowHeader step={2} steps={4} />
                <h2>Email Verification</h2>
                <h4>Step 3 of 4</h4>
            </div>
            <div id="verification-form-container">
                <div>
                    <img id="verify-your-email" src={verifyEmail} alt="Verify Email" />
                </div>
                {responseError
                    ?
                    <div id="verification-form-error-container">
                        <FormError msg={responseError} />
                    </div>
                    :
                    <>
                        <h2>Verify your email address</h2>
                        <div className="subheader">
                            <span>Enter the code we sent to your email address</span>
                            <span>to verify your account:</span>
                        </div>
                        <VerificationForm />
                    </>
                }
            </div>

        </ motion.div>
    )
}

const VerifiactionFlow = () => {
    const [searchParams] = useSearchParams()
    const [resendEmail, setResendEmail] = useState(false)
    const [newFlowCreated, setNewFlowCreated] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const {
        csrf,
        getFlow,
        createFlow,
        callVerificationApi
    } = useContext(VerificationFlowContext)
    const { user } = useContext(UserContext)

    // useEffect(() => {
    //     if (loaded) { return }

    //     // we might redirect to this page after the flow is initialized,
    //     // so we check for the flowId in the URL
    //     const flowId = searchParams.get("flow")
    //     if (flowId) {
    //         getFlow(flowId).catch(createFlow)
    //     } else {
    //         // Otherwise, create a new flow
    //         createFlow()
    //         setNewFlowCreated(true)
    //     }

    //     return setLoaded(true)
    // }, [])

    // useEffect(() => {
    //     if (newFlowCreated) {
    //         setResendEmail(true)
    //     }
    // }, [csrf])

    // useEffect(() => {
    //     if (resendEmail) {
    //         callVerificationApi({
    //             method: 'code',
    //             csrf_token: csrf,
    //             email: user?.traits?.email,
    //         })
    //     }
    //     return setResendEmail(false)
    // }, [resendEmail])

    return <AnimatedVerification />
}

const VerificationWindow = () => {

    return (
        <VerificationFlowContextProvider>
            <VerifiactionFlow />
        </VerificationFlowContextProvider>
    )
}


export default VerificationWindow
