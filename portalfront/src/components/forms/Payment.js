import React from 'react';
import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { CardElement } from '@stripe/react-stripe-js';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { CustomSelect } from './Inputs';
import { states } from '../../assets/data/states';
import logo from '../../assets/images/logo.svg';
import stripelogo from '../../assets/images/stripelogo.svg';

let BillingInfo = () => {
    const { register } = useForm();

    return (
        <div className="billing-info-container" >
            <div className='name-on-card-input-container'>
                <input
                    type='text'
                    id='name-on-card'
                    name='name-on-card'
                    placeholder='Name on card'
                    {...register('name-on-card', { required: true })}
                />
            </div>
            <div className='location-inputs-container'>
                <div id='city-container'>
                    <input
                        type='text'
                        id='city'
                        name='city'
                        placeholder='City'
                        {...register('city', { required: true })}
                    />
                </div>
                <div id='state-container'>
                    <CustomSelect
                        options={states}
                        placeholder='ST'
                        unstyled={true}
                        maxMenuHeight={175}
                        {...register('state', { required: true })}
                    />
                </div>
                <div id='zip-container'>
                    <input
                        type='text'
                        id='zip'
                        name='zip'
                        placeholder='Zip'
                        {...register('city', { required: true })}
                    />
                </div>
            </div>
        </div >
    )
}

let StripeCardElement = () => {
    let [cardFocus, setCardFocus] = useState(false)

    const cardStyle = {
        style: {
            base: {
                fontFamily: "Source Sans Pro, sans-serif",
                color: '#242424',
                fontSmoothing: 'antialiased',
                fontSize: '15px',
                '::placeholder': {
                    color: cardFocus ? '#6b9bf6' : '#848484',
                },
                iconColor: cardFocus ? '#4784f6' : '#242424'
            },
            invalid: {
                fontFamily: 'Arial, sans-serif',
                color: '#fa755a',
                iconColor: '#fa755a'
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
    const getTrialEnd = () => {
        var currentDate = new Date()
        var futureDate = new Date(
            currentDate.getTime() + (14 * 24 * 60 * 60 * 1000))
        var futureDateString =
            (futureDate.getMonth() + 1)
            + '/' + futureDate.getDate()
            + '/' + ('' + futureDate.getFullYear()).slice(-2)

        return futureDateString
    }

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
                        <td>{getTrialEnd()}</td>
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
    const { handleSubmit } = useForm();

    const handleSubscriptionChange = (event) => {
        setSubscription(event.target.value)
    }

    const onSubmit = data => console.log(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="checkout-form" method="post">
            <div className="inputs-container">
                <h4 id="billing-info-header">Billing Info</h4>
                <BillingInfo />
                <h4 id="card-input-header">Card</h4>
                <StripeCardElement />
            </div>
            <OrderSummary
                unitAmount={props.unitAmount}
                renewalFrequency={props.renews}
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

function PaymentWindow({ price }) {
    return (
        <div>
            <div className='window checkout-window'>
                <div className="app-logo-subscription" >
                    <img src={logo} alt="Ledget" />
                </div>
                <PaymentForm
                    unitAmount={price.unit_amount / 100}
                    renews={price.renews}
                />
            </div>
            < PoweredBy />
        </div>
    )
};

export default PaymentWindow
