import React from 'react'

import { Outlet, useNavigate } from 'react-router-dom'
import { Menu } from '@headlessui/react'

import './styles/Account.css'
import { CardIcon } from '@ledget/shared-assets'
import {
    useGetMeQuery,
    useGetPaymentMethodQuery,
    useUpdateSubscriptionMutation,
    useGetNextInvoiceQuery,
    useGetSubscriptionQuery
} from '@features/userSlice'
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
    const { data: subscription } = useGetSubscriptionQuery()
    const navigate = useNavigate()

    const nickNameMap = {
        Year: 'Change to monthly billing',
        Month: 'Change to yearly billing'
    }

    const options = [
        {
            label: nickNameMap[subscription.plan.nickname],
            onClick: () => navigate('/profile/details/change-bill-cycle'),
            cancel_at_period_end: false,
        },
        {
            label: "Don't Cancel",
            onClick: () => updateSubscription({
                subId: subscription.id,
                cancelAtPeriodEnd: false
            }),
            cancel_at_period_end: true
        },
        {
            label: 'Cancel Subscription',
            onClick: () => navigate('/profile/details/cancel-subscription'),
            cancel_at_period_end: false
        }
    ]

    const Items = () => (
        <Menu.Items static>
            {options.filter((op) => op.cancel_at_period_end === subscription.cancel_at_period_end)
                .map((op, i) => (
                    <Menu.Item key={op.label} as={React.Fragment}>
                        {({ active }) => (
                            <button
                                className={`dropdown-item ${active && "active-dropdown-item"}`}
                                onClick={op.onClick}
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
                    <Menu.Button
                        as={GreenSlimArrowSubmit}
                        submitting={isLoading}
                        rotate={0}
                    >
                        change
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
    const { data: subscription } = useGetSubscriptionQuery()
    const { data: nextInvoice } = useGetNextInvoiceQuery()
    const nextTimeStamp = nextInvoice.next_payment_date
        ? new Date(nextInvoice.next_payment_date * 1000)
        : new Date(subscription.plan.current_period_end * 1000)
    const nextDate = nextTimeStamp.toLocaleDateString('en-US', {
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
        if (subscription.cancel_at_period_end) {
            return statusColorMap.paused
        } else {
            return statusColorMap[subscription.status]
                || statusColorMap.default
        }
    }

    const getStatus = () => {
        if (subscription.cancel_at_period_end) {
            return 'canceled'
        }
        if (subscription.status === 'trialing') {
            return 'trial'
        }
        return subscription.status?.toLowerCase()
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
                <div className="inner-window">
                    <div id="invoice-details--container">
                        <div>
                            <span>Renews:</span>
                            <span>{`${subscription.plan.interval}ly`}</span>
                        </div>
                        <div>
                            <span>
                                {subscription.cancel_at_period_end ? 'Ending on:' : 'Next charge:'}
                            </span>
                            <span>
                                {subscription.cancel_at_period_end
                                    ? nextDate
                                    : `$${subscription.plan.amount / 100} on ${nextDate}`}
                            </span>
                        </div>
                        <div>{nextInvoice.balance > 0 && 'Account Credit'}</div>
                        <div>{nextInvoice.balance > 0 && `$${nextInvoice.balance / -100}`}</div>
                    </div>
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
            <div id="card-info--container" className="inner-window">
                <div>
                    <CardIcon width={'1.4em'} height={'1.4em'} />
                </div>
                <div >
                    {data?.payment_method.brand.charAt(0).toUpperCase()
                        + data?.payment_method.brand.slice(1)}
                    &nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&nbsp;
                    {data?.payment_method.last4}
                </div>
                <div>{`Exp. ${expDate}`}</div>
            </div>
        </div>
    )
}

const Account = () => {
    const { isLoading: loadingPaymentMethod } = useGetPaymentMethodQuery()
    const { isLoading: loadingInvoice } = useGetNextInvoiceQuery()
    const { data: user } = useGetMeQuery()

    return (
        <>
            <ShimmerDiv
                shimmering={loadingInvoice || loadingPaymentMethod}
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
