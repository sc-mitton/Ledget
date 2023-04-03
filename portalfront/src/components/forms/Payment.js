import React from 'react';
import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { CardElement } from '@stripe/react-stripe-js';

import logo from '../../assets/images/logo.svg';
import stripelogo from '../../assets/images/stripelogo.svg';
import alert2 from '../../assets/icons/alert2.svg';
import apiAuth from "../../api/axios"

const schema = object({
    name: string()
        .required('Please enter your first and last name.')
        .test('two-words', 'Enter first and last name', (value) => {
            if (value) {
                const words = value.trim().split(' ');
                return words.length === 2;
            }
            return true;
        }),
    city: string().required("Please enter your city."),
    zip: string()
        .required("Please enter your zip code.")
        .matches(/^\d{5}(?:[-\s]\d{4})?$/, 'Invalid zip'),

})

let BillingInfo = (props) => {

    const hasError = (field) => {
        return props.errors[field] ? true : false;
    }

    return (
        <>
            <div id="name-on-card-container" className='input-container'>
                <input
                    type='text'
                    id='name-on-card'
                    name='name'
                    placeholder='Name on card'
                    {...props.register('name')}
                    onBlur={(e) => {
                        if (e.target.value) {
                            props.trigger("name");
                        }
                    }}
                />
            </div>
            {hasError('name') &&
                <div className="form-error">
                    <img src={alert2} className="error-tip-icon" />
                    {props.errors.name?.message}
                </div>
            }
            <div className='location-inputs-container'>
                <div className='input-container' id='city-container'>
                    <input
                        type='text'
                        id='city'
                        name='city'
                        placeholder='City'
                        {...props.register('city')}
                        onBlur={(e) => {
                            if (e.target.value) {
                                props.trigger("city");
                            }
                        }}
                    />
                </div>
                <div className='input-container' id='zip-container'>
                    <input
                        type='text'
                        id='zip'
                        name='zip'
                        placeholder='Zip'
                        {...props.register('zip')}
                        onBlur={(e) => {
                            if (e.target.value) {
                                props.trigger("zip");
                            }
                        }}
                    />
                </div>
            </div>
            {hasError('city') || hasError('zip') &&
                <div id="location-input-errors">
                    <div id="city-error">
                        {hasError('city') &&
                            <div className="form-error">
                                <img src={alert2} className="error-tip-icon" />
                                {props.errors.city?.message}
                            </div>
                        }
                    </div>
                    <div id="zip-error">
                        {hasError('zip') &&
                            <div className="form-error">
                                <img src={alert2} className="error-tip-icon" />
                                {props.errors.zip?.message}
                            </div>
                        }
                    </div>
                </div>
            }
        </>
    )
}

let Payment = ({ setPayment }) => {
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
                fontFamily: 'Source Sans Pro, sans-serif',
                color: '#f47788',
                iconColor: '#f47788'
            }
        }
    }

    return (
        <div className={`card-container ${cardFocus ? 'focus' : ''}`}>
            <CardElement
                onBlur={() => setCardFocus(false)}
                onFocus={() => setCardFocus(true)}
                onChange={(e) => { e.complete && setPayment(true) }}
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
    const { register, handleSubmit, formState: { errors, isValid }, trigger } = useForm(
        {
            resolver: yupResolver(schema),
            mode: 'onBlur'
        }
    );
    let [payment, setPayment] = useState(null)
    const [succeeded, setSucceeded] = useState(false)
    const [error, setError] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [clientSecret, setClientSecret] = useState('')

    const formatData = (data) => {
        data['state'] = data['city'].split(',')[1].trim()
        data['city'] = data['city'].split(',')[0].trim()
        return data
    }

    const onSubmit = data => {
        formatData(data)
        setProcessing(true)
        apiAuth.patch('user/update/', { "billing_info": data })
            .then(
                createSubscription()
            ).then(
                confirmPayment()
            ).catch(
                setError('Something went wrong. Please try again.')
            )
    }

    const createSubscription = async () => {
        apiAuth.post('subscription/create/')
            .then(
                (response) => {
                    setClientSecret(response.data.client_secret)
                }
            ).catch(
                setError('Something went wrong. Please try again.')
            )
    }

    const confirmPayment = async () => {
        stripe.confirmCardPayment(
            clientSecret,
            { payment_method: { card: elements.getElement(CardElement) } }
        ).then((result) => {
            if (result.error) {
                setError(`Payment failed ${result.error.message}`)
            } else {
                setError(null)
                setSucceeded(true)
            }
        }).finally(
            setProcessing(false)
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="checkout-form" method="post">
            <div className="inputs-container">
                <h4 id="billing-info-header">Billing Info</h4>
                <BillingInfo register={register} trigger={trigger} errors={errors} />
                <h4 id="card-input-header">Card</h4>
                <Payment setPayment={setPayment} />
            </div>
            <OrderSummary
                unitAmount={props.price.unit_amount / 100}
                renewalFrequency={props.price.renews}
            />
            <div className="subscribe-button-container">
                <input
                    className={`${(isValid && payment) ? 'valid' : 'invalid'}-submit`}
                    type="submit"
                    value={`Start ${props.price.trial_period_days}-day Free Trial`}
                    id="subscribe-button"
                />
            </div>
        </form >
    )
}

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
        <div className='window checkout-window'>
            <div className="app-logo-subscription" >
                <img src={logo} alt="Ledget" />
            </div>
            <PaymentForm
                price={price}
            />
            < PoweredBy />
        </div>
    )
};

export default PaymentWindow
