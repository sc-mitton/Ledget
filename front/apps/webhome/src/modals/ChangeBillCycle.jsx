import React, { useEffect, useState } from 'react'

import './styles/ChangeBillCycle.css'
import { withSmallModal } from '@ledget/shared-utils'
import { useNavigate, useLocation } from 'react-router-dom'
import { GreenSubmitButton } from '@ledget/shared-ui'
import {
    useGetPricesQuery,
    useGetMeQuery,
    useCreateSubscriptionMutation,
    useCancelSubscriptionMutation
} from '@features/userSlice'

const MainModal = withSmallModal((props) => {
    const [createSubscription, { isLoading: creating, isSuccess: created }] = useCreateSubscriptionMutation()
    const [cancelSubscription, { isLoading: canceling, isSuccess: canceled }] = useCancelSubscriptionMutation()

    const { data: user } = useGetMeQuery()
    const { data: prices, isSuccess: fetchedPrices } = useGetPricesQuery()

    const [newPlan, setNewPlan] = React.useState({})
    useEffect(() => {
        if (fetchedPrices) {
            setNewPlan(
                prices.filter((p) => p.id !== user.subscription.plan.id)[0]
            )
        }
    }, [fetchedPrices])

    // Create new subscription
    const handleClick = () => {
        cancelSubscription({ subId: user.subscription.id })
    }

    // Create new subscription after canceling current subscription
    useEffect(() => {
        canceled &&
            createSubscription({
                priceId: newPlan.id,
                billingCycleAnchor: user.subscription.plan.current_period_end
            })
    }, [canceled])

    // Show checkmark for 1.5 seconds after successful update/cancel
    useEffect(() => {
        let timeout
        if (created && canceled) {
            timeout = setTimeout(() => {
                props.setVisible(false)
            }, 1500)
        }
        return () => { clearTimeout(timeout) }
    }, [created, canceled])

    return (
        <div id="change-plan">
            <div style={{ margin: '12px 0 12px 0' }}>
                <h3 className="spaced-header2">Change Your Subscription?</h3>
                <div id="new-plan--container">
                    <span>New Plan:</span>&nbsp;&nbsp;
                    <span>{`${newPlan.nickname}ly`}</span>
                </div>
                <div />
                <span>This will take effect at the end of your current billing cycle.</span>
            </div>
            <div style={{ float: 'right' }}>
                <GreenSubmitButton
                    submitting={creating || canceling}
                    success={created && canceled}
                    onClick={handleClick}
                >
                    Confirm
                </GreenSubmitButton>
            </div>
        </div >
    )
})

const DisabledModal = withSmallModal((props) => (
    <div>
        <h3>Sorry</h3>
        <div style={{ margin: '8px 0 16px 0' }}>
            You are signed up for a yearly plan. Changing your plan is
            not available until the last month of your subscription.
        </div>
        <div style={{ float: 'right' }}>
            <GreenSubmitButton onClick={() => { props.setVisible(false) }}>
                OK
            </GreenSubmitButton>
        </div>
    </div>
))

const ChangeBillCycle = (props) => {
    const navigate = useNavigate()
    const { state } = useLocation()

    return (
        state?.disabled
            ?
            <DisabledModal
                {...props}
                cleanUp={() => navigate(-1)}
                blur={1}
                hasExit={false}
            />
            :
            <MainModal
                {...props}
                cleanUp={() => navigate(-1)}
                blur={2}
            />
    )
}


export default ChangeBillCycle
