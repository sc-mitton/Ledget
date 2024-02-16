import { useEffect, useState } from 'react'

import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Download, Copy } from '@geist-ui/icons'

import './styles/RecoveryCodes.scss'
import { BlueSubmitButton, BluePrimaryButton, SlideMotionDiv, LoadingMessage } from '@ledget/ui'
import { withSmallModal, ExpandableContainer } from '@ledget/ui'
import { withReAuth } from '@utils/index'
import { useFlow } from '@ledget/ory'
import { useCompleteSettingsFlowMutation, useLazyGetSettingsFlowQuery } from '@features/orySlice'

export const GenerateViewRecoveryCodes = (props: { onFinish: () => void }) => {
    const [searchParams] = useSearchParams()
    const [recoveryCodes, setRecoveryCodes] = useState([])
    const location = useLocation()
    const [loading, setLoading] = useState(true)
    const [generatingNewCodes, setGeneratingNewCodes] = useState(false)

    const {
        flow,
        fetchFlow,
        flowStatus,
        completeFlow: completeSettingsFlow,
        resetCompleteFlow,
        mutationCacheKey
    } = useFlow(
        useLazyGetSettingsFlowQuery,
        useCompleteSettingsFlowMutation,
        'settings'
    )

    const { isCompleteSuccess: isCompleteSettingsFlowSuccess, errId } = flowStatus

    const handleDownload = () => {
        const codes = recoveryCodes.join('\n')
        const element = document.createElement('a')
        const file = new Blob([codes], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = 'ledget-recovery-codes.txt'
        document.body.appendChild(element)
        element.click()
    }

    const handleCopy = () => {
        const codes = recoveryCodes.join('\n')
        navigator.clipboard.writeText(codes)
    }

    const confirmedSavedCodes = () => {
        const csrf_token_node = flow?.ui?.nodes?.find((node: any) =>
            node.attributes.name === 'csrf_token'
        )?.attributes
        const csrf_token = (csrf_token_node as any)?.value

        completeSettingsFlow({
            params: { flow: searchParams.get('flow') },
            data: {
                csrf_token: csrf_token,
                method: 'lookup_secret',
                lookup_secret_confirm: true,
            }
        })
    }

    // Fetch settings flow on mount
    useEffect(() => { fetchFlow() }, [])

    // Regenerate or view recovery codes after flow is fetched
    useEffect(() => {
        if (flowStatus.isGetFlowSuccess) {
            setLoading(false)
            mutationCacheKey && completeSettingsFlow({
                params: { flow: searchParams.get('flow') || flow?.id },
                data: {
                    csrf_token: flow?.csrf_token,
                    method: 'lookup_secret',
                    ...(searchParams.get('lookup_secret_regenerate')
                        ? { lookup_secret_regenerate: true } : {}),
                    ...(searchParams.get('lookup_secret_reveal')
                        ? { lookup_secret_reveal: true } : {}),
                }
            })
        }
    }, [flowStatus.isGetFlowSuccess, mutationCacheKey])

    // Extract recovery codes from flow
    // and save the codes if we're in the autenticator setup
    useEffect(() => {
        if (isCompleteSettingsFlowSuccess) {
            flow?.ui.nodes.find((node: any) => {
                if (node.attributes.id === 'lookup_secret_codes') {
                    setRecoveryCodes(node.attributes.text.text.split(','))
                    return true
                }
            })

            // Lower this flag if new codes were being generated and now they're available
            if (generatingNewCodes) {
                const timeout = setTimeout(() => {
                    setGeneratingNewCodes(false)
                }, 3000)
                return () => clearTimeout(timeout)
            }
        }
    }, [isCompleteSettingsFlowSuccess])

    // Close on any errors fetching flow or codes
    useEffect(() => {
        if (errId === 4000001) {
            resetCompleteFlow()
            completeSettingsFlow({
                params: { flow: searchParams.get('flow') || flow?.id },
                data: { csrf_token: flow?.csrf_token, method: 'lookup_secret', lookup_secret_regenerate: true }
            })
            setGeneratingNewCodes(true)
        } else if (errId) {
            props.onFinish()
        }
    }, [errId])

    return (
        <div id="recovery-codes--container">
            <h2>Recovery Codes</h2>
            <div
                id="recovery-codes-save--container"
                style={{
                    ...(location.pathname.includes('authenticator-setup') ? { marginBottom: '0' } : {})
                }}
            >
                <BlueSubmitButton
                    type="button"
                    loading={loading}
                    className="recovery-codes-button"
                    onClick={(e) => {
                        handleDownload()
                        confirmedSavedCodes()
                    }}
                >
                    Download
                    <Download className="icon" />
                </BlueSubmitButton>
                <BlueSubmitButton
                    type="button"
                    loading={loading}
                    className="recovery-codes-button"
                    onClick={() => {
                        handleCopy()
                        confirmedSavedCodes()
                    }}
                >
                    Copy
                    <Copy className="icon" />
                </BlueSubmitButton>
            </div>
            <ExpandableContainer expanded={generatingNewCodes}>
                <span>No recovery codes found,</span>
                <LoadingMessage message="generating new codes" />
            </ExpandableContainer>
        </div>
    )
}

const RecoveryCodesFlow = withReAuth(withSmallModal((props) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [proceed2Codes, setProceed2Codes] = useState(false)

    return (
        <AnimatePresence mode='wait'>
            {proceed2Codes
                ? <SlideMotionDiv key='generate-view-codes' position='last'>
                    <GenerateViewRecoveryCodes onFinish={() => props.closeModal()} />
                </SlideMotionDiv>
                : <SlideMotionDiv key='select-code-action' id="select-code-action--container" position='first'>
                    <BluePrimaryButton
                        onClick={() => {
                            searchParams.set('lookup_secret_regenerate', 'true')
                            setSearchParams(searchParams)
                            setProceed2Codes(true)
                        }}
                    >
                        Generate Codes
                    </BluePrimaryButton>
                    <BluePrimaryButton
                        onClick={() => {
                            searchParams.set('lookup_secret_reveal', 'true')
                            setSearchParams(searchParams)
                            setProceed2Codes(true)
                        }}
                    >
                        View Codes
                    </BluePrimaryButton>
                </SlideMotionDiv>}
        </AnimatePresence>
    )
}))


const RecoveryCodesModal = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    return (
        <RecoveryCodesFlow
            onClose={() => navigate('/settings/security')}
            hasExit={searchParams.get('lookup_secret_regenerate') ? false : true}
            overLayExit={searchParams.get('lookup_secret_regenerate') ? false : true}
        />
    )
}

export default RecoveryCodesModal
