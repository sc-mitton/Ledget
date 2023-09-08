import React, { useEffect } from 'react'
import { useState, useRef } from 'react'

import { useForm, useController, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
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

const Prices = ({ control }) => {
    const { prices, error } = usePrices()
    const [price, setPrice] = useState(null)

    useEffect(() => {
        prices && setPrice(prices[0])
    }, [prices])

    return (
        <>
            {prices &&
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
                                <Controller
                                    name="price"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <input
                                            name="price"
                                            type="radio"
                                            id={`price-${i}`}
                                            value={value}
                                            checked={p === price}
                                            aria-label={p.nickname}
                                            aria-checked={p === price}
                                            onChange={(e) => { onChange(e.target.value) }}
                                        />
                                    )}
                                />
                                <label
                                    htmlFor={`price-${i}`}
                                    tabIndex={i + 1}
                                    onClick={() => setPrice(p)}
                                    onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && setPrice(p)}
                                >
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
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            }
        </>
    )
}

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
    const [cardEntered, setCardEntered] = useState(false)
    const [cardNotEnteredError, setCardNotEnteredError] = useState(false)
    const [errMsg, setErrMsg] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [cardErrMsg, setCardErrMsg] = useState(null)
    const stripe = useStripe()
    const elements = useElements()

    const clientSecretRef = useRef(JSON.parse(sessionStorage.getItem('clientSecret')))

    const { register, watch, handleSubmit, formState: { errors }, control, clearErrors } =
        useForm({ resolver: yupResolver(schema), mode: 'onSubmit', reValidateMode: 'onBlur' })
    const { field: stateField } = useController({ name: 'state', control })
    const price = watch('price', '')

    useEffect(() => {
        console.log(watch())
    }, [watch()])

    useEffect(() => {
        stateField.value && clearErrors('state')
    }, [stateField.value])

    const createCustomer = async () => {
        await ledgetapi.post(`customer`)
            .catch((error) => {
                if (error.response?.status !== 422) {
                    setErrMsg('Something went wrong. Please try again later.')
                }
            })
    }

    const createSubscription = async (data) => {
        await ledgetapi.post(`subscription`, {
            price_id: data.pice.id,
            trial_period_days: data.price.metadata?.trial_period_days
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
                            city: data.city,
                            state: data.city.value,
                            postal_code: data.zip,
                            country: data.country
                        }
                    }
                }
            }
        )
        result.error && setCardErrMsg(result.error?.message)
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

    const submitBillingForm = (e) => {
        e.preventDefault()
        !cardEntered && setCardNotEnteredError(true)
        handleSubmit(
            (data) => console.log(data)
        )(e)
    }

    return (
        <>
            <WindowLoadingBar visible={processing} />
            <form onSubmit={submitBillingForm} {...props}>
                <Prices control={control} />
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
                    <OrderSummary
                        unit_amount={price?.unit_amount}
                        trial_period_days={price?.trial_period_days}
                    />
                    <BlackWideButton form={'billing-form'}>
                        {`Start ${price?.trial_period_days}-day Free Trial`}
                    </BlackWideButton>
                </div>
            </form >
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

const CheckoutWindow = () => {
    return (
        <StripeElements pk={import.meta.env.VITE_STRIPE_PK_TEST}>
            <div id="checkout-window" className="window">
                <Form id="billing-form" />
                <StripeFooter />
            </div>
        </StripeElements>
    )
}

export default CheckoutWindow

