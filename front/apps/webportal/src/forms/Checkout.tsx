import { useEffect } from 'react'
import { useState, useRef } from 'react'

import { useForm, useController, UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import dayjs from 'dayjs'

import './style/Checkout.scss'
import ledgetapi from '@api/axios'
import { useGetPricesQuery } from '@features/pricesSlice'
import { WindowLoadingBar } from '../pieces'
import { Star } from '@ledget/media'
import {
    MainButton,
    CardInput,
    FormError,
    NameOnCardInput,
    CityStateZipInputs,
    baseBillingSchema,
    DollarCents,
    useColorScheme
} from '@ledget/ui'
import { LedgetLogoIcon, StripeLogo } from '@ledget/media'


const schema = baseBillingSchema.extend({
    name: z.string().min(1, { message: 'required' }),
    price: z.string().min(1, { message: 'required' }),
}).refine((data) => data.name.split(' ').length > 1, {
    message: 'Please enter your full name'
})

const PriceRadios = ({ register }: { register: UseFormRegister<z.infer<typeof schema>> }) => {
    const { data: prices } = useGetPricesQuery()

    return (
        <>
            {prices &&
                <div id="prices-container">
                    <div id="prices-container-header">
                        <LedgetLogoIcon size={'1.75em'} />
                    </div>
                    <div id="subscription-radios--container">
                        {prices.map((p, i) =>
                            <label
                                key={i}
                                htmlFor={`price-${i}`}
                            >
                                <input
                                    type="radio"
                                    value={p.id}
                                    id={`price-${i}`}
                                    {...register('price')}
                                    defaultChecked={i === 0}
                                />
                                <div className="subscription-radio--container">
                                    {p.nickname.toLowerCase() == 'year' &&
                                        <div className="dog-ear">
                                            <Star fill={'currentColor'} />
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
}

const getDaySuffix = (day: number) => {
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

const OrderSummary = ({ unit_amount, trial_period_days }: { unit_amount?: number, trial_period_days?: number }) => {
    const firstCharge = dayjs().add(trial_period_days || 0, 'day')

    return (
        <div className="order-summary-container">
            <table>
                <tbody>
                    <tr>
                        <td>First Charge:</td>
                        <td>{firstCharge.format('MMM, D')}{getDaySuffix(firstCharge.date())}</td>
                    </tr>
                    <tr>
                        <td>Amount:</td>
                        <td><DollarCents value={unit_amount || 0} /></td>
                    </tr>
                </tbody>
            </table>
        </div >
    )
}

const Form = (props: { id: string }) => {
    const { data: prices } = useGetPricesQuery()
    const stripe = useStripe()
    const elements = useElements()
    const clientSecretRef = useRef<string>('')
    const identifierRef = useRef<string>('')
    const [trial_period_days, setTrial_period_days] = useState<number>()
    const [unit_amount, setUnit_amount] = useState<number>()

    const [processing, setProcessing] = useState(false)
    const [cardEntered, setCardEntered] = useState(false)
    const [cardNotEnteredError, setCardNotEnteredError] = useState(false)
    const [cardErrMsg, setCardErrMsg] = useState<string>()
    const [errMsg, setErrMsg] = useState<string>()

    const { register, watch, handleSubmit, formState: { errors }, control, clearErrors } =
        useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), mode: 'onSubmit', reValidateMode: 'onBlur' })
    const { field: stateField } = useController({ name: 'state', control })

    useEffect(() => { stateField.value && clearErrors('state') }, [stateField.value])

    useEffect(() => {
        if (prices) {
            const price = prices.find(p => p.id === watch('price'))
            setTrial_period_days(price?.metadata.trial_period_days)
            setUnit_amount(price?.unit_amount)
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

    const createSubscription = async (data: z.infer<typeof schema>) => {
        await ledgetapi.post('subscription', {
            price_id: data.price,
            trial_period_days: trial_period_days
        }).then((response) => {
            if (response.status === 200) {
                clientSecretRef.current = response.data.client_secret
                identifierRef.current = response.data.identifier
            } else {
                setErrMsg('Something went wrong. Please try again later.')
            }
        }).catch((error) => {
            setErrMsg('Something went wrong. Please try again later.')
        })
    }

    const confirmSetup = async (data: z.infer<typeof schema>) => {
        const result = await stripe?.confirmCardSetup(clientSecretRef.current, {
            payment_method: {
                card: elements?.getElement(CardElement)!,
                billing_details: {
                    name: data.name,
                    email: identifierRef.current,
                    address: {
                        city: data.city,
                        state: data.state,
                        postal_code: data.zip,
                        country: 'US'
                    }
                }
            }
        })

        if (result?.error) {
            setCardErrMsg(result.error?.message)
        } else {
            window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
        }
    }

    const onSubmit = async (data: z.infer<typeof schema>) => {
        setProcessing(true)
        try {
            if (!clientSecretRef.current) {
                await createCustomer()
                await createSubscription(data)
            }
            if (clientSecretRef.current && identifierRef.current) {
                await confirmSetup(data)
            }
        } catch (err) {
            !cardErrMsg && setErrMsg('Something went wrong. Please try again later.')
        } finally {
            setProcessing(false)
        }
    }

    const submitBillingForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        !cardEntered && setCardNotEnteredError(true)
        handleSubmit((data) => { onSubmit(data) })(e)
    }

    return (
        <>
            <WindowLoadingBar visible={processing} />
            <form onSubmit={submitBillingForm} {...props}>
                <PriceRadios register={register} />
                <div>
                    <div id="text-inputs--container">
                        <h4>Billing Info</h4>
                        <NameOnCardInput {...register('name')} errors={errors} />
                        <CityStateZipInputs
                            loading={processing}
                            errors={errors}
                            register={register as any}
                            control={control}
                        />
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
                        <MainButton form={'billing-form'}>
                            {`Start ${trial_period_days}-day Free Trial`}
                        </MainButton>
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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK)

const CheckoutWindow = () => {
    const { isLoading } = useGetPricesQuery()
    const { isDark } = useColorScheme()

    return (
        <>
            {!isLoading &&
                <Elements stripe={stripePromise as any} options={cardOptions}>
                    <div id="checkout-window" className={`${isDark ? 'dark' : 'light'} window`}>
                        <Form id="billing-form" />
                        {window.innerWidth > 700 &&
                            <div className="stripe-logo-container">
                                <div>powered by</div>
                                <div>
                                    <a href="https://stripe.com/" target="_blank" rel="noopener noreferrer">
                                        <StripeLogo />
                                    </a>
                                </div>
                            </div>}
                    </div>
                </Elements>
            }
        </>
    )
}

export default CheckoutWindow

