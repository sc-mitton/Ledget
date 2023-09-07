import React, { useContext, useLayoutEffect, useEffect } from 'react'
import { useState, useRef } from 'react'

import { useForm, useController } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { AnimatePresence, motion } from 'framer-motion'
import { string } from 'yup'

import './style/Checkout.css'
import logoLight from '@assets/images/logoLight.svg'
import stripelogo from '@assets/images/stripelogo.svg'
import ledgetapi from '@api/axios'
import usePrices from '@api/hooks/usePrices'
import { WindowLoadingBar } from '../pieces'
import { Star } from '@ledget/shared-assets'
import {
    BlackWideButton,
    CardInput,
    FormError,
    NameOnCardInput,
    CityStateZipInputs,
    baseBillingSchema
} from '@ledget/shared-ui'
import { StripeElements } from '@ledget/shared-utils'

const schema = baseBillingSchema.shape({
    name: string()
        .required()
        .test('two-words', 'Missing last name', (value) => {
            if (value) {
                const words = value.trim().split(' ')
                return words.length === 2
            }
            return true
        }),
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
                                        <Star fill={'var(--green-hlight)'} />
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

const Form = ({ onSubmit, id }) => {
    const [cardEntered, setCardEntered] = useState(false)
    const [cardNotEnteredError, setCardNotEnteredError] = useState(false)

    const { register, handleSubmit, formState: { errors }, control, clearErrors } =
        useForm({ resolver: yupResolver(schema), mode: 'onSubmit', reValidateMode: 'onBlur' })
    const { field: stateField } = useController({ name: 'state', control })

    const submitBillingForm = (e) => {
        e.preventDefault()
        !cardEntered && setCardNotEnteredError(true)
        handleSubmit(
            (data) => cardEntered && onSubmit(data)
        )(e)
    }

    useEffect(() => {
        stateField.value && clearErrors('state')
    }, [stateField.value])

    return (
        <>
            <form onSubmit={submitBillingForm} className="checkout-form" id={id}>
                <h4>Billing Info</h4>
                <NameOnCardInput {...register('name')} errors={errors} />
                <CityStateZipInputs errors={errors} register={register} field={stateField} />
            </form >
            <h4>Card</h4>
            <CardInput
                requiredError={cardNotEnteredError}
                onComplete={() => setCardEntered(true)}
                clearError={() => setCardNotEnteredError(false)}
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
    const { price } = useContext(PriceContext)

    const clientSecretRef = useRef(JSON.parse(sessionStorage.getItem('clientSecret')))

    const createCustomer = async () => {
        await ledgetapi.post(`customer`)
            .catch((error) => {
                if (error.response?.status !== 422) {
                    setErrMsg('Something went wrong. Please try again later.')
                }
            })
    }

    const createSubscription = async () => {
        await ledgetapi.post(`subscription`, {
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
                        <BlackWideButton
                            id="subscribe-button"
                            type='submit'
                            form={form}
                            ref={submitButtonRef}
                            aria-label="Submit payment information"
                        >
                            <span>{`Start ${price.metadata?.trial_period_days}-day Free Trial`}</span>
                        </BlackWideButton>
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
                <div>
                    {errMsg &&
                        <div className="general-error" >
                            <FormError msg={errMsg} />
                        </div>
                    }
                    <Form id="billing-form" onSubmit={onSubmit} />
                    {cardErrMsg && <FormError msg={cardErrMsg} />}
                </div>
                <div>
                    <OrderSummary />
                    <SubmitButton form={'billing-form'} />
                </div>
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
        <StripeElements pk={import.meta.env.VITE_STRIPE_PK_TEST}>
            <PriceContextProvider>
                <AnimatedCheckout />
            </PriceContextProvider>
        </StripeElements>
    )
}

export default CheckoutWindow

