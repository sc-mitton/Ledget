import React, { useEffect } from 'react'
import { useState, useRef } from 'react'

import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import './style/Checkout.css'
import logoLight from '../../assets/images/logoLight.svg'
import stripelogo from '../../assets/images/stripelogo.svg'
import alert2 from '../../assets/icons/alert2.svg'
import successIcon from '../../assets/icons/successIcon.svg'
import apiAuth from '../../api/axios'
import { CustomSelect } from './CustomInputs'
import { states } from '../../assets/data/states'
import { FormError } from "../widgets/Widgets"
import usePrices from '../../api/hooks/usePrices'
import { WindowLoadingBar } from '../widgets/Widgets'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK_TEST)

let options = {
    fonts: [{
        cssSrc: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap"
    }]
}

const schema = object({
    name: string()
        .required('Required')
        .test('two-words', 'Missing last name', (value) => {
            if (value) {
                const words = value.trim().split(' ')
                return words.length === 2
            }
            return true
        }),
    city: string()
        .required("Required")
        .matches(/^[a-zA-Z ]+$/, 'Invalid city'),
    state: string().required("Required"),
    zip: string()
        .required("Required")
        .matches(/^\d{5}(?:[-\s]\d{4})?$/, 'Invalid zip'),

})

let BillingForm = ({ id, onSubmit, disabled, onValidityChange }) => {
    const { register, handleSubmit, formState: { errors, isValid }, trigger, getValues, control } =
        useForm({ resolver: yupResolver(schema), mode: 'onBlur' })

    const hasError = (field) => {
        return errors[field] ? true : false
    }

    useEffect(() => {
        onValidityChange(isValid)
    }, [isValid])

    return (
        <>
            <fieldset disabled={disabled}>
                <form onSubmit={handleSubmit(onSubmit)} className="checkout-form" id={id}>
                    <div id="name-on-card-container" className='input-container'>
                        <input
                            type='text'
                            id='name-on-card'
                            name='name'
                            placeholder='Name on card'
                            {...register('name')}
                            onBlur={(e) => {
                                if (e.target.value) {
                                    trigger("name")
                                }
                            }}
                        />
                    </div>
                    <div id="name-on-card-error">
                        {hasError('name') && <FormError msg={errors.name?.message} />}
                    </div>
                    <div id='location-inputs-container'>
                        <div className='input-container' id='city-container'>
                            <input
                                type='text'
                                id='city'
                                name='city'
                                placeholder='City'
                                {...register('city')}
                                onBlur={(e) => {
                                    if (e.target.value) {
                                        trigger("city")
                                    }
                                }}
                            />
                        </div>
                        <div id="state-container">
                            <Controller
                                control={control}
                                name='state'
                                render={({ field }) => (
                                    <CustomSelect
                                        options={states}
                                        placeholder="State"
                                        unstyled={true}
                                        maxMenuHeight={175}
                                        value={field.value}
                                        onBlur={(e) => {
                                            if (e.target.value) {
                                                trigger("state")
                                            }
                                        }}
                                        onChange={field.onChange}
                                        isDisabled={disabled}
                                    />
                                )}
                            />
                        </div>
                        <div className='input-container' id='zip-container'>
                            <input
                                type='text'
                                id='zip'
                                name='zip'
                                placeholder='Zip'
                                {...register('zip')}
                                onBlur={(e) => {
                                    if (e.target.value) {
                                        trigger("zip")
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {(hasError('city') || hasError('state') || hasError('zip')) &&
                        <div id="location-input-errors">
                            <div id="city-error">
                                {hasError('city') && <FormError msg={errors.city?.message} />}
                            </div>
                            <div id="state-error">
                                {hasError('state') && <FormError msg={errors.state?.message} />}
                            </div>
                            <div id="zip-error">
                                {hasError('zip') && <FormError msg={errors.zip?.message} />}
                            </div>
                        </div>
                    }
                </form >
            </fieldset>
        </>
    )

}

function Checkout({ price }) {

    const stripe = useStripe()
    const elements = useElements()

    let [payment, setPayment] = useState(null)
    let [inputsValid, setInputsValid] = useState(false)
    const [succeeded, setSucceeded] = useState(false)
    const [cardErrMsg, setCardErrMsg] = useState(null)
    const [errMsg, setErrMsg] = useState(null)
    const [processing, setProcessing] = useState(false)
    let [cardFocus, setCardFocus] = useState(false)

    // const clientSecretRef = useRef(JSON.parse(sessionStorage.getItem("clientSecret")))
    // const isCustomerRef = useRef(JSON.parse(sessionStorage.getItem("user")).is_customer)
    const clientSecretRef = useRef('')
    const isCustomerRef = useRef(false)

    const submitButtonRef = useRef()

    const cardElementOptions = {
        style: {
            base: {
                fontFamily: "Source Sans Pro, sans-serif",
                color: '#242424',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: cardFocus ? '#6b9bf6' : '#767676',
                },
                iconColor: cardFocus ? '#0059ff' : '#242424',
                ':disabled': {
                    color: '#767676',
                    iconColor: '#767676'
                }
            },
            invalid: {
                fontFamily: 'Source Sans Pro, sans-serif',
                color: '#f47788',
                iconColor: '#f47788'
            }
        },
        disabled: processing || succeeded,
    }

    const getTrialEndString = () => {
        var currentDate = new Date()
        var futureDate = new Date(
            currentDate.getTime() + (price.metadata?.trial_period_days * 24 * 60 * 60 * 1000))
        var futureDateString =
            (futureDate.getMonth() + 1)
            + '/' + futureDate.getDate()
            + '/' + ('' + futureDate.getFullYear()).slice(-2)

        return futureDateString
    }

    const extractCustomerData = (data) => {
        let payload = {}
        payload['first_name'] = data.name.split(' ')[0]
        payload['last_name'] = data.name.split(' ')[1]
        payload['city'] = data.city
        payload['state'] = data.state
        payload['postal_code'] = data.zip

        return payload
    }

    const createCustomer = async (payload) => {
        const response = await apiAuth.post('customer', payload)

        if (response.status === 200) {
            isCustomerRef.current = true
            let user = JSON.parse(sessionStorage.getItem("user"))
            user.is_customer = true
            sessionStorage.setItem("user", JSON.stringify(user))
        } else {
            setErrMsg('Hmmm... something went wrong. Please try again.')
        }
    }

    const createSubscription = async () => {
        const response = await apiAuth.post('subscription', {
            'price_id': price.id,
            'trial_period_days': price.metadata?.trial_period_days
        })
        if (response.status === 200) {
            sessionStorage.setItem("clientSecret", JSON.stringify(response.data.client_secret))
            clientSecretRef.current = response.data.client_secret
        } else {
            setErrMsg('Hmm... something went wrong. Please try again.')
        }
    }

    const confirmSetup = async (data) => {
        const result = await stripe.confirmCardSetup(
            clientSecretRef.current,
            {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: data.name,
                        email: JSON.parse(sessionStorage.getItem("user")).email,
                        address: {
                            city: data.city.split(',')[0],
                            state: data.city.split(',')[1],
                            postal_code: data.zip,
                            country: data.country
                        }
                    }
                }
            }
        )
        if (result.setupIntent?.status === 'succeeded') {
            setSucceeded(true)
        } else if (result.error) {
            setCardErrMsg(result.error?.message)
        }
    }

    const onSubmit = async (data) => {
        setProcessing(true)
        try {
            if (!isCustomerRef.current) {
                await createCustomer(extractCustomerData(data))
            }
            if (!clientSecretRef.current) {
                await createSubscription()
            }
            if (isCustomerRef.current && clientSecretRef.current) {
                await confirmSetup(data)
            }
        } catch (err) {
            if (!cardErrMsg) {
                setErrMsg('Hmm... something went wrong. Please try again later.')
            }
        } finally {
            setProcessing(false)
        }
    }

    let OrdeSummary = () => {
        return (
            <div className="order-summary-container">
                <table>
                    <tbody>
                        <tr>
                            <td>Amount:</td>
                            <td>{`\$${price.unit_amount / 100}`}</td>
                        </tr>
                        <tr>
                            <td>First Charge:</td>
                            <td>{getTrialEndString()}</td>
                        </tr>
                        <tr>
                            <td>Renews:</td>
                            <td>{price.metadata?.renews}</td>
                        </tr>
                    </tbody>
                </table>
            </div >
        )
    }

    return (
        <div id="checkout-container">
            <div className="inputs-container">
                <h3 id="billing-info-header">Billing Info</h3>
                <BillingForm
                    id={'billing-form'}
                    onSubmit={onSubmit}
                    disabled={succeeded || processing}
                    onValidityChange={(valid) => setInputsValid(valid)}
                />
                <h3 id="card-input-header">Card</h3>
                <div className={`card-container${cardFocus ? '-focus' : ''}`}>
                    <CardElement
                        onBlur={() => setCardFocus(false)}
                        onFocus={() => setCardFocus(true)}
                        onChange={(e) => { e.complete && setPayment(true) }}
                        options={cardElementOptions}
                    />
                </div>
                {cardErrMsg &&
                    <div className="form-error" id="payment-error">
                        <img src={alert2} alt="error icon" />
                        {errMsg}
                    </div>
                }
                {errMsg &&
                    <div className="general-error" >
                        <img src={alert2} alt="error icon" />
                        {errMsg}
                    </div>
                }
            </div>
            <OrdeSummary />
            <div className="subscribe-button-container">
                <button
                    className={`${(inputsValid && payment && !processing && !succeeded) ? 'valid' : 'invalid'}-submit`}
                    id="subscribe-button"
                    type='submit'
                    form='billing-form'
                    ref={submitButtonRef}
                    aria-label="Submit payment information"
                >
                    {!succeeded
                        ? <span>{`Start ${price.metadata?.trial_period_days}-day Free Trial`}</span>
                        : (<span id="payment-success-message">
                            <img src={successIcon} alt='success icon' className='success-icon' />
                            Success
                        </span>)
                    }
                </button>
            </div>
        </div>
    )
}

function CheckoutWindow() {
    const { prices, loading, error } = usePrices()
    const [price, setPrice] = useState({})

    useEffect(() => {
        setPrice(prices[0])
    }, [prices])

    const Prices = () => {

        return (
            <div id="prices-container">
                <div id="corner-logo">
                    <img src={logoLight} alt="Ledget" />
                </div>
                <div id="subscription-radios-container">
                    {prices.map((p, i) =>
                        <div className="subscription">
                            <input
                                type="radio"
                                id={`price-${i}`}
                                name="price"
                                value={p.id}
                                checked={p === price}
                                onChange={() => setPrice(p)}
                            />
                            <label htmlFor={`price-${i}`} tabIndex={i}>
                                <span className="price-nickname">{p.nickname}</span>
                                <span className="unit-amount">
                                    ${
                                        p.nickname.toLowerCase() == 'year'
                                            ? p.unit_amount / 1200
                                            : p.unit_amount / 100
                                    }<span> / mo</span>
                                </span>
                            </label>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className='window' id='checkout-window'>
            <Prices />
            <Elements stripe={stripePromise} options={options}>
                {price && <Checkout price={price} />}
            </Elements>
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
        </div>
    )
}


export default CheckoutWindow

