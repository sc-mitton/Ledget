import React, { useContext, useEffect } from "react"

import { useSearchParams } from "react-router-dom"
import logo from "../../assets/images/logo.svg"

import Otc from "./Otc"
import { VerificationContextProvider, VerificationContext } from "../../context/Flow"
import { WindowLoadingBar } from "../widgets/Widgets"
import "./style/Verification.css"
import Replay from "../../assets/icons/Replay"
import verifyEmail from "../../assets/icons/verifyEmail.svg"
import SignUpFlowHeader from "./SignUpFlowHeader"

const VerificationForm = () => {
    const { submit, CsrfToken } = useContext(VerificationContext)

    return (
        <form onSubmit={(e) => submit(e)}>
            <div id="otc-container">
                <Otc codeLength={6} />
            </div>
            <CsrfToken />
        </form>
    )
}

const VerificationFlow = () => {
    {/* Add the verification flow */ }

    const [searchParams] = useSearchParams()
    const { flow, getFlow, createFlow } = useContext(VerificationContext)

    useEffect(() => {
        // we might redirect to this page after the flow is initialized,
        // so we check for the flowId in the URL
        const flowId = searchParams.get("flow")
        // Get new flow if it's expired
        flowId ? getFlow(flowId).catch(createFlow) : createFlow()
    }, [])
    123456
    return (
        <div className="window" id="verification-window">
            <SignUpFlowHeader step={3} steps={4} />
            <div id="verification-form-container">
                <img id="verify-your-email" src={verifyEmail} alt="Verify Email" />
                <h2>Verify your email address</h2>

                <span>Enter the code we sent to your email address </span>
                <br />
                <span>to verify your account.</span>
                <VerificationForm />
                <button
                    className="charcoal-button"
                    id="verify-otc"
                    type="submit"
                    form="verification-form"
                >
                    Verify
                </button>
                <div id="resend-btn-container">
                    <button id="resend-btn">
                        <span>Resend</span>
                        <Replay fill={'var(--main-green)'} />
                    </button>
                </div>
            </div>
            {/* <WindowLoadingBar visible={!flow} /> */}
        </div>
    )
}

const VerificationWindow = () => {

    return (
        <VerificationContextProvider>
            <VerificationFlow />
        </VerificationContextProvider>
    )
}


export default VerificationWindow
