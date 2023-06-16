import React, { useEffect, useContext } from 'react'
import { useState, useRef } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { AnimatePresence, motion } from 'framer-motion'

import './style/Checkout.css'
import logoLight from '../../assets/images/logoLight.svg'
import logo from '../../assets/images/logo.svg'
import stripelogo from '../../assets/images/stripelogo.svg'
import alert2 from '../../assets/icons/alert2.svg'
import Star from '../../assets/icons/Star'
import ledgetapi from '../../api/axios'
import { CustomSelect } from './CustomInputs'
import { states } from '../../assets/data/states'
import { FormError, FormErrorTip } from "../widgets/Widgets"
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
        .required()
        .test('two-words', 'Missing last name', (value) => {
            if (value) {
                const words = value.trim().split(' ')
                return words.length === 2
            }
            return true
        }),
    city: string()
        .required()
        .matches(/^[a-zA-Z ]+$/, 'Invalid city'),
    state: object().required(),
    zip: string()
        .required()
        .matches(/^\d{5}(?:[-\s]\d{4})?$/, 'Invalid zip'),

})

const PriceContext = React.createContext({})
const PriceContextProvider = ({ children }) => {
    const [price, setPrice] = useState(null)

    return (
        <>
            <PriceContext.Provider value={{ price, setPrice }}>
                {children}
            </PriceContext.Provider>
        </>
    )
}

const Prices = ({ prices }) => {
    const { price, setPrice } = useContext(PriceContext)

    useEffect(() => {
        setPrice(prices[0])
    }, [prices])

    return (
        <div id="prices-container">
            <div id="prices-container-header">
                <img src={logoLight} alt="Ledget" />
            </div>
            <div id="subscription-radios-container">
                {prices.map((p, i) =>
                    <div className="subscription" key={`subscription-${i}`}>
                        <input
                            type="radio"
                            id={`price-${i}`}
                            name="price"
                            value={p.id}
                            checked={p === price}
                            onChange={() => setPrice(p)}
                            aria-checked={p === price}
                        />
                        <label
                            htmlFor={`price-${i}`}
                            tabIndex={i + 1}
                            onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && setPrice(p)}
                        >
                            {p.nickname.toLowerCase() == 'year' &&
                                <>
                                    <div className={`dog-ear ${price !== p ? 'dog-ear-deselected' : ''}`}></div>
                                    <div className="dog-ear-star"><Star /></div>
                                </>
                            }
                            <span className="nickname">{p.nickname}</span>
                            <span className="unit-amount">
                                ${
                                    p.nickname.toLowerCase() == 'year'
                                        ? p.unit_amount / 1200
                                        : p.unit_amount / 100
                                }<span> /mo</span>
                            </span>
                        </label>
                    </div>
                )}
            </div>
        </div>
    )
}

const Card = ({ onComplete, hasError }) => {
    let [cardFocus, setCardFocus] = useState(false)

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
        }
    }

    return (
        <>
            <h3>Card</h3>
            <div className={`card-container${cardFocus ? '-focused' : ''}`}>
                <CardElement
                    onBlur={() => setCardFocus(false)}
                    onFocus={() => setCardFocus(true)}
                    onChange={(e) => onComplete(e.complete)}
                    options={cardElementOptions}
                />
                {hasError && <FormErrorTip />}
            </div>
        </>
    )
}

const Form = ({ onSubmit, id }) => {
    const [paymentNotEnteredError, setPaymentNotEnteredError] = useState(false)
    const [paymentEntered, setPaymentEntered] = useState(false)

    const { register, handleSubmit, formState: { errors }, trigger, control } =
        useForm({ resolver: yupResolver(schema), mode: 'onBlur', reValidateMode: 'onBlur' })

    const submitBillingForm = (e) => {
        e.preventDefault()
        !paymentEntered && setPaymentNotEnteredError(true)
        handleSubmit(
            (data) => paymentEntered && onSubmit(data)
        )(e)
    }

    const onPaymentComplete = (complete) => {
        setPaymentEntered(complete)
        setPaymentNotEnteredError(complete)
    }

    const hasSilentError = (field) => {
        return errors[field] && errors[field]?.message.includes('required')
    }

    const hasErrorMsg = (field) => {
        return errors[field]?.message && !errors[field]?.message.includes('required')
    }

    return (
        <>
            <h3>Billing Info</h3>
            <form onSubmit={submitBillingForm} className="checkout-form" id={id}>
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
                    {hasSilentError('name') && <FormErrorTip />}
                </div>
                <div id="name-on-card-error">
                    {hasErrorMsg('name') && <FormError msg={errors.name.message} />}
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
                        {hasSilentError('city') && <FormErrorTip />}
                    </div>
                    <div id="state-container">
                        <Controller
                            control={control}
                            name='state'
                            render={({ field }) => (
                                <CustomSelect
                                    options={states}
                                    placeholder="State"
                                    maxMenuHeight={175}
                                    field={field}
                                />
                            )}
                        />
                        {hasSilentError('state') && <FormErrorTip />}
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
                        {hasSilentError('zip') && <FormErrorTip />}
                    </div>
                </div>
                {(hasErrorMsg('city') || hasErrorMsg('state') || hasErrorMsg('zip')) &&
                    <div id="location-input-errors">
                        <div id="city-error">
                            {hasErrorMsg('city') && <FormError msg={errors.city?.message} />}
                        </div>
                        <div id="state-error">
                            {hasErrorMsg('state') && <FormError msg={errors.state?.message} />}
                        </div>
                        <div id="zip-error">
                            {hasErrorMsg('zip') && <FormError msg={errors.zip?.message} />}
                        </div>
                    </div>
                }
            </form >
            <Card onComplete={onPaymentComplete} hasError={paymentNotEnteredError} />
        </>
    )

}

const OrderSummary = () => {
    const { price } = useContext(PriceContext)

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

    return (
        <>
            {price &&
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
            }
        </>
    )
}

const StripeFooter = () => {
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

function Checkout({ prices }) {
    const [errMsg, setErrMsg] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [cardErrMsg, setCardErrMsg] = useState(null)
    const stripe = useStripe()
    const elements = useElements()

    // pseudo code:
    // 1. post request to backend to create customer -> await 201 response
    // 2. post request to backend to create subscription -> which returns client secret
    // 3. confirm card payment with client secret
    // 4. configure backend webhook for stripe to listen to confirmed payment

    // const clientSecretRef = useRef(JSON.parse(sessionStorage.getItem("clientSecret")))
    // const isCustomerRef = useRef(JSON.parse(sessionStorage.getItem("user")).is_customer)
    const clientSecretRef = useRef('')
    const isCustomerRef = useRef(false)

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
        const response = await ledgetapi.post('customer', payload)

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
        const { price } = useContext(PriceContext)
        const response = await ledgetapi.post('subscription', {
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

    const SubmitButton = ({ form }) => {
        const { price } = useContext(PriceContext)
        const submitButtonRef = useRef()

        return (
            <>
                {price &&
                    <div className="subscribe-button-container">
                        <button
                            className={`valid-submit`}
                            id="subscribe-button"
                            type='submit'
                            form={form}
                            ref={submitButtonRef}
                            aria-label="Submit payment information"
                        >
                            <span>{`Start ${price.metadata?.trial_period_days}-day Free Trial`}</span>
                        </button>
                    </div>
                }
            </>
        )
    }

    return (
        <>
            <Prices prices={prices} />
            <div id="checkout-container">
                <Form id="billing-form" onSubmit={onSubmit} />
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
                <OrderSummary />
                <SubmitButton form={'billing-form'} />
            </div>
            <StripeFooter />
            <WindowLoadingBar visible={processing} />
        </>
    )
}

const AnimatedCheckout = () => {
    const { prices, error } = usePrices()

    return (
        <AnimatePresence>
            {error &&
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="window" id="checkout-window-loading-error">
                        <div className="app-logo" >
                            <img src={logo} alt="Ledget" />
                        </div>
                        <div id="message">
                            Well shoot, something went wrong.
                        </div>
                    </div>
                </motion.div>
            }
            {prices && !error &&
                <motion.div
                    className="window"
                    id="checkout-window"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Checkout prices={prices} />
                </motion.div>
            }
        </AnimatePresence>
    )
}

const CheckoutWindow = () => {
    return (
        <Elements stripe={stripePromise} options={options}>
            <PriceContextProvider>
                <AnimatedCheckout />
            </PriceContextProvider>
        </Elements>
    )
}

export default CheckoutWindow

