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
    baseBillingSchema as schema
} from '@ledget/shared-ui'
import { StripeElements } from '@ledget/shared-utils'


const Modal = withModal((props) => {
    const [isLoading, setIsLoading] = React.useState(false) // update to RTK query
    const [cardEntered, setCardEntered] = useState(false)
    const [cardNotEnteredError, setCardNotEnteredError] = useState(false)

    const { register, handleSubmit, formState: { errors }, control, clearErrors } =
        useForm({ resolver: yupResolver(schema), mode: 'onSubmit', reValidateMode: 'onBlur' })
    const { field: stateField } = useController({ name: 'state', control })

    useEffect(() => {
        stateField.value && clearErrors('state')
    }, [stateField.value])

    const submitForm = (e) => {
        e.preventDefault()
        !cardEntered && setCardNotEnteredError(true)
        handleSubmit(
            (data) => cardEntered && onSubmit(data)
        )(e)
    }

    return (
        <div>
            <h2>Update Payment Method</h2>
            <form onSubmit={submitForm}>
                <div id="update-payment-form">
                    <h4>Info</h4>
                    <CityStateZipInputs register={register} errors={errors} field={stateField} />
                    <h4>Card</h4>
                    <CardInput
                        requiredError={cardNotEnteredError}
                        onComplete={() => setCardEntered(true)}
                        clearError={() => setCardNotEnteredError(false)}
                    />
                </div>
                <SubmitForm
                    submitting={isLoading}
                    onCancel={() => props.setVisible(false)}
                />
            </form>
        </div>
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
