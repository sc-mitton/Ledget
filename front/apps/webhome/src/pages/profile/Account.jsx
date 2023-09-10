import React from 'react'

import { Outlet, useNavigate } from 'react-router-dom'
import { Menu } from '@headlessui/react'

import './styles/Account.css'
import { CardIcon } from '@ledget/shared-assets'
import { useGetMeQuery, useGetPaymentMethodQuery, useUpdateSubscriptionMutation } from '@features/userSlice'
import { GrnSlimButton, GreenSlimArrowSubmit, ShimmerDiv, DropAnimation } from '@ledget/shared-ui'

const Info = () => {
    const { data: user } = useGetMeQuery()

    return (
        <div id="info-container">
            <div>
                <h3 >{`${user?.name.first} ${user?.name.last}`}</h3>
            </div>
            <div>
                <span>{`${user?.email}`}</span>
            </div>
        </div>
    )
}

const ChangePlanMenu = () => {
    const [updateSubscription, { isLoading }] = useUpdateSubscriptionMutation()
    const { data: user } = useGetMeQuery()
    const navigate = useNavigate()

    const nickNameMap = {
        Year: 'Change to monthly billing',
        Month: 'Change to yearly billing'
    }

    const changeBillCycleDisabled = user.subscription.plan.current_period_end
        > Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30)

    const options = [
        {
            label: 'Cancel Subscription',
            onClick: () => navigate('/profile/details/cancel-subscription'),
            cancel_at_period_end: false
        },
        {
            label: nickNameMap[user.subscription.plan.nickname],
            onClick: () => navigate(
                '/profile/details/change-bill-cycle',
                { state: { disabled: changeBillCycleDisabled } }),
            cancel_at_period_end: false,
            disabled: changeBillCycleDisabled
        },
        {
            label: "Don't Cancel",
            onClick: () => updateSubscription({
                subId: user.subscription.id,
            }),
            cancel_at_period_end: true
        }
    ]

    const Items = () => (
        <Menu.Items static>
            {options.filter((op) => op.cancel_at_period_end === user.subscription.plan.cancel_at_period_end)
                .map((op, i) => (
                    <Menu.Item key={op.label} as={React.Fragment}>
                        {({ active }) => (
                            <button
                                className={`dropdown-item ${active && "active-dropdown-item"}`}
                                onClick={op.onClick}
                                style={{ opacity: op.disabled ? '.4' : '1' }}
                            >
                                <div>{op.label}</div>
                            </button>)}
                    </Menu.Item>
                ))}
        </Menu.Items>
    )

    return (
        <Menu>
            {({ open }) => (
                <div style={{ position: 'relative' }}>
                    <Menu.Button as={React.Fragment}>
                        <GreenSlimArrowSubmit
                            submitting={isLoading}
                            rotate={0}
                            stroke={'var(--m-text-gray'}
                        >
                            change
                        </GreenSlimArrowSubmit>
                    </Menu.Button>
                    <DropAnimation visible={open} className="dropdown" id="change-plan--menu">
                        <Items />
                    </DropAnimation>
                </div>
            )}
        </Menu>
    )
}

const Plan = () => {
    const { data: user } = useGetMeQuery()
    const nextPayment = new Date(user.subscription.plan.current_period_end * 1000)
    const nextPaymentString = nextPayment.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })

    const getStatusColor = () => {
        const statusColorMap = {
            active: 'var(--green-dark2)',
            trialing: 'var(--green-dark2)',
            paused: 'var(--yellow)',
            default: 'var(--red)'
        }
        if (user.subscription.plan.cancel_at_period_end) {
            return statusColorMap.paused
        } else {
            return statusColorMap[user.subscription.plan.status]
                || statusColorMap.default
        }
    }

    const getStatus = () => {
        if (user.subscription.plan.cancel_at_period_end) {
            return 'canceled'
        }
        if (user.subscription.plan.status === 'trialing') {
            return 'trial'
        }
        return user.subscription.plan.status?.toLowerCase()
    }

    return (
        <div className="section">
            <div>
                <div className="header2">
                    <div>
                        <h3>Plan</h3>
                        <span
                            className="indicator"
                            style={{ color: getStatusColor() }}
                        >
                            {getStatus()}
                        </span>
                    </div>
                    <div>
                        <ChangePlanMenu />
                    </div>
                </div>
                <div className="body">
                    <span>
                        {`1 ${user.subscription.plan.nickname}`}
                        {` $${user.subscription.plan.amount / 100}`}
                    </span>
                    <br />
                    {user.subscription.plan.cancel_at_period_end
                        ? <span>{`Ending on ${nextPaymentString}`}</span>
                        : <span>{`Next charge ${nextPaymentString}`}</span>
                    }
                </div>
            </div>
        </div>
    )
}

const PaymentMethod = () => {
    const { data } = useGetPaymentMethodQuery()
    const navigate = useNavigate()

    let expDate = new Date(
        data?.payment_method.exp_year,
        data?.payment_method.exp_month
    )
    expDate = expDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
    })

    return (
        <div className="section">
            <div className="header2">
                <div>
                    <h3>Payment Method</h3>
                </div>
                <div>
                    <GrnSlimButton
                        aria-label="Change plan"
                        onClick={() => navigate("/profile/details/update-payment")}
                    >
                        update
                    </GrnSlimButton>
                </div>
            </div>
            <div className="body">
                <div id="card-info-container">
                    <CardIcon />
                    <span>
                        {data?.payment_method.brand.charAt(0).toUpperCase()
                            + data?.payment_method.brand.slice(1)}
                        &nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&nbsp;
                        {data?.payment_method.last4}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        {`Expires ${expDate}`}
                    </span>
                </div>
            </div>
        </div>
    )
}

const Account = () => {
    const { isLoading } = useGetPaymentMethodQuery()
    const { data: user } = useGetMeQuery()

    return (
        <>
            <ShimmerDiv
                shimmering={isLoading}
                style={{ borderRadius: 'var(--border-radius3)' }}
            >
                <div id="account-page" className="padded-content">
                    <div className="header">
                        <h1>Account</h1>
                    </div>
                    <div id="avatar">
                        {user.name.first.charAt(0).toUpperCase() + user.name.last.charAt(0).toUpperCase()}
                    </div>
                    <Info />
                    <div>
                        <Plan />
                        <PaymentMethod />
                    </div>
                </div>
            </ShimmerDiv>
            <Outlet />
        </>
    )
}

export default Account
