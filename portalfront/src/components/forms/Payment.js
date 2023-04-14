import React, { useEffect } from 'react'
import { useState, useRef } from 'react'

import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

import logo from '../../assets/images/logo.svg'
import stripelogo from '../../assets/images/stripelogo.svg'
import alert2 from '../../assets/icons/alert2.svg'
import successIcon from '../../assets/icons/successIcon.svg'
import apiAuth from '../../api/axios'
import { LoadingRing } from '../../widgets/Widgets'
import { CustomSelect } from './CustomInputs'
import { states } from '../../assets/data/states';


const schema = object({
    name: string()
        .required('Please enter your first and last name.')
        .test('two-words', 'Missing last name', (value) => {
            if (value) {
                const words = value.trim().split(' ')
                return words.length === 2
            }
            return true;
        }),
    city: string().required("Required"),
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
                                    trigger("name");
                                }
                            }}
                        />
                    </div>
                    {hasError('name') &&
                        <div className="form-error">
                            <img src={alert2} className="error-icon" />
                            {errors.name?.message}
                        </div>
                    }
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
                                        trigger("city");
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
                                        placeholder="ST"
                                        unstyled={true}
                                        maxMenuHeight={175}
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onChange={field.onChange}
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
                    {hasError('city') || hasError('zip') &&
                        <div id="location-input-errors">
                            <div id="city-error">
                                {hasError('city') &&
                                    <div className="form-error">
                                        <img src={alert2} className="error-icon" />
                                        {errors.city?.message}
                                    </div>
                                }
                            </div>
                            <div id="zip-error">
                                {hasError('zip') &&
                                    <div className="form-error">
                                        <img src={alert2} className="error-icon" />
                                        {errors.zip?.message}
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </form >
            </fieldset>
        </>
    )

}


function Form({ price }) {

    const navigate = useNavigate()
    const stripe = useStripe()
    const elements = useElements()

    let [payment, setPayment] = useState(null)
    let [inputsValid, setInputsValid] = useState(false)
    const [succeeded, setSucceeded] = useState(false)
    const [cardErrMsg, setCardErrMsg] = useState(null)
    const [errMsg, setErrMsg] = useState(null)
    const [processing, setProcessing] = useState(false)
    let [cardFocus, setCardFocus] = useState(false)

    const clientSecretRef = useRef(JSON.parse(sessionStorage.getItem("clientSecret")))
    const isCustomerRef = useRef(JSON.parse(sessionStorage.getItem("user")).is_customer)
    const submitButtonRef = useRef()

    const cardElementOptions = {
        style: {
            base: {
                fontFamily: "Source Sans Pro, sans-serif",
                color: '#242424',
                fontSmoothing: 'antialiased',
                fontSize: '15px',
                '::placeholder': {
                    color: cardFocus ? '#6b9bf6' : '#848484',
                },
                iconColor: cardFocus ? '#4784f6' : '#242424',
                ':disabled': {
                    color: '#848484',
                    iconColor: '#848484'
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
            currentDate.getTime() + (price.trial_period_days * 24 * 60 * 60 * 1000))
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
            let user = JSON.parse(sessionStorage.getItem("user"))
            user.is_customer = true
            isCustomerRef.current = true
            sessionStorage.setItem("user", JSON.stringify(user))
        } else {
            setErrMsg('Hmmm... something went wrong. Please try again.')
        }
    }

    const createSubscription = async () => {
        const response = await apiAuth.post('subscription', {
            'price_id': price.id,
            'trial_period_days': price.trial_period_days
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

    let SubmitButton = ({ form }) => {
        return (
            <div className="subscribe-button-container">
                <button
                    className={`${(inputsValid && payment && !processing && !succeeded) ? 'valid' : 'invalid'}-submit`}
                    id="subscribe-button"
                    type='submit'
                    form={form}
                    ref={submitButtonRef}
                >
                    {!processing && !succeeded &&
                        <span>{`Start ${price.trial_period_days}-day Free Trial`}</span>
                    }
                    {!processing && succeeded &&
                        <span id="payment-success-message">
                            <img src={successIcon} alt='success icon' className='success-icon' />
                            Success
                        </span>
                    }
                    {processing && !succeeded &&
                        < LoadingRing />
                    }
                </button>
            </div>
        )
    }

    return (
        <>
            <div className="inputs-container">
                <h4 id="billing-info-header">Billing Info</h4>
                <BillingForm
                    id={'billing-form'}
                    onSubmit={onSubmit}
                    disabled={succeeded || processing}
                    onValidityChange={(valid) => setInputsValid(valid)}
                />
                <h4 id="card-input-header">Card</h4>
                <div className={`card-container ${cardFocus ? 'focus' : ''}`}>
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
            <div className="order-summary-container">
                <table>
                    <tbody>
                        <tr>
                            <td>Plan:</td>
                            <td>{`\$${price.unit_amount / 100}/mo`}</td>
                        </tr>
                        <tr>
                            <td>First Charge:</td>
                            <td>{getTrialEndString()}</td>
                        </tr>
                        <tr>
                            <td>Renews:</td>
                            <td>{price.renews}</td>
                        </tr>
                    </tbody>
                </table>
            </div >
            <SubmitButton form={'billing-form'} />
        </>
    )
}

function PaymentWindow({ price }) {
    return (
        <div className='window checkout-window'>
            <div className="app-logo-subscription" >
                <img src={logo} alt="Ledget" />
            </div>
            <Form price={price} />
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

export default PaymentWindow
