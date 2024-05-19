import React, { useState } from 'react'

import { Outlet, useNavigate } from 'react-router-dom'
import { Menu } from '@headlessui/react'
import { Edit2 } from '@geist-ui/icons'

import './styles/Account.scss'
import {
    useGetMeQuery,
    useGetCoOwnerQuery,
    useGetPaymentMethodQuery,
    useUpdateRestartSubscriptionMutation,
    useGetNextInvoiceQuery,
    useGetSubscriptionQuery,
    Subscription
} from '@features/userSlice'
import {
    BlueSlimButton,
    BlueSlimSubmitButton,
    ShimmerDiv,
    DropDownDiv,
    IconButton,
    DropdownItem,
    BakedSwitch,
    useColorScheme,
    CircleIconButton,
} from '@ledget/ui'
import { ConfirmRemoveCoOwner } from '@modals/index'
import { UpdatePersonalInfo, AddUserModal } from '@modals/index'
import { CreditCard, UserPlus } from '@geist-ui/icons'


const getStatusColor = (subscription: Subscription) => {
    const statusColorMap = {
        active: 'var(--yearly-color-alt)',
        trialing: 'var(--yearly-color-alt)',
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

const Info = () => {
    const { data: user } = useGetMeQuery()
    const [editPersonalInfoModal, setEditPersonalInfoModal] = useState(false)

    return (
        <>
            <div id="info-container">
                <div>
                    <h3 >{`${user?.name.first} ${user?.name.last}`}</h3>
                </div>
                <div>
                    <span>{`${user?.email}`}</span>
                </div>
                <IconButton
                    id='edit-personal-info--button'
                    onClick={() => setEditPersonalInfoModal(true)}
                    aria-label="Edit personal info"
                >
                    <Edit2 className='icon' />
                </IconButton>
            </div>
            {editPersonalInfoModal && (
                <UpdatePersonalInfo onClose={() => setEditPersonalInfoModal(false)} />
            )}
        </>
    )
}

const ChangePlanMenu = () => {
    const [updateSubscription, { isLoading }] = useUpdateRestartSubscriptionMutation()
    const { data: subscription } = useGetSubscriptionQuery()
    const { data: user } = useGetMeQuery()
    const navigate = useNavigate()

    const nickNameMap = {
        Year: 'Change to monthly billing',
        Month: 'Change to yearly billing'
    }

    const options = [
        {
            label: subscription ? nickNameMap[subscription.plan.nickname] : '',
            onClick: () => navigate('/settings/profile/change-bill-cycle'),
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
            onClick: () => navigate('/settings/profile/cancel-subscription'),
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
                        <BlueSlimSubmitButton submitting={isLoading} rotate={0} disabled={!user?.is_account_owner}>
                            change
                        </BlueSlimSubmitButton>
                    </Menu.Button>
                    <div style={{ position: 'relative' }}>
                        <DropDownDiv
                            visible={open}
                            id="change-plan--menu"
                            placement='right'
                        >
                            <Items />
                        </DropDownDiv>
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
        <section className="section">
            <div className="header2">
                <div>
                    <h4>Plan</h4>
                    <span
                        className="indicator"
                        style={{ color: subscription ? getStatusColor(subscription) : '' }}
                    >
                        {subscription ? getStatus(subscription) : ''}
                    </span>
                </div>
            </div>
            <div className="inner-window" id="invoice-details--container">
                <div>
                    <div>Renews</div>
                    {subscription &&
                        <>
                            <div>{`${subscription.plan.interval}ly`}</div>
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
                <div>
                    <ChangePlanMenu />
                </div>
            </div>
        </section>
    )
}

const PaymentMethod = () => {
    const { data } = useGetPaymentMethodQuery()
    const { data: user } = useGetMeQuery()
    const navigate = useNavigate()

    const expDate = data
        ? new Date(
            data?.exp_year,
            data?.exp_month)
        : new Date()

    return (
        <section className="section">
            <div className="header2">
                <div>
                    <h4>Payment Method</h4>
                </div>
            </div>
            <div id="card-info--container" className="inner-window">
                <div>
                    <CreditCard className='icon' />
                    <div >
                        {data && `${data.brand.charAt(0).toUpperCase()}`}
                        {data && `${data.brand.slice(1)}`}
                        &nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&nbsp;
                        {data && `${data.last4}`}
                    </div>
                    <div>{`Exp. ${expDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}</div>
                </div>
                <BlueSlimButton
                    aria-label="Change plan"
                    onClick={() => navigate("/settings/profile/update-payment")}
                    disabled={!user?.is_account_owner}
                >
                    update
                </BlueSlimButton>
            </div>
        </section>
    )
}

const Preferences = () => {
    const { isDark, setDarkMode } = useColorScheme()

    return (
        <section className="section">
            <h4 className='header2'>Preferences</h4>
            <div className="settings-list">
                <section className='inner-window'>
                    <ul>
                        <BakedSwitch
                            as='li'
                            checked={isDark}
                            onChange={() => setDarkMode(!isDark)}
                        >
                            <span>{isDark ? 'Dark' : 'Light'} mode</span>
                        </BakedSwitch>
                    </ul>
                </section>
            </div>
        </section>
    )
}

const Household = () => {
    const [addUserModal, setAddUserModal] = useState(false)
    const { data: coOwner } = useGetCoOwnerQuery()
    const { data: user } = useGetMeQuery()
    const [removeCoOwnerModal, setRemoveCoOwnerModal] = useState(false)

    return (
        <>
            {removeCoOwnerModal && <ConfirmRemoveCoOwner onClose={() => setRemoveCoOwnerModal(false)} />}
            <section className="section">
                <h4 className='header2'>Household</h4>
                <div className="settings-list inner-window" id='household'>
                    <span>Members</span>
                    {user?.co_owner
                        ? coOwner && <span>{`${coOwner.name.first} ${coOwner.name.last}`}</span>
                        : <CircleIconButton size='medium' color='blue' id='add-user-button' onClick={() => setAddUserModal(true)}>
                            <UserPlus className='icon' />
                        </CircleIconButton>}
                    {user?.is_account_owner && coOwner &&
                        <BlueSlimButton onClick={() => setRemoveCoOwnerModal(true)}>
                            Remove
                        </BlueSlimButton>}
                </div>
            </section>
            {addUserModal && <AddUserModal onClose={() => setAddUserModal(false)} />}
        </>
    )
}

const Account = () => {
    const { isLoading: loadingPaymentMethod } = useGetPaymentMethodQuery()
    const { isLoading: loadingInvoice } = useGetNextInvoiceQuery()
    const { isLoading: loadingSubscription } = useGetSubscriptionQuery()
    const { data: user } = useGetMeQuery()

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
                    <div className="sections">
                        <Info />
                        <Household />
                        <Plan />
                        <PaymentMethod />
                        <Preferences />
                    </div>
                </div>
            </ShimmerDiv>
            <Outlet />
        </>
    )
}

export default Account
