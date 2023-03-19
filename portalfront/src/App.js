import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginWindow from './components/forms/Login';
import SignUpWindow from './components/forms/SignUp';
import SubscriptionWindow from './components/forms/Subscription';
import CheckoutWindow from './components/forms/Checkout';
import PrivateRoutes from './utils/PrivateRoutes';
import "./style/gateway.css"

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';

const StripePro = loadStripe(process.env.REACT_APP_STRIPE_PK);

function App() {

    return (
        <main>
            <Router>
                <Routes>
                    <Route element={<PrivateRoutes />} >
                    </Route>
                    < Route path="/subscription" element={<SubscriptionWindow />} />
                    <Route path="/checkout" element={addStripeElements(CheckoutWindow)} />
                    <Route exact path="/login" element={<LoginWindow />} />
                    <Route path="/register" element={<SignUpWindow />} />
                </Routes>
            </Router>
        </main>
    )
}

const addStripeElements = (Component) => {
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        // Make an API request to your server to get the client secret
        axios.post('/api/subscription', { /* add any necessary parameters */ })
            .then(response => {
                setClientSecret(response.data.client_secret);
            })
            .catch(error => {
                console.error('Error getting client secret:', error);
            });
    }, []);

    const appearance = {
        theme: 'minimal',
    };

    const options = {
        clientSecret,
        appearance
    }

    return (
        <Elements stripe={StripePro} options={options}>
            <Component />
        </Elements>
    )
}

export default App;
