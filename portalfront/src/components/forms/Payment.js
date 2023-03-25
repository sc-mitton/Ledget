import React from 'react';
import { useState } from 'react';
import logo from '../../assets/images/logo.svg';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const appearance = {
    theme: 'minimal',
};


function CheckoutForm() {
    let [subscription, setSubscription] = useState('')
    const stripe = useStripe();
    const elements = useElements();

    const handleSubscriptionChange = (event) => {
        setSubscription(event.target.value)
    }

    return (
        <form action="/create-checkout-session" className="checkout-form" method="post">
            <CardElement />
        </form >
    )
};

function CheckoutWindow() {
    return (
        <div className='window checkout-window'>
            <div className="app-logo-subscription" >
                <img src={logo} alt="Ledget" />
            </div>
            <div className="checkout-form-container">
                <CheckoutForm />
            </div>
        </div>
    )
};

export default CheckoutWindow
