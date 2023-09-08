import React from 'react'

import { useNavigate } from 'react-router-dom'

import { withModal } from '@ledget/shared-utils'
import { SecondaryButton } from '@ledget/shared-ui'
import { useGetMeQuery, useCancelSubscriptionMutation } from '@features/userSlice'


export const Modal = withModal((props) => {
    const { data: user } = useGetMeQuery()

    const [cancelSubscription] = useCancelSubscriptionMutation()

    return (
        <div>
            <h2>Change Plan</h2>
            <SecondaryButton
                onClick={() => cancelSubscription()}
                style={{ padding: '0', margin: '8px 0 0 2px' }}
            >
                Cancel Subscription
            </SecondaryButton>
        </div>
    )
})

const ChangePlan = (props) => {
    const navigate = useNavigate()

    return (
        <Modal
            {...props}
            cleanUp={() => navigate(-1)}
            maxWidth={props.maxWidth || '375px'}
            minWidth={props.minWidth || '0px'}
            blur={2}
        />
    )
}

export default ChangePlan
