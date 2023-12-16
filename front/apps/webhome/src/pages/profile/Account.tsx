import React, { useState } from 'react'

import { Outlet, useNavigate } from 'react-router-dom'
import { Menu } from '@headlessui/react'

import './styles/Account.scss'
import { CardIcon } from '@ledget/media'
import {
    useGetMeQuery,
    useGetPaymentMethodQuery,
    useUpdateSubscriptionMutation,
    useGetNextInvoiceQuery,
    useGetSubscriptionQuery,
    Subscription
} from '@features/userSlice'
import {
    BlueSlimButton,
    BlueSlimArrowButton,
    ShimmerDiv,
    DropAnimation,
    IconButton,
    DropdownItem
} from '@ledget/ui'
import { Edit } from '@ledget/media'
import { UpdatePersonalInfo } from '@modals/index'


const getStatusColor = (subscription: Subscription) => {
    const statusColorMap = {
        active: 'var(--secondary-color-alt)',
        trialing: 'var(--secondary-color-alt)',
        paused: 'var(--yellow)',
        default: 'var(--dark-red)'
    } as { [key: string]: string }

    if (subscription.cancel_at_period_end) {
        return statusColorMap.paused
    } else {
        return statusColorMap[subscription.status]
            || statusColorMap.default
    }
}

const getStatus = (subscription: Subscription) => {
    if (subscription.cancel_at_period_end) {
        return 'canceled'
    }
    if (subscription.status === 'trialing') {
        return 'trial'
    }
    return subscription.status?.toLowerCase()
}

const Info = ({ children }: { children: React.ReactNode }) => {
    const { data: user } = useGetMeQuery()

    return (
        <div id="info-container">
            <div>
                <h3 >{`${user?.name.first} ${user?.name.last}`}</h3>
            </div>
            <div>
                <span>{`${user?.email}`}</span>
            </div>
            {children}
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
            label: subscription ? nickNameMap[subscription.plan.nickname] : '',
            onClick: () => navigate('/profile/details/change-bill-cycle'),
            cancel_at_period_end: false,
        },
        {
            label: "Don't Cancel",
            onClick: () => {
                if (subscription) {
                    updateSubscription({
                        subId: subscription.id,
                        cancelAtPeriodEnd: false
                    })
                }
            },
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
            {options.filter((op) => op.cancel_at_period_end === subscription?.cancel_at_period_end)
                .map((op, i) => (
                    <Menu.Item key={op.label} as={React.Fragment}>
                        {({ active }) => (
                            <DropdownItem
                                active={active}
                                as={'button'}
                                onClick={op.onClick}
                            >
                                <div>{op.label}</div>
                            </DropdownItem>)}
                    </Menu.Item>
                ))}
        </Menu.Items>
    )

    return (
        <Menu>
            {({ open }) => (
                <>
                    <Menu.Button as={'div'}>
                        <BlueSlimArrowButton submitting={isLoading} rotate={0} >
                            change
                        </BlueSlimArrowButton>
                    </Menu.Button>
                    <div style={{ position: 'relative' }}>
                        <DropAnimation
                            visible={open}
                            className="dropdown" id="change-plan--menu"
                            placement='right'
                        >
                            <Items />
                        </DropAnimation>
                    </div>
                </>
            )}
        </Menu>
    )
}

const Plan = () => {
    const { data: subscription } = useGetSubscriptionQuery()
    const { data: nextInvoice } = useGetNextInvoiceQuery()
    const { data: user } = useGetMeQuery()
    const nextTimeStamp = nextInvoice?.next_payment_date
        ? new Date(nextInvoice.next_payment_date * 1000)
        : subscription
            ? new Date(subscription?.current_period_end * 1000)
            : new Date()
    const nextDate = nextTimeStamp.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })

    return (
        <div className="section">
            <div>
                <div className="header2">
                    <div>
                        <h3>Plan</h3>
                        <span
                            className="indicator"
                            style={{ color: subscription ? getStatusColor(subscription) : '' }}
                        >
                            {subscription ? getStatus(subscription) : ''}
                        </span>
                    </div>
                    <div>
                        <ChangePlanMenu />
                    </div>
                </div>
                <div className="inner-window">
                    <div id="invoice-details--container">
                        <div>Renews</div>
                        {subscription &&
                            <>
                                <span>{`${subscription.plan.interval}ly`}</span>
                                <div>
                                    {subscription.cancel_at_period_end ? 'Ending on' : 'Next charge'}
                                </div>
                                <div>
                                    {subscription.cancel_at_period_end
                                        ? nextDate
                                        : `$${subscription.plan.amount / 100} on ${nextDate}`}
                                </div>
                            </>
                        }
                        {(nextInvoice && nextInvoice.balance > 0) &&
                            <>
                                <div>{nextInvoice.balance > 0 && 'Account Credit'}</div>
                                <div>{nextInvoice.balance > 0 && `$${nextInvoice.balance / -100}`}</div>
                            </>}
                        <div>Member since</div>
                        <div>
                            {new Date(user?.created_on || new Date()).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PaymentMethod = () => {
    const { data } = useGetPaymentMethodQuery()
    const navigate = useNavigate()

    const expDate = data
        ? new Date(
            data?.exp_year,
            data?.exp_month)
        : new Date()

    return (
        <div className="section">
            <div className="header2">
                <div>
                    <h3>Payment Method</h3>
                </div>
                <div>
                    <BlueSlimButton
                        aria-label="Change plan"
                        onClick={() => navigate("/profile/details/update-payment")}
                    >
                        update
                    </BlueSlimButton>
                </div>
            </div>
            <div id="card-info--container" className="inner-window">
                <div>
                    <CardIcon width={'1.4em'} height={'1.4em'} />
                </div>
                <div >
                    {data && `${data.brand.charAt(0).toUpperCase()}`}
                    {data && `${data.brand.slice(1)}`}
                    &nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&nbsp;
                    {data && `${data.last4}`}
                </div>
                <div>{`Exp. ${expDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}</div>
            </div>
        </div>
    )
}

const Account = () => {
    const { isLoading: loadingPaymentMethod } = useGetPaymentMethodQuery()
    const { isLoading: loadingInvoice } = useGetNextInvoiceQuery()
    const { isLoading: loadingSubscription } = useGetSubscriptionQuery()
    const { data: user } = useGetMeQuery()
    const [editPersonalInfoModal, setEditPersonalInfoModal] = useState(false)

    return (
        <>
            <ShimmerDiv
                shimmering={loadingInvoice || loadingPaymentMethod || loadingSubscription}
                style={{ borderRadius: 'var(--border-radius3)' }}
            >
                <div id="account-page" className="padded-content">
                    <div className="header">
                        <h2>Account</h2>
                    </div>
                    <div id="avatar">
                        {user && `${user.name.first.charAt(0).toUpperCase()} ${user.name.last.charAt(0).toUpperCase()}`}
                    </div>
                    <Info>
                        <IconButton
                            id='edit-personal-info--button'
                            onClick={() => setEditPersonalInfoModal(true)}
                            aria-label="Edit personal info"
                        >
                            <Edit size={'1rem'} />
                        </IconButton>
                    </Info>
                    <div>
                        <Plan />
                        <PaymentMethod />
                    </div>
                </div>
            </ShimmerDiv>
            {editPersonalInfoModal && (
                <UpdatePersonalInfo
                    onClose={() =>
                        setEditPersonalInfoModal(false)
                    } />
            )}
            <Outlet />
        </>
    )
}

export default Account
