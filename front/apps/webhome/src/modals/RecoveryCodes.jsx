import React, { useEffect, useState } from 'react'

import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'

import './styles/RecoveryCodes.css'
import { GreenSubmitButton, GreenSubmitWithArrow, SecondaryButton } from '@ledget/shared-ui'
import { withSmallModal } from '@ledget/shared-utils'
import { withReAuth } from '@utils'
import { useFlow } from '@ledget/ory-sdk'
import { DownloadIcon, CopyIcon } from '@ledget/shared-assets'
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
            data: secretsFlow,
            isSuccess: secretsAreFetched,
            isError: secretsFetchError,
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
        element.download = 'recovery-codes.txt'
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
                params: { flow: searchParams.get('flow') },
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
        if (secretsAreFetched) {
            secretsFlow.ui.nodes.find(node => {
                if (node.attributes.id === 'lookup_secret_codes') {
                    setRecoveryCodes(node.attributes.text.text.split(','))
                    return true
                }
            })
        }
        if (secretsAreFetched && location.pathname.includes('authenticator-setup')) {
            handleSaveCodes()
        }
    }, [secretsAreFetched])

    // Close on any errors fetching flow or codes
    useEffect(() => {
        if (secretsSavedError || secretsFetchError) {
            console.log('secretsSavedError', secretsSavedError)
            console.log('secretsFetchError', secretsFetchError)
            // props.setVisible(false)
        }
    }, [secretsSavedError, secretsFetchError])

    // Close once the codes have been saved (only if not in authenticator setup)
    useEffect(() => {
        if (secretsAreConfirmed && !location.pathname.includes('authenticator-setup')) {
            props.setVisible(false)
        }
    }, [secretsAreConfirmed])

    return (
        <div id="recovery-codes--container">
            <h2>Recovery Codes</h2>
            <span>
                Use these codes in case you lose access to your authenticator app.
            </span>
            <div
                style={{
                    ...(location.pathname.includes('authenticator-setup') ? { marginBottom: '0' } : {})
                }}
            >
                <GreenSubmitButton
                    loading={isGettingFlow || isCompletingFlow}
                    className="recovery-codes-button"
                    onClick={handleDownload}
                >
                    Download
                    <DownloadIcon stroke={'var(--green-dark3)'} />
                </GreenSubmitButton>
                <GreenSubmitButton
                    loading={isGettingFlow || isCompletingFlow}
                    className="recovery-codes-button"
                    onClick={handleCopy}
                >
                    Copy
                    <CopyIcon fill={'var(--green-dark3)'} />
                </GreenSubmitButton>
            </div>
            {searchParams.get('lookup_secret_regenerate') &&
                !location.pathname.includes('authenticator-setup') &&
                <div>
                    <SecondaryButton
                        className="recovery-codes-button"
                        onClick={() => props.setVisible(false)}
                    >
                        Cancel
                    </SecondaryButton>
                    <GreenSubmitWithArrow
                        onClick={handleSaveCodes}
                    >
                        Save Codes
                    </GreenSubmitWithArrow>
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
