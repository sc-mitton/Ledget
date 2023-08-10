import React from 'react'

import './styles/Account.css'
import Card from '@assets/icons/Card'
import { useGetMeQuery, useGetPaymentMethodQuery } from '@api/apiSlice'
import Camera from '@assets/icons/Camera'

const ChangeProfilePhoto = () => {
    return (
        <button
            className="btn"
            id="change-photo"
            aria-label="Change profile photo"
        >
            <Camera />
        </button>
    )
}

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

const Plan = () => {
    const { data: user } = useGetMeQuery()
    const nextPayment = new Date(user.subscription.plan.current_period_end * 1000)
    const nextPaymentString = nextPayment.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })

    const handleClick = () => {
        console.log('change plan')
    }

    return (
        <div className="section">
            <div>
                <div className="header">
                    <div>
                        <h3>Plan</h3>
                        <span className="indicator">
                            {user.subscription.plan.status.charAt(0).toLowerCase()
                                + user.subscription.plan.status.slice(1)}
                        </span>
                    </div>
                    <div>
                        <button
                            className="btn-grn btn-slim"
                            aria-label="Change plan"
                            onClick={handleClick}
                        >
                            change
                        </button>
                    </div>
                </div>
                <div className="body">
                    <span>
                        {`1 ${user.subscription.plan.nickname}`}
                        {` $${user.subscription.plan.amount / 100}`}
                    </span>
                    <br />
                    <span>{`Next charge ${nextPaymentString}`}</span>
                </div>
            </div>
        </div>
    )
}

const PaymentMethod = () => {
    const { data: user } = useGetMeQuery()
    const { data } = useGetPaymentMethodQuery(user.id)

    let expDate = new Date(
        data.payment_method.exp_year,
        data.payment_method.exp_month
    )
    expDate = expDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
    })

    const handleClick = () => {
        console.log('change payment method')
    }

    return (
        <div className="section">
            <div className="header">
                <div>
                    <h3>Payment Method</h3>
                </div>
                <div>
                    <button
                        className="btn-grn btn-slim"
                        aria-label="Change plan"
                        onClick={handleClick}
                    >
                        update
                    </button>
                </div>
            </div>
            <div className="body">
                <div id="card-info-container">
                    <Card />
                    <span>
                        {data.payment_method.brand.charAt(0).toUpperCase()
                            + data.payment_method.brand.slice(1)}
                        &nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&nbsp;
                        {data.payment_method.last4}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        {`Expires ${expDate}`}
                    </span>
                </div>
            </div>
        </div>
    )
}

const Account = () => {

    return (
        <div id="account-page">
            <h1>Account</h1>
            <ChangeProfilePhoto />
            <Info />
            <div>
                <Plan />
                <PaymentMethod />
            </div>
        </div>
    )
}

export default Account
