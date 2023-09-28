import React, { useEffect, useState } from 'react'

import './styles/ChangeBillCycle.css'
import { withSmallModal } from '@ledget/shared-utils'
import { useNavigate } from 'react-router-dom'
import { GreenSubmitButton, LoadingRing } from '@ledget/shared-ui'
import {
    useGetPricesQuery,
    useGetMeQuery,
    useUpdateSubscriptionItemsMutation
} from '@features/userSlice'

const Modal = withSmallModal((props) => {
    const [updateSubscriptionItems, { isLoading: updating, isSuccess: updated }] = useUpdateSubscriptionItemsMutation()
    const { data: user } = useGetMeQuery()
    const { data: prices, isSuccess: fetchedPrices } = useGetPricesQuery()
    const [newPlan, setNewPlan] = useState(null)

    useEffect(() => {
        if (fetchedPrices) {
            const newPlan = prices.find(
                price => price.nickname !== user.subscription.plan.nickname
            )
            setNewPlan(newPlan || prices[0])
        }
    }, [fetchedPrices])

    // Update subscription
    const handleClick = () => {
        updateSubscriptionItems({ priceId: newPlan.id })
    }

    // Show checkmark for 1.5 seconds after successful update/cancel
    useEffect(() => {
        let timeout
        if (updated) {
            timeout = setTimeout(() => {
                props.closeModal()
            }, 1200)
        }
        return () => { clearTimeout(timeout) }
    }, [updated])

    return (
        <div id="change-plan">
            <div style={{ margin: '12px 0 16px 0' }}>
                <h3 className="spaced-header2">Change Your Subscription?</h3>
                <div id="new-plan--container">
                    <span>New Plan:</span>&nbsp;&nbsp;
                    {newPlan
                        ? <span>{`$${newPlan.unit_amount / 100}/${newPlan.interval}`}</span>
                        : <div><LoadingRing color='dark' visible={true} /></div>
                    }
                </div>
                <div />
                <span>
                    This will take effect immediately.
                    {user.subscription.plan.nickname === 'Year' &&
                        ' The amount left in your subscription will be prorated and applied to your new plan.'
                    }
                </span>
            </div>
            <div style={{ float: 'right' }}>
                <GreenSubmitButton
                    submitting={updating}
                    success={updated}
                    onClick={handleClick}
                >
                    Confirm
                </GreenSubmitButton>
            </div>
        </div >
    )
})

const ChangeBillCycle = (props) => {
    const navigate = useNavigate()

    return (
        <Modal
            {...props}
            onClose={() => navigate(-1)}
            blur={2}
        />
    )
}


export default ChangeBillCycle
