import { useEffect, useState } from 'react'

import { AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'

import './styles/Authenticator.scss'
import { useCompleteSettingsFlowMutation, useLazyGetSettingsFlowQuery } from '@features/orySlice'
import { useUpdateUserMutation } from '@features/userSlice'
import { useAddRememberedDeviceMutation } from '@features/authSlice'
import { GenerateViewRecoveryCodes } from '@modals/RecoveryCodes'
import { useFlow } from '@ledget/ory'
import { withModal } from '@ledget/ui'
import { withReAuth } from '@utils/index'
import {
    BackButton,
    BlueSubmitWithArrow,
    BlueSubmitButton,
    PlainTextInput,
    LoadingRingDiv,
    NodeImage,
    PrimaryTextButton,
    CopyButton,
    FormError,
    JiggleDiv,
    ZoomMotionDiv,
    SlideMotionDiv,
    TotpAppGraphic,
    useLoaded,
    useColorScheme
} from '@ledget/ui'

interface SetupAppProps {
    flow: any
    isError: boolean
    isLoading: boolean
    codeMode: boolean
    setCodeMode: (value: boolean) => void
}

const SetupApp = ({ flow, isError, isLoading, codeMode, setCodeMode }: SetupAppProps) => {
    const [qrNode, setQrNode] = useState<{ attributes: string }>()
    const [totpSecret, setTotpSecret] = useState('')
    const { isDark } = useColorScheme()

    useEffect(() => {
        if (flow) {
            const node = flow.ui.nodes.find((node: any) => node.group === 'totp' && node.type === 'img')
            setQrNode(node)
            const totpSecret = flow.ui.nodes.find((node: any) => node.group === 'totp' && node.type === 'text')
            setTotpSecret(totpSecret?.attributes.text.context.secret)
        }
    }, [flow])

    return (
        <div >
            {!codeMode &&
                <div className="spaced-header2">
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
                                        <div className={`qr-image ${isDark ? 'dark-mode' : ''}`}>
                                            <NodeImage node={qrNode} attributes={qrNode.attributes} />
                                        </div>
                                        <PrimaryTextButton
                                            type='button'
                                            onClick={() => setCodeMode(true)}
                                        >
                                            Can't scan it?
                                        </PrimaryTextButton>
                                    </>
                                }
                            </ZoomMotionDiv>
                            {isError && <FormError msg={"Something went wrong, please try again later."} insideForm={false} />}
                        </div>
                    }
                </AnimatePresence>
            </LoadingRingDiv>
        </div>
    )
}

const Authenticator = withReAuth(withModal((props) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [codeMode, setCodeMode] = useState(false)
    const loaded = useLoaded(100)
    const [step, setStep] = useState<'setup' | 'confirm' | undefined>('setup')

    const [updateUser] = useUpdateUserMutation()
    const [addRememberedDevice] = useAddRememberedDeviceMutation()

    const { flow, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetSettingsFlowQuery,
        useCompleteSettingsFlowMutation,
        'settings'
    )
    const {
        isGettingFlow,
        isGetFlowError,
        isCompleteError,
        isCompleteSuccess,
        isCompletingFlow,
    } = flowStatus

    const handleBack = () => {
        if (codeMode) {
            setCodeMode(false)
        } else if (step === 'setup') {
            props.closeModal()
        } else if (step === 'confirm') {
            setStep('setup')
        }
    }

    // Fetch flow on mount
    useEffect(() => { fetchFlow() }, [])

    // Handle successful flow completion
    // Update the user's mfa settings and the device token cookie
    useEffect(() => {
        if (isCompleteSuccess) {
            updateUser({ mfa_method: 'totp' })
            addRememberedDevice()
            const timeout = setTimeout(() => {
                searchParams.set('lookup_secret_regenerate', 'true')
                setSearchParams(searchParams)
                setStep(undefined)
            }, 1200)
            return () => clearTimeout(timeout)
        }
    }, [isCompleteSuccess])

    return (
        <div id="authenticator-page">
            <form onSubmit={submit} id='authenticator-setup-form'>
                <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
                <AnimatePresence mode="wait">
                    {/* Page 1: Setup App */}
                    {step === 'setup' &&
                        <SlideMotionDiv key='setup-app' position={loaded ? 'first' : 'fixed'}>
                            <h2>Authenticator App</h2>
                            <SetupApp
                                flow={flow}
                                codeMode={codeMode}
                                setCodeMode={setCodeMode}
                                isLoading={isGettingFlow}
                                isError={isGetFlowError}
                            />
                        </SlideMotionDiv>
                    }
                    {/* Page 2: Confirm Code */}
                    {step === 'confirm' &&
                        <SlideMotionDiv
                            key="confirm-code"
                            position={step === 'confirm' ? 'last' : step ? 'last' : 'first'}
                        >
                            <JiggleDiv jiggle={isCompleteError} className="content">
                                <div>
                                    <TotpAppGraphic finished={isCompleteSuccess} />
                                    <label htmlFor="code" >
                                        Enter the code from your
                                        authenticator app
                                    </label>
                                    <PlainTextInput name="totp_code" placeholder="Code" />
                                </div>
                            </JiggleDiv>
                        </SlideMotionDiv>
                    }
                    {/* Page 3: Recovery Codes */}
                    {!step && searchParams.get('lookup_secret_regenerate') &&
                        <SlideMotionDiv key="lookup-secrets" position={'last'}>
                            <GenerateViewRecoveryCodes onFinish={() => props.closeModal()} />
                        </SlideMotionDiv>}
                </AnimatePresence>
                {/* Nav Buttons */}
                {!searchParams.get('lookup_secret_regenerate') &&
                    <div>
                        <BackButton onClick={handleBack} type="button" />
                        {step === 'confirm'
                            ?
                            <BlueSubmitButton
                                name="method"
                                value="totp"
                                submitting={isCompletingFlow}
                            >
                                Confirm
                            </BlueSubmitButton>
                            :
                            <BlueSubmitWithArrow type="button" onClick={() => { setStep('confirm') }}>
                                Next
                            </BlueSubmitWithArrow>
                        }
                    </div>
                }
            </form>
        </div>
    )
}))

export default function () {
    const navigate = useNavigate()

    return (
        <Authenticator
            onClose={() => navigate('/profile/security')}
            blur={1}
            maxWidth={'350px'}
        />
    )
}


