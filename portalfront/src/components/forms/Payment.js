import React, { useEffect } from 'react'
import { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

import logo from '../../assets/images/logo.svg'
import stripelogo from '../../assets/images/stripelogo.svg'
import alert2 from '../../assets/icons/alert2.svg'
import successIcon from '../../assets/icons/successIcon.svg'
import apiAuth from '../../api/axios'
import { LoadingRing } from '../../widgets/Widgets'

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
            <div id='location-inputs-container'>
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

let Payment = (props) => {
    let [cardFocus, setCardFocus] = useState(false)

    const options = {
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
        },
        disabled: props.disabled
    }

    return (
        <div className={`card-container ${cardFocus ? 'focus' : ''}`}>
            <CardElement
                onBlur={() => setCardFocus(false)}
                onFocus={() => setCardFocus(true)}
                onChange={(e) => { e.complete && props.setPayment(true) }}
                options={options}
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
        </div >
    )
}

function PaymentForm({ price }) {
    const { register, handleSubmit, formState: { errors, isValid }, trigger, getValues } = useForm(
        {
            resolver: yupResolver(schema),
            mode: 'onBlur'
        }
    );
    let [payment, setPayment] = useState(null) // checks if the payment is entered
    const [succeeded, setSucceeded] = useState(false)
    const [errMsg, setErrMsg] = useState(null)
    const [processing, setProcessing] = useState(false)
    const navigate = useNavigate()
    let clientSecret = null
    const stripe = useStripe()
    const elements = useElements()

    const getPayload = (data) => {
        const values = getValues()
        let payload = {}
        payload['first_name'] = values.name.split(' ')[0]
        payload['last_name'] = values.name.split(' ')[1]
        payload['billing_info'] = {}
        payload['billing_info']['postal_code'] = values.zip
        payload['billing_info']['city'] = values.city.split(',')[0]
        payload['billing_info']['state'] = values.city.split(',')[1]

        return payload
    }

    const createSubscription = async () => {
        try {
            const response = await apiAuth.post('subscription', {
                'price_id': price.price_id,
            })
            clientSecret = response.data.client_secret
        } catch (error) {
            setErrMsg("Something went wrong. Please try again.")
        }
    }

    const confirmSetup = async (data) => {
        const values = getValues()
        try {
            const result = await stripe.confirmCardSetup(
                clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: {
                            name: values.name,
                            email: JSON.parse(sessionStorage.getItem("user")).email,
                            address: {
                                city: values.city.split(',')[0],
                                state: values.city.split(',')[1],
                                postal_code: values.zip
                            }
                        }
                    }
                }
            )
            if (result.setupIntent.status === 'succeeded') {
                setSucceeded(true)
            }
        } catch (error) {
            setErrMsg(result.error.message)
        }
    }

    const onSubmit = async () => {
        setProcessing(true)
        const user_id = JSON.parse(sessionStorage.getItem("user")).id

        try {
            await apiAuth.patch(`user/${user_id}`, getPayload())
            await createSubscription()
            await confirmSetup()
        } catch (error) {
            console.log(error)
            setErrMsg("Something went wrong. Please try again.")
        } finally {
            setProcessing(false)
        }
    }

    return (
        <fieldset disabled={processing || succeeded}>
            <form onSubmit={handleSubmit(onSubmit)} className="checkout-form" method="post">
                <div className="inputs-container">
                    <h4 id="billing-info-header">Billing Info</h4>
                    <BillingInfo
                        register={register}
                        trigger={trigger}
                        errors={errors}
                        disabled={processing || succeeded}
                    />
                    <h4 id="card-input-header">Card</h4>
                    <Payment setPayment={setPayment} disabled={processing || succeeded} />
                    {errMsg &&
                        <div className="server-error">
                            <img src={alert2} alt="error icon" />
                            {errMsg}
                        </div>
                    }
                </div>
                <OrderSummary
                    unitAmount={price.unit_amount / 100}
                    renewalFrequency={price.renews}
                />
                <div className="subscribe-button-container">
                    <button
                        className={`${(isValid && payment && !processing && !succeeded) ? 'valid' : 'invalid'}-submit`}
                        id="subscribe-button"
                        type='submit'
                    >
                        {processing
                            ? <LoadingRing />
                            : null
                        }
                        {!processing && !succeeded
                            ? <span>{`Start ${price.trial_period_days}-day Free Trial`}</span>
                            : null
                        }
                        {succeeded
                            ? <span id="payment-success-message">
                                <img src={successIcon} alt='success icon' className='success-icon' />
                                Success
                            </span>
                            : null
                        }
                    </button>
                </div>
            </form >
        </fieldset>
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
}

export default PaymentWindow
