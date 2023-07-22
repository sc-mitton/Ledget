import React, { useEffect, useContext, useRef, useState } from 'react'

import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion"

import { RecoveryFlowContext, RecoveryFlowContextProvider } from '../../context/Flow'
import SignUpFlowHeader from "./SignUpFlowHeader"
import CsrfToken from './inputs/CsrfToken'
import ResendButton from "./inputs/ResendButton"
import BackButton from './inputs/BackButton'
import Otc from './Otc'
import { WindowLoadingBar, FormError } from '../widgets/Widgets'
import forgotPassword from '../../assets/icons/forgotPassword.svg'
import './style/Recovery.css'

const RecoveryForm = ({ setEmail }) => {
    const { flow, csrf, submit } = useContext(RecoveryFlowContext)
    const emailRef = useRef(null)
    const [animationActive, setAnimationActive] = useState(false)

    useEffect(() => {
        emailRef.current.focus()
    }, [])

    const handleButtonClick = () => {
        sessionStorage.setItem('recovery_email', emailRef.current.value)
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
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <CsrfToken csrf={csrf} />
            <button
                className={`charcoal-button verification-button${animationActive ? ' animate' : ''}`}
                onClick={handleButtonClick}
                type="submit"
                value="code"
            >
                Send recovery email
            </button>
        </form>
    )
}

const RecoveryVerificationForm = ({ email }) => {
    const { flow, submit, csrf, recovering } = useContext(RecoveryFlowContext)
    const [animationActive, setAnimationActive] = useState(false)

    const handleButtonClick = () => {
        setAnimationActive(true)

        setTimeout(() => {
            setAnimationActive(false)
        }, 1000)
    }

    return (
        <>
            {recovering && <WindowLoadingBar />}
            <form
                id="recovery-verification-form"
                action={flow?.ui.action}
                method={flow?.ui.method}
                onSubmit={submit}
            >
                <Otc codeLength={6} />
                <CsrfToken csrf={csrf} />
                <input type="hidden" name="email" value={email} />
                <div className="verification-button-container">
                    <button
                        className={`charcoal-button verification-button${animationActive ? ' animate' : ''}`}
                        onClick={handleButtonClick}
                        type="submit"
                        value="code"
                    >
                        Verify Code
                    </button>
                </div>
            </form>
            <form
                action={flow?.ui.action}
                method={flow?.ui.method}
                onSubmit={submit}
            >
                <ResendButton />
                <CsrfToken csrf={csrf} />
                <input type="hidden" name="email" value={email} />
            </form>
        </>
    )
}

const AnimatedForms = () => {
    const [email, setEmail] = useState("")
    const { codeSent, setCodeSent } = useContext(RecoveryFlowContext)

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('recovery_email')
        if (storedEmail) {
            setEmail(storedEmail)
        }
    }, [])

    const handleBackButtonClick = (e) => {
        setCodeSent(false)
        sessionStorage.removeItem('recovery_email')
    }

    return (
        <AnimatePresence mode="wait">
            {!codeSent
                ?
                <motion.div
                    className="recovery-form-container"
                    key="recovery-form-container"
                    initial={{ opacity: 0, x: email ? -30 : 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                >
                    <>
                        <SignUpFlowHeader steps={0} />
                        <div id="forgot-password-image-container">
                            <img src={forgotPassword} alt="Forgot password" />
                        </div>
                        <h2>Forgot password?</h2>
                        <div className='subheader'>
                            <span>Enter the email connected to your account: </span>
                        </div>
                        <RecoveryForm setEmail={setEmail} />
                    </>
                </motion.div>
                :
                <motion.div
                    className="recovery-verification-form-container"
                    key="recovery-verification-form-container"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                >
                    <>
                        <BackButton
                            onClick={handleBackButtonClick}
                        />
                        <div id="forgot-password-image-container">
                            <img src={forgotPassword} alt="Forgot password" />
                        </div>
                        <h2>Recovery Code</h2>
                        <div className='subheader'>
                            <span>Enter the code sent to your email: </span>
                        </div>
                        <RecoveryVerificationForm email={email} />
                    </>
                </motion.div>
            }
        </AnimatePresence>
    )
}

const RecoveryFlow = () => {
    const { getFlow, createFlow, responseError } = useContext(RecoveryFlowContext)
    const [searchParams] = useSearchParams()

    useEffect(() => {
        // we might redirect to this page after the flow is initialized,
        // so we check for the flowId in the URL
        const flowId = searchParams.get("flow")
        // Get new flow if it's expired
        flowId ? getFlow(flowId).catch(createFlow) : createFlow()
    }, [])

    return (
        <div className="window" id="recovery-window">
            {responseError
                ?
                <>
                    <SignUpFlowHeader />
                    <FormError msg={responseError} />
                </>
                :
                <AnimatedForms />
            }
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
