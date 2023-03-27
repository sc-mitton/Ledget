import React from 'react';
import { useState } from 'react';

import { CardElement } from '@stripe/react-stripe-js';

import logo from '../../assets/images/logo.svg';
import stripelogo from '../../assets/images/stripelogo.svg';

let BillingInfo = () => {

    let StateDropdown = () => {
        const [selectedState, setSelectedState] = useState('');

        const states = [
            { name: 'Alabama', abbreviation: 'AL' },
            { name: 'Alaska', abbreviation: 'AK' },
            { name: 'Arizona', abbreviation: 'AZ' },
            { name: 'Arkansas', abbreviation: 'AR' },
            { name: 'California', abbreviation: 'CA' },
            { name: 'Colorado', abbreviation: 'CO' },
            { name: 'Connecticut', abbreviation: 'CT' },
            { name: 'Delaware', abbreviation: 'DE' },
            { name: 'Florida', abbreviation: 'FL' },
            { name: 'Georgia', abbreviation: 'GA' },
            { name: 'Hawaii', abbreviation: 'HI' },
            { name: 'Idaho', abbreviation: 'ID' },
            { name: 'Illinois', abbreviation: 'IL' },
            { name: 'Indiana', abbreviation: 'IN' },
            { name: 'Iowa', abbreviation: 'IA' },
            { name: 'Kansas', abbreviation: 'KS' },
            { name: 'Kentucky', abbreviation: 'KY' },
            { name: 'Louisiana', abbreviation: 'LA' },
            { name: 'Maine', abbreviation: 'ME' },
            { name: 'Maryland', abbreviation: 'MD' },
            { name: 'Massachusetts', abbreviation: 'MA' },
            { name: 'Michigan', abbreviation: 'MI' },
            { name: 'Minnesota', abbreviation: 'MN' },
            { name: 'Mississippi', abbreviation: 'MS' },
            { name: 'Missouri', abbreviation: 'MO' },
            { name: 'Montana', abbreviation: 'MT' },
            { name: 'Nebraska', abbreviation: 'NE' },
            { name: 'Nevada', abbreviation: 'NV' },
            { name: 'New Hampshire', abbreviation: 'NH' },
            { name: 'New Jersey', abbreviation: 'NJ' },
            { name: 'New Mexico', abbreviation: 'NM' },
            { name: 'New York', abbreviation: 'NY' },
            { name: 'North Carolina', abbreviation: 'NC' },
            { name: 'North Dakota', abbreviation: 'ND' },
            { name: 'Ohio', abbreviation: 'OH' },
            { name: 'Oklahoma', abbreviation: 'OK' },
            { name: 'Oregon', abbreviation: 'OR' },
            { name: 'Pennsylvania', abbreviation: 'PA' },
            { name: 'Rhode Island', abbreviation: 'RI' },
            { name: 'South Carolina', abbreviation: 'SC' },
            { name: 'South Dakota', abbreviation: 'SD' },
            { name: 'Tennessee', abbreviation: 'TN' },
            { name: 'Texas', abbreviation: 'TX' },
            { name: 'Utah', abbreviation: 'UT' },
            { name: 'Vermont', abbreviation: 'VT' },
            { name: 'Virginia', abbreviation: 'VA' },
            { name: 'Washington', abbreviation: 'WA' },
            { name: 'West Virginia', abbreviation: 'WV' },
            { name: 'Wisconsin', abbreviation: 'WI' },
            { name: 'Wyoming', abbreviation: 'WY' }
        ];

        const handleStateChange = (event) => {
            setSelectedState(event.target.value);
        };

        return (
            <select className="dropdown-select" name="state"
                id="state-select" value={selectedState} onChange={handleStateChange}>
                <option value="" disabled selected hidden>
                    <span classname="select-placeholder">State</span>
                </option>
                {states.map((state) => (
                    <option value={state.abbreviation}>{state.abbreviation}</option>
                ))}
            </select>
        );

    }

    return (
        <div className="billing-info-container">
            <div className='name-on-card-input-container'>
                <input
                    type="text"
                    id="name-on-card"
                    name="name-on-card"
                    placeholder="Name on Card"
                    required
                />
            </div>
            <div className="location-inputs-container">
                <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="City"
                    required
                />
                {/* <div id="state-input-container">
                    <StateDropdown />
                </div> */}
                <input
                    type="text"
                    id="zip"
                    name="zip"
                    placeholder="Zip"
                    required
                />
            </div>
        </div>
    )
}

let StripeCardElement = () => {
    let [cardFocus, setCardFocus] = useState(false)

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
        <div className={`card-container ${cardFocus ? 'focus' : ''}`}>
            <CardElement
                onBlur={() => setCardFocus(false)}
                onFocus={() => setCardFocus(true)}
                options={cardStyle}
            />
        </div>
    )
}

let OrderSummary = ({ unitAmount, firstCharge, renewalFrequency }) => {
    return (
        <div className="order-summary-container">
            <table>
                <tbody>
                    <tr>
                        <td>Plan:</td>
                        <td>{`\$${unitAmount}/mo`}</td>
                    </tr>
                    <tr>
                        <td>First Charge:</td>
                        <td>{firstCharge}</td>
                    </tr>
                    <tr>
                        <td>Renews:</td>
                        <td>{renewalFrequency}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

function PaymentForm(props) {
    let [subscription, setSubscription] = useState('')
    let [formComplete, setFormComplete] = useState(false)

    const handleSubscriptionChange = (event) => {
        setSubscription(event.target.value)
    }

    return (
        <form action="/create-checkout-session" className="checkout-form" method="post">
            <div className="inputs-container">
                <h3 id="billing-info-header">Billing Info</h3>
                <BillingInfo />
                <h3 id="card-input-header">Card</h3>
                <StripeCardElement />
            </div>
            <OrderSummary
                unitAmount={5}
                firstCharge={'4/8/23'}
                renewalFrequency={'Yearly'}
            />
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
