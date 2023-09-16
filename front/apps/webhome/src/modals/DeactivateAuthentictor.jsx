import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import './DeactivateAuthenticator.css'
import { useCompleteSettingsFlowMutation } from '@features/orySlice'
import { withSmallModal } from '@ledget/shared-utils'
import { GreenSubmitButton, SecondaryButton, TranslucentShimmerDiv } from '@ledget/shared-ui'
import { withRequireReauth, useSettingsFlow } from '@utils'

const DeactivateAuthenticator = (props) => {
    const [completeFlow, { isLoading: submittingFlow, isSuccess: completedFlow }] = useCompleteSettingsFlowMutation()
    const { flow, isLoading: loadingSettingsFlow } = useSettingsFlow

    // Handle submitting flow
    const handleSubmitClick = () => {
        const csrf_token_node = flow.ui.nodes.find(node => node.attributes.name === 'csrf_token')
        completeFlow({
            flowId: flow.id,
            data: {
                method: 'totp',
                totp_unlink: true,
                csrf_token: csrf_token_node.attributes.value
            }
        })
    }

    // Close modal on success
    useEffect(() => {
        const timeout = setTimeout(() => {
            completedFlow && props.setVisible(false)
        }, 1500)
        return () => clearTimeout(timeout)
    })

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
                        onClick={handleSubmitClick}
                    >
                        Yes
                    </GreenSubmitButton>
                </div>
            </div>
        </div>
    )
}

// Yes it's a lot of hocs, but it essentially
// just provides a settings flow to the modal
// along with a require reauth of the user
const Modal = withSmallModal(withRequireReauth(DeactivateAuthenticator))

export const DeactivateAuthentictorModal = () => {
    const navigate = useNavigate()

    return (
        <Modal
            cleanUp={() => navigate('/profile/security')}
            blur={1}
        />
    )
}

export default DeactivateAuthentictorModal
