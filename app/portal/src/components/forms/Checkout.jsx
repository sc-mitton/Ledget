import React, { useEffect, useContext, useLayoutEffect } from 'react'
import { useState, useRef } from 'react'

import { useForm, Controller, set } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { AnimatePresence, motion } from 'framer-motion'

import './style/Checkout.css'
import logoLight from '../../assets/images/logoLight.svg'
import stripelogo from '../../assets/images/stripelogo.svg'
import alert2 from '../../assets/icons/alert2.svg'
import Star from '../../assets/icons/Star'
import ledgetapi from '../../api/axios'
import CustomSelect from './inputs/CustomSelect'
import { states } from '../../assets/data/states'
import { FormError, FormErrorTip } from "../pieces"
import usePrices from '../../api/hooks/usePrices'
import { WindowLoadingBar } from '../pieces'
import UserContext from '../../context/UserContext'
import { components } from 'react-select'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_TEST)

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

    useLayoutEffect(() => {
        setPrice(prices[0])
    }, [prices])

    return (
        <div id="prices-container">
            <div id="prices-container-header">
                <img src={logoLight} alt="Ledget" />
            </div>
            <div id="subscription-radios-container">
                {prices.map((p, i) =>
                    <div
                        className={`subscription${p === price ? '-selected' : ''}`}
                        key={`subscription-${i}`}
                    >
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
                                    <div className="dog-ear"></div>
                                    <div className="dog-ear-star">
                                        <Star fill={'var(--green-highlight)'} />
                                    </div>
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

const Card = ({ cardNotEnteredError, setCardNotEnteredError, setCardEntered }) => {
    let [cardFocus, setCardFocus] = useState(false)

    const cardElementOptions = {
        style: {
            base: {
                fontFamily: "Source Sans Pro, sans-serif",
                color: '#242424',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: cardFocus ? '#60d39c' : '#767676',
                },
                iconColor: cardFocus ? '#009b53' : '#242424',
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
            <h4>Card</h4>
            <div className={`card-container${cardFocus ? '-focused' : ''}`}>
                <CardElement
                    onBlur={() => setCardFocus(false)}
                    onFocus={() => setCardFocus(true)}
                    onChange={(e) => {
                        if (e.complete) {
                            setCardEntered(true)
                            setCardNotEnteredError(false)
                        } else {
                            setCardEntered(false)
                        }
                    }}
                    options={cardElementOptions}
                />
                {cardNotEnteredError && <FormErrorTip />}
            </div>
        </>
    )
}

const Form = ({ onSubmit, id }) => {
    const [cardEntered, setCardEntered] = useState(false)
    const [cardNotEnteredError, setCardNotEnteredError] = useState(false)

    const { register, handleSubmit, formState: { errors }, trigger, control } =
        useForm({ resolver: yupResolver(schema), mode: 'onSubmit', reValidateMode: 'onBlur' })

    const submitBillingForm = (e) => {
        e.preventDefault()
        !cardEntered && setCardNotEnteredError(true)
        handleSubmit(
            (data) => cardEntered && onSubmit(data)
        )(e)
    }

    const hasRequiredError = (field) => {
        return errors[field] && errors[field]?.message.includes('required')
    }

    const hasErrorMsg = (field) => {
        return errors[field]?.message && !errors[field]?.message.includes('required')
    }

    const CustomSingleValue = ({ children, data, ...props }) => {
        return (
            <components.SingleValue {...props}>
                {data.abbreviation}
            </components.SingleValue>
        )
    }

    return (
        <>
            <h4>Billing Info</h4>
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
                    {hasRequiredError('name') && <FormErrorTip />}
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
                        {hasRequiredError('city') && <FormErrorTip />}
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
                                    components={{ SingleValue: CustomSingleValue }}
                                />
                            )}
                        />
                        {hasRequiredError('state') && <FormErrorTip />}
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
                        {hasRequiredError('zip') && <FormErrorTip />}
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
            <Card
                cardNotEnteredError={cardNotEnteredError}
                setCardNotEnteredError={setCardNotEnteredError}
                setCardEntered={setCardEntered}
            />
        </>
    )

}

const OrderSummary = () => {
    const { price } = useContext(PriceContext)

    const getDaySuffix = (day) => {
        if (day >= 11 && day <= 13) {
            return "th";
        }
        switch (day % 10) {
            case 1:
                return "st"
            case 2:
                return "nd"
            case 3:
                return "rd"
            default:
                return "th"
        }
    }

    const getTrialEndString = () => {
        const currentDate = new Date()
        const futureDate = new Date(
            currentDate.getTime() + (price.metadata?.trial_period_days * 24 * 60 * 60 * 1000)
        )

        const months = [
            "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
            "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
        ]

        const day = futureDate.getDate()
        const month = months[futureDate.getMonth()];
        const suffix = getDaySuffix(day)

        return `${month} ${day}${suffix}`
    }

    return (
        <>
            {price &&
                <div className="order-summary-container">
                    <table>
                        <tbody>
                            <tr>
                                <td>First Charge:</td>
                                <td>{getTrialEndString()}</td>
                            </tr>
                            <tr>
                                <td>Amount:</td>
                                <td>{`\$${price.unit_amount / 100}.`}<span>00</span></td>
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
    const [success, setSuccess] = useState(false)
    const stripe = useStripe()
    const elements = useElements()
    const { user } = useContext(UserContext)
    const { price } = useContext(PriceContext)

    const clientSecretRef = useRef(JSON.parse(sessionStorage.getItem('clientSecret')))

    const createCustomer = async () => {
        await ledgetapi.post(`user/${user.id}/customer`)
            .catch((error) => {
                if (error.response?.status !== 422) {
                    setErrMsg('Something went wrong. Please try again later.')
                }
            })
    }

    const createSubscription = async () => {
        await ledgetapi.post(`user/${user.id}/subscription`, {
            price_id: price.id,
            trial_period_days: price.metadata?.trial_period_days
        })
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.setItem("clientSecret", JSON.stringify(response.data.client_secret))
                    clientSecretRef.current = response.data.client_secret
                } else {
                    setErrMsg('Something went wrong. Please try again later.')
                }
            }).catch((error) => {
                if (error.response?.status !== 422) {
                    setErrMsg('Something went wrong. Please try again later.')
                }
            })
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
            setSuccess(true)
            window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
        } else if (result.error) {
            setCardErrMsg(result.error?.message)
        }
    }

    const onSubmit = async (data) => {
        setProcessing(true)
        try {
            if (!clientSecretRef.current) {
                await createCustomer()
                await createSubscription()
            }
            if (clientSecretRef.current) {
                await confirmSetup(data)
            }
        } catch (err) {
            !cardErrMsg && setErrMsg('Something went wrong. Please try again later.')
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
                            className="submit-button"
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
            <WindowLoadingBar visible={processing} />
            <Prices prices={prices} />
            <div id="checkout-container">
                {errMsg &&
                    <div className="general-error" >
                        <FormError msg={errMsg} />
                    </div>
                }
                <Form id="billing-form" onSubmit={onSubmit} />
                {cardErrMsg && <FormError msg={cardErrMsg} />}
                <OrderSummary />
                <SubmitButton form={'billing-form'} />
            </div>
            <StripeFooter />
        </>
    )
}

const AnimatedCheckout = () => {
    const { prices, error } = usePrices()

    return (
        <AnimatePresence>
            {prices && !error
                ?
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
                :
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="window" id="checkout-window-loading-error">
                        <div className="app-logo" >
                            <img src={logoLight} alt="Ledget" />
                        </div>
                        <div id="message" style={{ marginTop: "-12px" }}>
                            Please try back again later.
                        </div>
                    </div>
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

