import React from 'react';
import { useState } from 'react';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import PaymentWindow from './Payment';
import SubscriptionWindow from './Subscription';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK_TEST)

let options = {
    fonts: [{
        cssSrc: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap"
    }]
}

export default function Checkout() {
    let [price, setPrice] = useState(null)

    return (
        <div>
            {price
                ? <Elements stripe={stripePromise} options={options}>
                    <PaymentWindow price={price} />
                </Elements >
                : <SubscriptionWindow setPrice={setPrice} />
            }
        </div>
    )
};
