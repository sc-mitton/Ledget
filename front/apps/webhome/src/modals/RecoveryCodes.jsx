import React, { useEffect, useState } from 'react'

import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'

import './styles/RecoveryCodes.css'
import { GreenSubmitButton, BlackSubmitButton, SecondaryButton } from '@ledget/ui'
import { withSmallModal } from '@ledget/ui'
import { withReAuth } from '@utils'
import { useFlow } from '@ledget/ory-sdk'
import { DownloadIcon, CopyIcon } from '@ledget/media'
import { useCompleteSettingsFlowMutation, useLazyGetSettingsFlowQuery } from '@features/orySlice'

export const Content = (props) => {
    const [searchParams] = useSearchParams()
    const [recoveryCodes, setRecoveryCodes] = useState([])
    const location = useLocation()

    const [
        confirmSecrets,
        {
            isSuccess: secretsAreConfirmed,
            isError: secretsSavedError,
        }
    ] = useCompleteSettingsFlowMutation()
    const [
        getSecrets, // either generate or retrieve
        {
            data: recoveryCodesFlow,
            isSuccess: codesAreFetched,
            isError: codesFetchError,
            isLoading: isFetchingSecrets,
        }
    ] = useCompleteSettingsFlowMutation()

    const { flow, fetchFlow, flowStatus } = useFlow(
        useLazyGetSettingsFlowQuery,
        useCompleteSettingsFlowMutation,
        'settings'
    )
    const { isGetFlowError, isGetFlowSuccess, isGettingFlow } = flowStatus

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

    const handleSaveCodes = () => {
        const csrf_token = recoveryCodesFlow.ui.nodes.find(node =>
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
                params: { flow: searchParams.get('flow') || flow.id },
                data: {
                    csrf_token: flow.csrf_token,
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
            recoveryCodesFlow.ui.nodes.find(node => {
                if (node.attributes.id === 'lookup_secret_codes') {
                    setRecoveryCodes(node.attributes.text.text.split(','))
                    return true
                }
            })
        }
    }, [codesAreFetched])

    // Close on any errors fetching flow or codes
    useEffect(() => {
        if (secretsSavedError || codesFetchError) {
            props.closeModal()
        }
    }, [secretsSavedError, codesFetchError])

    // Close once the codes have been saved (only if not in authenticator setup)
    useEffect(() => {
        if (secretsAreConfirmed && !location.pathname.includes('authenticator-setup')) {
            props.closeModal()
        }
    }, [secretsAreConfirmed])

    return (
        <div id="recovery-codes--container">
            <h2>Recovery Codes</h2>
            {!location.pathname.includes('authenticator-setup') && searchParams.get('lookup_secret_regenerate')
                && <span>Save your new recovery codes and confirm to invalidate the old ones.</span>
            }
            {location.pathname.includes('authenticator-setup')
                && <span>Use these codes in case you lose access to your authenticator app.</span>
            }
            <div
                id="recovery-codes-save--container"
                style={{
                    ...(location.pathname.includes('authenticator-setup') ? { marginBottom: '0' } : {})
                }}
            >
                <GreenSubmitButton
                    type="button"
                    loading={isGettingFlow || isFetchingSecrets}
                    className="recovery-codes-button"
                    onClick={handleDownload}
                >
                    Download
                    <DownloadIcon stroke={'currentColor'} />
                </GreenSubmitButton>
                <GreenSubmitButton
                    type="button"
                    loading={isGettingFlow || isFetchingSecrets}
                    className="recovery-codes-button"
                    onClick={handleCopy}
                >
                    Copy
                    <CopyIcon fill={'currentColor'} />
                </GreenSubmitButton>
            </div>
            {searchParams.get('lookup_secret_regenerate') &&
                !location.pathname.includes('authenticator-setup') &&
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1em' }}>
                    <SecondaryButton
                        type="button"
                        className="recovery-codes-button"
                        onClick={() => props.closeModal()}
                    >
                        Cancel
                    </SecondaryButton>
                    < BlackSubmitButton
                        type="button"
                        onClick={handleSaveCodes}
                    >
                        Keep
                    </ BlackSubmitButton>
                </div>
            }
        </div>
    )
}

const Modal = withReAuth(withSmallModal(Content))

const RecoveryCodesModal = (props) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    return (
        <Modal
            onClose={() => navigate('/profile/security')}
            hasExit={searchParams.get('lookup_secret_regenerate') ? false : true}
            overLayExit={searchParams.get('lookup_secret_regenerate') ? false : true}
            {...props}
        />
    )
}

export default RecoveryCodesModal
