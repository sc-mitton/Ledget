import React from 'react';
import { useState } from 'react';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { AnimatePresence, motion } from 'framer-motion';

import PaymentWindow from './Payment';
import SubscriptionWindow from './Subscriptions';
import { useLocation } from 'react-router-dom';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK_TEST)

let options = {
    fonts: [{
        cssSrc: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap"
    }]
}

export default function Checkout() {
    const { state } = useLocation()
    const { price } = state

    return (
        <Elements stripe={stripePromise} options={options}>
            <PaymentWindow price={price} />
        </Elements >
    )
}
