import React, { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import './styles/Authenticator.css'
import { useCompleteSettingsFlowMutation } from '@features/orySlice'
import {
    BackButton,
    GreenSubmitWithArrow,
    TextInput,
    LoadingRingDiv,
    NodeImage,
    GrnTextButton,
    CopyButton
} from '@ledget/shared-ui'
import { useSettingsFlow } from '@utils'


const ZoomMotionDiv = ({ children, id }) => {
    const variants = {
        initial: { opacity: 0, transform: 'scale(0.9)' },
        animate: { opacity: 1, transform: 'scale(1)' },
        exit: { opacity: 0, transform: 'scale(0.9)' }
    }

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
            id={id}
            key={id}
        >
            {children}
        </motion.div>
    )
}

const SetupApp = ({ codeMode, setCodeMode }) => {
    const { flow, isLoading } = useSettingsFlow()
    const [qrNode, setQrNode] = useState(null)
    const [totpSecret, setTotpSecret] = useState('')

    useEffect(() => {
        if (flow) {
            const node = flow.ui.nodes.find(node => node.group === 'totp' && node.type === 'img')
            setQrNode(node)
            const totpSecret = flow.ui.nodes.find(node => node.group === 'totp' && node.type === 'text')
            setTotpSecret(totpSecret?.attributes.text.context.secret)
        }
    }, [isLoading])

    return (
        <div id="code-scan--container">
            <div
                className="spaced-header2"
                style={{ opacity: .8 }}
            >
                {!codeMode &&
                    <>
                        <span>
                            Scan the QR code below with your authenticator app
                        </span>
                        <span>
                            e.g. Google Authenticator, Authy, etc.
                        </span>
                    </>
                }
            </div>
            <LoadingRingDiv loading={isLoading} color='dark' id="auth-setup--content">
                <AnimatePresence mode="wait">
                    {codeMode
                        ?
                        <ZoomMotionDiv id="code-setup--container">
                            <span>Enter this code in your app</span>
                            <div>
                                <span>{totpSecret}</span>
                                <CopyButton
                                    type="button"
                                    onClick={() => navigator.clipboard.writeText(totpSecret)}
                                />
                            </div>
                        </ZoomMotionDiv>
                        :
                        <ZoomMotionDiv id='qr-setup--container'>
                            <div id="qr-code--container">
                                {qrNode && <NodeImage node={qrNode} attributes={qrNode.attributes} />}
                            </div>
                            <GrnTextButton
                                type='button'
                                onClick={() => setCodeMode(true)}
                            >
                                Can't scan it?
                            </GrnTextButton>
                        </ZoomMotionDiv>
                    }
                </AnimatePresence>
            </LoadingRingDiv>
        </div>
    )
}

const ConfirmCode = () => (
    <div>
        <di id="confirm-code--container">
            <div>
                <label htmlFor="code">
                    Enter the code from your
                    authenticator app
                </label>
                <TextInput>
                    <input id="code" type="text" placeholder="Code" />
                </TextInput>
            </div>
        </di>
    </div>
)

const Authenticator = () => {
    const { flow } = useSettingsFlow()
    const navigate = useNavigate()
    const [onConfirmStep, setConfirmStep] = useState(false)
    const [codeMode, setCodeMode] = useState(false)

    const [completeFlow, { isSuccess: completedFlow }] = useCompleteSettingsFlowMutation()

    useEffect(() => {
        if (completedFlow) {
            useUpdateUserMutation({ authenticator_enabled: true })
        }
    }, [completedFlow])

    const handleSubmit = (e) => {
        e.preventDefault()
        const csrf_token_node = flow.ui.nodes.find(node => node.attributes.name === 'csrf_token')

        if (onConfirmStep) {
            completeFlow({
                params: { flowId: searchParams.get('flow') },
                data: {
                    csrf_token: csrf_token_node.attributes.value,
                    method: 'totp',
                    totp_code: totpValue
                }
            })
        } else {
            setConfirmStep(true)
        }
    }

    const handleBack = () => {
        if (onConfirmStep) {
            setConfirmStep(false)
        } else if (codeMode) {
            setCodeMode(false)
        } else {
            navigate('/profile/security')
        }
    }

    return (
        <div className="padded-content" id="authenticator-page">
            <h1>Authenticator</h1>
            <form onSubmit={handleSubmit} id='authenticator-setup-form'>
                <AnimatePresence mode="wait">
                    {onConfirmStep
                        ?
                        <AnimatePresence>
                            <ConfirmCode />
                        </AnimatePresence>
                        :
                        <AnimatePresence>
                            <SetupApp
                                codeMode={codeMode}
                                setCodeMode={setCodeMode}
                            />
                        </AnimatePresence>
                    }
                </AnimatePresence>
                <div>
                    <BackButton
                        onClick={handleBack}
                        type="button"
                    />
                    <GreenSubmitWithArrow stroke={'var(--m-text-gray)'}>
                        {onConfirmStep ? 'Confirm' : 'Next'}
                    </GreenSubmitWithArrow>
                </div>
            </form>
        </div>
    )
}

export default Authenticator

// <div id="recovery-codes-button--container">
// <span>Recovery Codes:</span>
// <div>
//     <GrnSlimButton className="recovery-codes-button">
//         Download
//         <DownloadIcon stroke={'var(--green-dark3)'} />
//     </GrnSlimButton>
//     <GrnSlimButton className="recovery-codes-button">
//         Copy
//         <CopyIcon fill={'var(--green-dark3)'} />
//     </GrnSlimButton>
// </div>
// </div>
