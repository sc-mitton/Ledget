import React from 'react';
import { useState } from 'react';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import logo from '../../assets/images/logo.svg';
import stripelogo from '../../assets/images/stripelogo.svg';


function PaymentForm(props) {
    let [subscription, setSubscription] = useState('')
    let [formComplete, setFormComplete] = useState(false)
    const stripe = useStripe();
    const elements = useElements();

    const handleSubscriptionChange = (event) => {
        setSubscription(event.target.value)
    }

    const cardStyle = {
        style: {
            base: {
                fontFamily: "Source Sans 3, sans-serif",
                fontWeight: "500",
                color: "#242424",
                fontSmoothing: "antialiased",
                fontSize: "14px",
                "::placeholder": {
                    color: "#909090",
                },
            }
        }
    };

    return (
        <form action="/create-checkout-session" className="checkout-form" method="post">
            <div className="card-container">
                <h4 id="card-input-header">Card</h4>
                <CardElement options={cardStyle} />
            </div>
            <div className="order-summary-container">
                <table>
                    <tbody>
                        <tr>
                            <td>Plan:</td>
                            <td>$5/mo</td>
                        </tr>
                        <tr>
                            <td>First Charge:</td>
                            <td>4/8/23</td>
                        </tr>
                        <tr>
                            <td>Renews:</td>
                            <td>Yearly</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="subscribe-button-container">
                <input type="submit" value="Start Free Trial" id="subscribe-button" />
            </div>
        </form >
    )
};

const PoweredBy = () => {
    return (
        <div className="stripe-logo-container">
            <div>
                powered by
            </div>
            <div>
                <a href="https://stripe.com/" target="_blank" rel="noopener noreferrer">
                    <img className="stripe-logo" src={stripelogo} alt="Stripe" />
                </a>
            </div>
        </div>
    )
}


function PaymentWindow() {
    return (
        <div>
            <div className='window checkout-window'>
                <div className="app-logo-subscription" >
                    <img src={logo} alt="Ledget" />
                </div>
                <div className="checkout-form-container">
                    <PaymentForm />
                </div>
            </div>
            < PoweredBy />
        </div>
    )
};

export default PaymentWindow
