import React, { useEffect, useContext, useRef, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import { RecoveryFlowContext, RecoveryFlowContextProvider } from '../../context/Flow'
import SignUpFlowHeader from "./SignUpFlowHeader"
import CsrfToken from './inputs/CsrfToken'
import forgotPassword from '../../assets/icons/forgotPassword.svg'
import './style/Recovery.css'


const RecoveryForm = () => {
    const { flow, csrf, submit } = useContext(RecoveryFlowContext)
    const emailRef = useRef(null)
    const [animationActive, setAnimationActive] = useState(false)

    useEffect(() => {
        emailRef.current.focus()
    }, [])

    const handleButtonClick = () => {
        setAnimationActive(true)

        setTimeout(() => {
            setAnimationActive(false)
        }, 1000)
    }

    return (
        <form
            id="recovery-form"
            action={flow?.ui.action}
            method={flow?.ui.method}
            onSubmit={submit}
        >
            <div className="input-container">
                <input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    ref={emailRef}
                    name="email"
                />
            </div>
            <CsrfToken csrf={csrf} />
            <div className="button-container">
                <button
                    className={`charcoal-button${animationActive ? ' animate' : ''}`}
                    id="send-recovery-email-button"
                    onClick={handleButtonClick}
                    type="submit"
                    value="code"
                >
                    Send recovery email
                </button>
            </div>
        </form>
    )
}


const RecoveryFlow = () => {
    const { getFlow, createFlow } = useContext(RecoveryFlowContext)
    const [searchParams] = useSearchParams()


    useEffect(() => {
        // we might redirect to this page after the flow is initialized,
        // so we check for the flowId in the URL
        const flowId = searchParams.get("flow")
        // Get new flow if it's expired
        flowId ? getFlow(flowId).catch(createFlow) : createFlow()
    }, [])

    return (
        <div className='window' id='recovery-window'>
            <SignUpFlowHeader steps={0} />
            <div id="forgot-password-image-container">
                <img src={forgotPassword} alt="Forgot password" />
            </div>
            <h2>Forgot password?</h2>
            <div id="message">
                <span>Enter the email connected to your account: </span>
            </div>
            <RecoveryForm />
        </div>
    )
}

const RecoveryWindow = () => {

    return (
        <RecoveryFlowContextProvider>
            <RecoveryFlow />
        </RecoveryFlowContextProvider>
    )
}

export default RecoveryWindow
