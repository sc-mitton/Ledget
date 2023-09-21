import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import './styles/DeactivateAuthenticator.css'
import { useUpdateUserMutation } from '@features/userSlice'
import { useCompleteSettingsFlowMutation } from '@features/orySlice'
import { withSmallModal } from '@ledget/shared-utils'
import { GreenSubmitButton, SecondaryButton } from '@ledget/shared-ui'
import { useSettingsFlow, withReAuth } from '@utils'

const DeactivateAuthenticator = (props) => {
    const [updateUser] = useUpdateUserMutation()
    const [completeFlow, { isLoading: submittingFlow, isSuccess: completedFlow }] = useCompleteSettingsFlowMutation()
    const { flow } = useSettingsFlow()

    // Handle completing flow
    const handleClick = () => {
        completeFlow({
            data: {
                method: 'totp',
                totp_unlink: true,
                csrf_token: flow.csrf_token
            },
            params: { flow: flow.id }
        })
        updateUser({ data: { mfa_method: null } })
    }

    // Close modal on success
    useEffect(() => {
        let timeout
        if (completedFlow) {
            timeout = setTimeout(() => {
                completedFlow && props.setVisible(false)
            }, 1000)
        }
        return () => clearTimeout(timeout)
    }, [completedFlow])

    return (
        <div id="deactivate-authenticator--content">
            <div>
                <h3>Remove Your Authenticator?</h3>
                You will no longer be able to use your authenticator app to log in.
                <div>
                    <SecondaryButton onClick={() => props.setVisible(false)}>
                        Cancel
                    </SecondaryButton>
                    <GreenSubmitButton
                        success={completedFlow}
                        submitting={submittingFlow}
                        onClick={handleClick}
                    >
                        Yes
                    </GreenSubmitButton>
                </div>
            </div>
        </div>
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
