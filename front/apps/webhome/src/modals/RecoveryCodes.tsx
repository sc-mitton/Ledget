import { useEffect, useState } from 'react'

import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import './styles/RecoveryCodes.scss'
import { BlueSubmitButton, BluePrimaryButton, SlideMotionDiv } from '@ledget/ui'
import { withSmallModal } from '@ledget/ui'
import { withReAuth } from '@utils/index'
import { useFlow } from '@ledget/ory'
import { DownloadIcon, CopyIcon } from '@ledget/media'
import { useCompleteSettingsFlowMutation, useLazyGetSettingsFlowQuery } from '@features/orySlice'

export const GenerateViewRecoveryCodes = (props: { onFinish: () => void }) => {
    const [searchParams] = useSearchParams()
    const [recoveryCodes, setRecoveryCodes] = useState([])
    const location = useLocation()

    const [confirmSecrets, { isError: secretsSavedError }
    ] = useCompleteSettingsFlowMutation()
    const [getSecrets, {
        // either generate or retrieve
        data: recoveryCodesFlow,
        error: codesFetchError,
        isSuccess: codesAreFetched,
        isError: isCodesFetchError,
        isLoading: isFetchingSecrets,
    }] = useCompleteSettingsFlowMutation()

    const { flow, fetchFlow, flowStatus } = useFlow(
        useLazyGetSettingsFlowQuery,
        useCompleteSettingsFlowMutation,
        'settings'
    )
    const { isGetFlowSuccess, isGettingFlow, errId } = flowStatus

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
        const csrf_token = (recoveryCodesFlow as any).ui.nodes.find((node: any) =>
            node.attributes.name === 'csrf_token'
        ).attributes.value

        confirmSecrets({
            params: { flow: searchParams.get('flow') },
            data: {
                csrf_token: csrf_token,
                method: 'lookup_secret',
                lookup_secret_confirm: true,
            }
        })
    }

    // Get initial flow (will be getting from from search params
    // if on the authenticator setup modal)
    useEffect(() => { fetchFlow() }, [])

    // Get current recovery codes after flow is fetched
    useEffect(() => {
        if (isGetFlowSuccess) {
            getSecrets({
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
    }, [isGetFlowSuccess])

    // Extract recovery codes from flow
    // and save the codes if we're in the autenticator setup
    useEffect(() => {
        if (codesAreFetched) {
            (recoveryCodesFlow as any).ui.nodes.find((node: any) => {
                if (node.attributes.id === 'lookup_secret_codes') {
                    setRecoveryCodes(node.attributes.text.text.split(','))
                    return true
                }
            })
        }
    }, [codesAreFetched])

    // Close on any errors fetching flow or codes
    useEffect(() => {
        if (secretsSavedError || isCodesFetchError) {
            // props.onFinish()
        }
    }, [secretsSavedError, isCodesFetchError])

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
                    loading={isGettingFlow || isFetchingSecrets}
                    className="recovery-codes-button"
                    onClick={(e) => {
                        handleDownload()
                        confirmedSavedCodes()
                    }}
                >
                    Download
                    <DownloadIcon stroke={'currentColor'} />
                </BlueSubmitButton>
                <BlueSubmitButton
                    type="button"
                    loading={isGettingFlow || isFetchingSecrets}
                    className="recovery-codes-button"
                    onClick={() => {
                        handleCopy()
                        confirmedSavedCodes()
                    }}
                >
                    Copy
                    <CopyIcon fill={'currentColor'} />
                </BlueSubmitButton>
            </div>
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
            onClose={() => navigate('/profile/security')}
            hasExit={searchParams.get('lookup_secret_regenerate') ? false : true}
            overLayExit={searchParams.get('lookup_secret_regenerate') ? false : true}
        />
    )
}

export default RecoveryCodesModal
