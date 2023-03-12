import React from 'react';
import LoginWindow from '../components/forms/Login';
import SignUpWindow from '../components/forms/SignUp';
import SubscriptionCheckout from '../components/forms/SubscriptionCheckout';
import logo from '../assets/images/logo.svg'
import "./gateway.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Gateway = () => {
    return (
        <div>
            <div className="app-logo">
                <img src={logo} alt="Ledget" />
            </div>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginWindow />} />
                    <Route path="/signup" element={<SignUpWindow />} />
                    <Route path="checkout" element={<SubscriptionCheckout />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Gateway
