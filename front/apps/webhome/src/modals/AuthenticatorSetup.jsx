import { useEffect, useState } from 'react'

import { AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'

import './styles/Authenticator.css'
import { useCompleteSettingsFlowMutation, useLazyGetSettingsFlowQuery } from '@features/orySlice'
import { useUpdateUserMutation } from '@features/userSlice'
import { useAddRememberedDeviceMutation } from '@features/authSlice'
import { Content as RecoveryCodes } from '@modals/RecoveryCodes'
import { useFlow } from 'ory-sdk'
import { withModal } from '@ledget/ui'
import { withReAuth } from '@utils'
import {
    BackButton,
    GreenSubmitWithArrow,
    GreenSubmitButton,
    PlainTextInput,
    LoadingRingDiv,
    NodeImage,
    GrnTextButton,
    CopyButton,
    FormError,
    JiggleDiv,
    ZoomMotionDiv,
    SlideMotionDiv,
    TotpAppGraphic
} from '@ledget/ui'

const SetupApp = ({ flow, isError, isLoading, codeMode, setCodeMode }) => {
    const [qrNode, setQrNode] = useState(null)
    const [totpSecret, setTotpSecret] = useState('')

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
    const [searchParams, setSearchParams] = useSearchParams()
    const [codeMode, setCodeMode] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const [updateUser] = useUpdateUserMutation()
    const [addRememberedDevice] = useAddRememberedDeviceMutation()

    const { flow, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetSettingsFlowQuery,
        useCompleteSettingsFlowMutation,
        'settings'
    )
    const {
        isGettingFlow,
        errorFetchingFlow,
        isCompleteError,
        isCompleteSuccess,
        isCompletingFlow,
    } = flowStatus

    const handleBack = () => {
        if (codeMode) {
            setCodeMode(false)
        } else if (searchParams.get('step') === 'setup') {
            props.closeModal()
        } else if (searchParams.get('step') === 'confirm') {
            searchParams.set('step', 'setup')
            setSearchParams(searchParams)
        }
    }

    // Fetch flow on mount
    useEffect(() => { fetchFlow() }, [])

    // Set initial view
    useEffect(() => {
        searchParams.set('step', 'setup')
        setSearchParams(searchParams)
    }, [])

    // Handle successful flow completion
    // Update the user's mfa settings and the device token cookie
    useEffect(() => {
        let timeout
        if (isCompleteSuccess) {
            updateUser({ data: { mfa_method: 'totp' } })
            addRememberedDevice()
            timeout = setTimeout(() => {
                searchParams.delete('step')
                searchParams.set('lookup_secret_regenerate', true)
                setSearchParams(searchParams)
            }, 1200)
        }
        return () => clearTimeout(timeout)
    }, [isCompleteSuccess])

    // Set loaded state after 100ms (for animation divs)
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoaded(true)
        }, 100)
        return () => clearTimeout(timeout)
    }, [])

    return (
        <div id="authenticator-page">
            <form onSubmit={submit} id='authenticator-setup-form'>
                <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
                <AnimatePresence mode="wait">
                    {/* Page 1: Setup App */}
                    {searchParams.get('step') === 'setup' &&
                        <SlideMotionDiv key='setup-app' first={loaded}>
                            <h2>Authenticator App</h2>
                            <SetupApp
                                flow={flow}
                                codeMode={codeMode}
                                setCodeMode={setCodeMode}
                                isLoading={isGettingFlow}
                                isError={errorFetchingFlow}
                            />
                        </SlideMotionDiv>
                    }
                    {/* Page 2: Confirm Code */}
                    {searchParams.get('step') === 'confirm' &&
                        <SlideMotionDiv
                            key="confirm-code"
                            first={!searchParams.get('step')}
                            last={searchParams.get('step') === 'confirm'}
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
                    {!searchParams.get('step') &&
                        searchParams.get('lookup_secret_regenerate') &&
                        <SlideMotionDiv key="lookup-secrets" last>
                            <RecoveryCodes closeModal={() => props.closeModal()} />
                        </SlideMotionDiv>
                    }
                </AnimatePresence>
                {/* Nav Buttons */}
                {!searchParams.get('lookup_secret_regenerate') &&
                    <div>
                        <BackButton onClick={handleBack} type="button" />
                        {searchParams.get('step') === 'confirm'
                            ?
                            <GreenSubmitButton
                                name="method"
                                value="totp"
                                submitting={isCompletingFlow}
                            >
                                Confirm
                            </GreenSubmitButton>
                            :
                            <GreenSubmitWithArrow
                                type="button"
                                onClick={() => {
                                    searchParams.set('step', 'confirm')
                                    setSearchParams(searchParams)
                                }}
                            >
                                Next
                            </GreenSubmitWithArrow>
                        }
                    </div>
                }
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
            maxWidth={400}
        />
    )
}


