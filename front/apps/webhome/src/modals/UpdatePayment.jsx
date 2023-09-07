import React, { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
import SubmitForm from '@components/pieces/SubmitForm'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useForm, useController } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import './styles/UpdatePayment.css'
import { withModal } from '@ledget/shared-utils'
import {
    CardInput,
    CityStateZipInputs,
    baseBillingSchema as schema,
    FormError
} from '@ledget/shared-ui'
import { useGetSetupIntentQuery, useGetMeQuery } from '@features/userSlice'
import { StripeElements } from '@ledget/shared-utils'


const Modal = withModal((props) => {
    const [cardEntered, setCardEntered] = useState(false)
    const [cardNotEnteredError, setCardNotEnteredError] = useState(false)
    const [cardErrMsg, setCardErrMsg] = useState(null)
    const { data: setupIntent, isLoading } = useGetSetupIntentQuery()
    const { data: user } = useGetMeQuery()
    const stripe = useStripe()
    const elements = useElements()

    const { register, handleSubmit, formState: { errors }, control, clearErrors } =
        useForm({ resolver: yupResolver(schema), mode: 'onSubmit', reValidateMode: 'onBlur' })
    const { field: stateField } = useController({ name: 'state', control })

    useEffect(() => {
        stateField.value && clearErrors('state')
    }, [stateField.value])

    const confirmSetup = async (data) => {
        const result = await stripe.confirmCardSetup(
            setupIntent.client_secret,
            {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: data.name,
                        email: user?.email,
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
            props.setVisible(false)
        } else if (result.error) {
            setCardErrMsg(result.error?.message)
        }
    }

    const submitForm = (e) => {
        e.preventDefault()
        !cardEntered && setCardNotEnteredError(true)
        handleSubmit(
            (data) => cardEntered && confirmSetup(data)
        )(e)
    }

    return (
        <>
            <h2>Update Payment Method</h2>
            <form onSubmit={submitForm}>
                <div id="update-payment-form">
                    <h4>Info</h4>
                    <CityStateZipInputs
                        register={register}
                        errors={errors}
                        field={stateField}
                        loading={isLoading}
                    />
                    <h4>Card</h4>
                    <CardInput
                        requiredError={cardNotEnteredError}
                        onComplete={() => setCardEntered(true)}
                        clearError={() => setCardNotEnteredError(false)}
                        loading={isLoading}
                    />
                    {cardErrMsg && <FormError msg={cardErrMsg} />}
                </div>
                <SubmitForm
                    submitting={false}
                    onCancel={() => props.setVisible(false)}
                />
            </form>
        </>
    )
})

const UpdatePayment = (props) => {
    const navigate = useNavigate()

    return (
        <StripeElements pk={import.meta.env.VITE_STRIPE_PK_TEST}>
            <Modal
                {...props}
                cleanUp={() => navigate(-1)}
                maxWidth={props.maxWidth || '375px'}
                minWidth={props.minWidth || '0px'}
                blur={2}
            />
        </StripeElements>
    )
}

export default UpdatePayment
