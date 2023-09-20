import React, { useEffect, useState } from 'react'

import { AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'

import './styles/Authenticator.css'
import { useCompleteSettingsFlowMutation } from '@features/orySlice'
import { useUpdateUserMutation } from '@features/userSlice'
import {
    BackButton,
    GreenSubmitWithArrow,
    PlainTextInput,
    LoadingRingDiv,
    NodeImage,
    GrnTextButton,
    GreenSubmitButton,
    CopyButton,
    FormError,
    JiggleDiv,
    ZoomMotionDiv,
    SlideMotionDiv
} from '@ledget/shared-ui'
import { withModal } from '@ledget/shared-utils'
import { useSettingsFlow, withReAuth } from '@utils'


const SetupApp = ({ codeMode, setCodeMode }) => {
    const [qrNode, setQrNode] = useState(null)
    const [totpSecret, setTotpSecret] = useState('')
    const { flow, isLoading, isError } = useSettingsFlow()

    useEffect(() => {
        if (flow) {
            const node = flow.ui.nodes.find(node => node.group === 'totp' && node.type === 'img')
            setQrNode(node)
            const totpSecret = flow.ui.nodes.find(node => node.group === 'totp' && node.type === 'text')
            setTotpSecret(totpSecret?.attributes.text.context.secret)
        }
    }, [flow])

    return (
        <div >
            {!codeMode &&
                <div
                    className="spaced-header2"
                    style={{ opacity: .8 }}
                >
                    <span>
                        Scan the QR code below with your authenticator app
                    </span>
                    <span>
                        e.g. Google Authenticator, Authy, etc.
                    </span>
                </div>
            }
            <LoadingRingDiv loading={isLoading} color='dark' className="content">
                <AnimatePresence mode="wait">
                    {codeMode
                        ?
                        <ZoomMotionDiv id="code-setup--container" key={'code-setup--container'}>
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
                        <div>
                            <ZoomMotionDiv id="qr-setup--container" key={'qr-setup--container'}>
                                {(qrNode && !isError) &&
                                    <>
                                        <NodeImage node={qrNode} attributes={qrNode.attributes} />
                                        <GrnTextButton
                                            type='button'
                                            onClick={() => setCodeMode(true)}
                                        >
                                            Can't scan it?
                                        </GrnTextButton>
                                    </>
                                }
                            </ZoomMotionDiv>
                            {isError && <FormError msg={"Something went wrong, please try again later."} />}
                        </div>
                    }
                </AnimatePresence>
            </LoadingRingDiv>
        </div>
    )
}


const Authenticator = (props) => {
    const { flow } = useSettingsFlow()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [onConfirmStep, setConfirmStep] = useState(false)
    const [codeMode, setCodeMode] = useState(false)

    const [completeFlow, {
        isSuccess: completedFlow,
        isLoading: submitingFlow,
        isError: submitError
    }] = useCompleteSettingsFlowMutation()
    const [updateUser] = useUpdateUserMutation()

    // Handle successful flow completion
    useEffect(() => {
        let timeout
        if (completedFlow) {
            updateUser({ data: { authenticator_enabled: true } })
            timeout = setTimeout(() => {
                props.setVisible(false)
            }, 1000)
        }
        return () => clearTimeout(timeout)
    }, [completedFlow])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (onConfirmStep) {
            const formData = new FormData(e.target)
            const data = Object.fromEntries(formData)

            completeFlow({
                params: { flow: searchParams.get('flow') },
                data: {
                    csrf_token: flow?.csrf_token,
                    method: 'totp',
                    ...data
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
        <div id="authenticator-page">
            <h2>Authenticator Setup</h2>
            <form onSubmit={handleSubmit} id='authenticator-setup-form'>
                <AnimatePresence mode="wait">
                    {onConfirmStep
                        ?
                        <SlideMotionDiv key="confirm-code" last>
                            <JiggleDiv jiggle={submitError} className="content">
                                <div>
                                    <label htmlFor="code">
                                        Enter the code from your
                                        authenticator app
                                    </label>
                                    <PlainTextInput name="totp_code" placeholder="Code" />
                                </div>
                            </JiggleDiv>
                        </SlideMotionDiv>
                        :
                        <SlideMotionDiv key='setup-app' first={Boolean(flow)}>
                            <SetupApp
                                codeMode={codeMode}
                                setCodeMode={setCodeMode}
                            />
                        </SlideMotionDiv>
                    }
                </AnimatePresence>
                <div>
                    <BackButton onClick={handleBack} type="button" />
                    {onConfirmStep
                        ?
                        <GreenSubmitButton
                            submitting={submitingFlow}
                            success={completedFlow}
                        >
                            Confirm
                        </GreenSubmitButton>
                        :
                        <GreenSubmitWithArrow stroke={'var(--m-text-gray)'}>
                            Next
                        </GreenSubmitWithArrow>
                    }
                </div>
            </form>
        </div>
    )
}

const EnrichedModal = withReAuth(withModal(Authenticator))

export default function () {
    const navigate = useNavigate()

    return (
        <EnrichedModal
            onClose={() => navigate('/profile/security')}
            blur={1}
        />
    )
}

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
