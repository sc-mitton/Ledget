import React, { useEffect } from 'react';

import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Routes, Route } from 'react-router-dom';

import PaymentWindow from './Payment';

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

    let CheckoutRoot = () => {
        return (
            <Elements stripe={stripePromise} options={options}>
                <PaymentWindow price={price} />
            </Elements >
        )
    }

    let PrivateRoute = () => {
        return (
            price ? <Outlet /> : <Navigate to="/plans" />
        )
    }

    return (
        <Routes>
            <Route path='*' element={<PrivateRoute />} >
                <Route path='' element={<CheckoutRoot />} />
            </Route>
        </Routes>
    )
}
