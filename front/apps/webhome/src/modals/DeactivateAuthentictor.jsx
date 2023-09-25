import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import './styles/DeactivateAuthenticator.css'
import { useUpdateUserMutation } from '@features/userSlice'
import { useCompleteSettingsFlowMutation, useLazyGetSettingsFlowQuery } from '@features/orySlice'
import { withSmallModal } from '@ledget/shared-utils'
import { GreenSubmitButton, SecondaryButton, FormError } from '@ledget/shared-ui'
import { withReAuth } from '@utils'
import { useFlow } from '@ledget/ory-sdk'

const DeactivateAuthenticator = (props) => {
    const [updateUser] = useUpdateUserMutation()
    const { flow, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetSettingsFlowQuery,
        useCompleteSettingsFlowMutation,
        'settings'
    )
    const {
        isFetchingFlow,
        isCompleteSuccess,
        isSubmittingFlow,
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
                props.setVisible(false)
            }, 1000)
        }
        return () => clearTimeout(timeout)
    }, [isCompleteSuccess])

    return (
        <form onSubmit={submit} >
            <fieldset disabled={isFetchingFlow} id="deactivate-authenticator--content">
                <div>
                    <h3>Remove Your Authenticator?</h3>
                    You will no longer be able to use your authenticator app to log in.
                    <FormError msg={errMsg} />
                    {!errMsg && (isCompleteError || errorFetchingFlow) &&
                        <FormError msg={"Something went wrong, please try again later."} />}
                    <div>
                        <SecondaryButton onClick={() => props.setVisible(false)}>
                            Cancel
                        </SecondaryButton>
                        <GreenSubmitButton
                            name="method"
                            value="totp"
                            success={isCompleteSuccess}
                            submitting={isSubmittingFlow}
                        >
                            Yes
                        </GreenSubmitButton>
                    </div>
                </div>
                <input type="hidden" name="totp_unlink" value="true" />
                <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
            </fieldset>
        </form>
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
