import React, { useEffect } from 'react'
import { useState, useRef } from 'react'

import { useForm, useController } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { string, number } from 'yup'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_TEST)

const schema = baseBillingSchema.shape({
    name: string()
        .required()
        .test('two-words', 'Missing last name', (value) => {
            if (value) {
                const words = value.trim().split(' ')
                return words.length === 2
            }
            return true
        })
})

const PriceRadios = ({ prices, register }) => (
    <>
        {prices &&
            <div id="prices-container">
                <div id="prices-container-header">
                    <img src={logoLight} alt="Ledget" />
                </div>
                <div id="subscription-radios--container">
                    {prices.map((p, i) =>
                        <label
                            key={i}
                            htmlFor={`price-${i}`}
                        >
                            <input
                                name='price'
                                type="radio"
                                value={p.id}
                                id={`price-${i}`}
                                {...register('price')}
                                defaultChecked={i === 0}
                            />
                            <div className="subscription-radio--container">
                                {p.nickname.toLowerCase() == 'year' &&
                                    <div className="dog-ear">
                                        <Star fill={'var(--green-hlight)'} />
                                    </div>
                                }
                                <span className="nickname">{p.nickname}</span>
                                <span className="unit-amount">
                                    ${
                                        p.nickname.toLowerCase() == 'year'
                                            ? p.unit_amount / 1200
                                            : p.unit_amount / 100
                                    }<span> /mo</span>
                                </span>
                            </div>
                        </label>
                    )}
                </div>
            </div>
        }
    </>
)


const OrderSummary = ({ unit_amount, trial_period_days }) => {

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
            currentDate.getTime() + (trial_period_days * 24 * 60 * 60 * 1000)
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
        <div className="order-summary-container">
            <table>
                <tbody>
                    <tr>
                        <td>First Charge:</td>
                        <td>{getTrialEndString()}</td>
                    </tr>
                    <tr>
                        <td>Amount:</td>
                        <td>{`\$${unit_amount / 100}.`}<span>00</span></td>
                    </tr>
                </tbody>
            </table>
        </div >
    )
}

const Form = (props) => {
    const { prices, error } = usePrices()
    const stripe = useStripe()
    const elements = useElements()
    const clientSecretRef = useRef(JSON.parse(sessionStorage.getItem('clientSecret') || null))
    const [trial_period_days, setTrial_period_days] = useState(undefined)
    const [unit_amount, setUnit_amount] = useState(undefined)

    const [processing, setProcessing] = useState(false)
    const [cardEntered, setCardEntered] = useState(false)
    const [cardNotEnteredError, setCardNotEnteredError] = useState(false)
    const [cardErrMsg, setCardErrMsg] = useState(null)
    const [errMsg, setErrMsg] = useState(null)

    const { register, watch, handleSubmit, formState: { errors }, control, clearErrors } =
        useForm({ resolver: yupResolver(schema), mode: 'onSubmit', reValidateMode: 'onBlur' })
    const { field: stateField } = useController({ name: 'state', control })

    useEffect(() => { stateField.value && clearErrors('state') }, [stateField.value])

    useEffect(() => {
        if (prices) {
            const price = prices.find(p => p.id === watch('price'))
            setTrial_period_days(price.metadata.trial_period_days)
            setUnit_amount(price.unit_amount)
        }
    }, [watch('price'), prices])

    // Create customer if not already created
    // if there is already a customer created,
    // this will return a 422 error, which can be ignored
    const createCustomer = async () => {
        await ledgetapi.post(`customer`)
            .catch((error) => {
                if (error.response?.status !== 422) {
                    setErrMsg('Something went wrong. Please try again later.')
                }
            })
    }

    const createSubscription = async (data) => {
        await ledgetapi.post('subscription', {
            price_id: data.price,
            trial_period_days: trial_period_days
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
                        email: JSON.parse(sessionStorage.getItem("identifier")),
                        address: {
                            city: data.city,
                            state: data.state,
                            postal_code: data.zip,
                            country: data.country
                        }
                    }
                }
            }
        )

        if (result.error) {
            setCardErrMsg(result.error?.message)
        } else {
            window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
        }
    }

    const onSubmit = async (data) => {
        setProcessing(true)
        try {
            if (!clientSecretRef.current) {
                await createCustomer()
                await createSubscription(data)
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

    const submitBillingForm = (e) => {
        e.preventDefault()
        !cardEntered && setCardNotEnteredError(true)
        handleSubmit((data) => onSubmit(data))(e)
    }

    return (
        <>
            <WindowLoadingBar visible={processing} />
            <form onSubmit={submitBillingForm} {...props}>
                <PriceRadios register={register} prices={prices} />
                <div>
                    <div id="text-inputs--container">
                        <h4>Billing Info</h4>
                        <NameOnCardInput {...register('name')} errors={errors} />
                        <CityStateZipInputs errors={errors} register={register} field={stateField} />
                        <h4>Card</h4>
                        <CardInput
                            requiredError={cardNotEnteredError}
                            onComplete={() => setCardEntered(true)}
                            clearError={() => setCardNotEnteredError(false)}
                        />
                        {cardErrMsg && <FormError msg={cardErrMsg} />}
                        {errMsg &&
                            <div className="general-error" >
                                <FormError msg={errMsg} />
                            </div>}
                    </div>
                    <div>
                        <OrderSummary
                            unit_amount={unit_amount}
                            trial_period_days={trial_period_days}
                        />
                        <BlackWideButton form={'billing-form'}>
                            {`Start ${trial_period_days}-day Free Trial`}
                        </BlackWideButton>
                    </div>
                </div>
            </form >
        </>
    )
}

export const cardOptions = {
    fonts: [{
        cssSrc: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap"
    }]
}

const CheckoutWindow = () => {

    return (
        <Elements stripe={stripePromise} options={cardOptions}>
            <div id="checkout-window" className="window">
                <Form id="billing-form" />
                <div className="stripe-logo-container">
                    <div>powered by</div>
                    <div>
                        <a href="https://stripe.com/" target="_blank" rel="noopener noreferrer">
                            <img className="stripe-logo" src={stripelogo} alt="Stripe" />
                        </a>
                    </div>
                </div>
            </div>
        </Elements>
    )
}

export default CheckoutWindow

