import React from 'react';
import Checkbox from './Inputs';
import { useState } from 'react';

const Subscription = (props) => {
    return (
        <div className="subscription">
            <input type="radio" id={props.id} name="plan" value={props.value}
                checked={props.checked} onChange={props.onChange} />
            <label htmlFor={props.id}>
                <div className="subscription-period">
                    {props.subscriptionTitle}
                </div>
                <div className="subscription-price">
                    {props.subscriptionPrice}<span> / month</span>
                </div>
            </label>
        </div>
    )
}

function CheckoutForm() {
    let [subscription, setSubscription] = useState('yearly')

    const handleSubscriptionChange = (event) => {
        setSubscription(event.target.value)
    }

    return (
        <form action="/create-checkout-session" className="checkout-form" method="post">
            <div className="subscription-plans">
                <Subscription id="yearly" value="yearly" subscriptionTitle="YEARLY" subscriptionPrice="$6"
                    checked={subscription === 'yearly'} onChange={handleSubscriptionChange} />
                <Subscription id="monthly" value="monthly" subscriptionTitle="MONTHLY" subscriptionPrice="$8"
                    checked={subscription === 'monthly'} onChange={handleSubscriptionChange} />
            </div>
            <div className="name-inputs">
                <input type="text" id="first_name" name="first_name" placeholder="First Name" required />
                <input type="text" id="last_name" name="last_name" placeholder="Last Name" required />
            </div>
            <Checkbox id="free-trial" text="Start 14-day free trial" />
        </form >
    )
}

function SubscriptionCheckout() {
    return (
        <div className='window checkout-window'>
            <CheckoutForm />
        </div>
    )
}

export default SubscriptionCheckout
