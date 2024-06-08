import { useEffect } from 'react'
import { useState, useRef } from 'react'

import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import styles from './styles/checkout.module.scss'
import moduleStyles from './styles/styles.module.scss'
import ledgetapi from '@api/axios'
import { useGetPricesQuery } from '@features/pricesSlice'
import {
    MainButton,
    CardInput,
    FormError,
    NameOnCardInput,
    CityStateZipInputs,
    MinimalPortalWindow,
    useScreenContext,
    WindowLoadingBar
} from '@ledget/ui'
import StripeFooter from './StripeFooter'
import PriceRadios from './Prices'
import OrderSummary from './OrderSummary'
import { schema } from './schema'

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
            <form onSubmit={submitBillingForm} {...props} className={styles.billingForm}>
                <PriceRadios register={register} />
                <div>
                    <div className={styles.textInputs}>
                        <label>Billing Info</label>
                        <NameOnCardInput {...register('name')} errors={errors} />
                        <CityStateZipInputs
                            loading={processing}
                            errors={errors}
                            register={register as any}
                            control={control}
                        />
                        <label>Card</label>
                        <CardInput
                            requiredError={cardNotEnteredError}
                            onComplete={() => setCardEntered(true)}
                            clearError={() => setCardNotEnteredError(false)}
                        />
                        {cardErrMsg && <FormError msg={cardErrMsg} />}
                        {errMsg &&
                            <div className={styles.generalError}>
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
    const { screenSize } = useScreenContext()

    return (
        <div>
            {!isLoading &&
                <Elements stripe={stripePromise as any} options={cardOptions}>
                    <MinimalPortalWindow className={styles.window} maxWidth={34} size={screenSize} data-size={screenSize}>
                        <Form id="billing-form" />
                        <StripeFooter />
                    </MinimalPortalWindow>
                </Elements>
            }
        </div>
    )
}

export default CheckoutWindow
