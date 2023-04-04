import React, { useEffect } from 'react';
import { useState } from 'react';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { AnimatePresence, motion } from 'framer-motion';

import PaymentWindow from './Payment';
import SubscriptionWindow from './Subscriptions';
import { useLocation, useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK_TEST)

let options = {
    fonts: [{
        cssSrc: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap"
    }]
}

export default function Checkout() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const { price } = state ?? {}

    useEffect(() => {
        if (!price) {
            navigate('/plans')
        }
    }, [navigate, price])

    return (
        <Elements stripe={stripePromise} options={options}>
            <PaymentWindow price={price} />
        </Elements >
    )
}
