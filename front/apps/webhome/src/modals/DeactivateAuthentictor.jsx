import React, { useEffect, useRef } from 'react'

import { useNavigate, useSearchParams } from 'react-router-dom'

import './styles/DeactivateAuthenticator.css'
import { useUpdateUserMutation } from '@features/userSlice'
import { useCompleteSettingsFlowMutation, useLazyGetSettingsFlowQuery } from '@features/orySlice'
import { withSmallModal } from '@ledget/ui'
import { BlueSubmitButton, SecondaryButton, FormError } from '@ledget/ui'
import { withReAuth } from '@utils'
import { useFlow } from '@ledget/ory-sdk'

const DeactivateAuthenticator = (props) => {
    const [updateUser] = useUpdateUserMutation()
    const [searchParams] = useSearchParams()
    const unLinkTotpForm = useRef(null)
    const [forgetRecoveryCodes, { isSuccess: isCodesDeleted, isLoading: isDeletingCodes }] = useCompleteSettingsFlowMutation()
    const { flow, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetSettingsFlowQuery,
        useCompleteSettingsFlowMutation,
        'settings'
    )
    const {
        isGettingFlow,
        isCompleteSuccess,
        isCompletingFlow,
        errorFetchingFlow,
        isCompleteError,
        errMsg,
    } = flowStatus

    useEffect(() => { fetchFlow() }, [])

    // Close modal on success
    useEffect(() => {
        let timeout
        if (isCompleteSuccess) {
            updateUser({ data: { mfa_method: null } })
            timeout = setTimeout(() => {
                props.closeModal()
            }, 1000)
        }
        return () => clearTimeout(timeout)
    }, [isCompleteSuccess])

    // Delete recovery codes first before unlinking totp device
    const handleUnlinkSubmit = (e) => {
        e.preventDefault()
        if (isCodesDeleted) {
            forgetRecoveryCodes({
                data: {
                    csrf_token: flow?.csrf_token,
                    method: 'lookup_secret',
                    lookup_secret_disable: true,
                },
                params: { flow: searchParams.get('flow') }
            })
        } else {
            submit(e)
        }
    }

    // Unlink totp on codes deleted
    useEffect(() => {
        isCodesDeleted && unLinkTotpForm.current.submit()
    }, [isCodesDeleted])

    return (
        <>
            <form onSubmit={handleUnlinkSubmit} ref={unLinkTotpForm}>
                <fieldset disabled={isGettingFlow} id="deactivate-authenticator--content">
                    <div>
                        <h3>Remove Your Authenticator?</h3>
                        You will no longer be able to use your authenticator app to log in.
                        <FormError msg={errMsg} />
                        {!errMsg && (isCompleteError || errorFetchingFlow) &&
                            <FormError msg={"Something went wrong, please try again later."} />}
                        <div>
                            <SecondaryButton onClick={() => props.closeModal()}>
                                Cancel
                            </SecondaryButton>
                            <BlueSubmitButton
                                name="method"
                                value="totp"
                                success={isCompleteSuccess}
                                submitting={isCompletingFlow || isDeletingCodes}
                            >
                                Yes
                            </BlueSubmitButton>
                        </div>
                    </div>
                    <input type="hidden" name="totp_unlink" value="true" />
                    <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
                </fieldset>
            </form>
        </>
    )
}

const EnrichedModal = withReAuth(withSmallModal(DeactivateAuthenticator))

export default function () {
    const navigate = useNavigate()

    return (
        <EnrichedModal
            onClose={() => navigate('/profile/security')}
            blur={1}
        />
    )
}
