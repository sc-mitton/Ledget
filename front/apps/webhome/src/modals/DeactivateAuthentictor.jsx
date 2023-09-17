import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import './styles/DeactivateAuthenticator.css'
import { useUpdateUserMutation } from '@features/userSlice'
import { useCompleteSettingsFlowMutation } from '@features/orySlice'
import { withSmallModal } from '@ledget/shared-utils'
import { GreenSubmitButton, SecondaryButton, TranslucentShimmerDiv } from '@ledget/shared-ui'
import { useSettingsFlow, withReAuth } from '@utils'

const DeactivateAuthenticator = (props) => {
    const [updateUser] = useUpdateUserMutation()
    const [completeFlow, { isLoading: submittingFlow, isSuccess: completedFlow }] = useCompleteSettingsFlowMutation()
    const { flow, isLoading: loadingSettingsFlow } = useSettingsFlow()

    // Handle completing flow
    const handleClick = () => {
        const csrf_token_node = flow.ui.nodes.find(node => node.attributes.name === 'csrf_token')
        completeFlow({
            flowId: flow.id,
            data: {
                method: 'totp',
                totp_unlink: true,
                csrf_token: csrf_token_node.attributes.value
            }
        })
        updateUser({ data: { authenticator_enabled: false } })
    }

    // Close modal on success
    useEffect(() => {
        let timeout
        if (completedFlow) {
            timeout = setTimeout(() => {
                completedFlow && props.setVisible(false)
            }, 1500)
        }
        return () => clearTimeout(timeout)
    }, [completedFlow])

    return (
        <div id="deactivate-authenticator--content">
            {loadingSettingsFlow && <TranslucentShimmerDiv />}
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

const Modal = withReAuth(withSmallModal(DeactivateAuthenticator))

export default function () {
    const navigate = useNavigate()

    return (
        <Modal
            cleanUp={() => navigate('/profile/security')}
            blur={1}
        />
    )
}
