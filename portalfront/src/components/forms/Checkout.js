import React from 'react';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import PaymentWindow from './Payment';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK_TEST)

export default function Checkout() {

    return (
        <Elements stripe={stripePromise} >
            <PaymentWindow />
        </Elements >
    )
};

