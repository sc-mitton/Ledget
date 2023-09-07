import React, { forwardRef, useRef, useState } from 'react'

import { CardElement } from '@stripe/react-stripe-js'
import { object, string } from 'yup'

import './text.css'
import { FormErrorTip, FormError } from '../pieces-lib/pieces'
import { ProvenceSelect } from './dropdownInputs'
import { InputShimmerDiv } from '../pieces-lib/shimmer'


export const TextInput = forwardRef((props, ref) => {

    const { className, children, ...rest } = props

    return (
        <div
            className={`input-container ${className || ''}`}
            ref={ref}
            {...rest}
        >
            {children}
        </div>
    )
})

export const MenuTextInput = (props) => {
    const { className, onClick, children, ...rest } = props
    const ref = useRef(null)

    const handleClick = (event) => {
        // focus input element inside the container
        ref.current.querySelector('input').focus()
        onClick && onClick(event)
    }

    return (
        <div
            className={`menu-text-input-container ${className || ''}`}
            onClick={handleClick}
            ref={ref}
            {...rest}
        >
            <div>
                {children}
            </div>
        </div>
    )
}

export const CardInput = ({ requiredError, onComplete, clearError, loading }) => {
    let [cardFocus, setCardFocus] = useState(false)

    const cardElementOptions = {
        style: {
            base: {
                fontFamily: "Source Sans Pro, sans-serif",
                color: '#292929',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: cardFocus ? '#60d39c' : '#767676',
                },
                iconColor: cardFocus ? '#009b53' : '#292929',
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
            {loading
                ? <InputShimmerDiv />
                : <div className={`card-container${cardFocus ? ' focused' : ''}`}>
                    <CardElement
                        onBlur={() => setCardFocus(false)}
                        onFocus={() => setCardFocus(true)}
                        onChange={(e) => {
                            if (!e.complete) { return }
                            clearError()
                            onComplete()
                        }}
                        options={cardElementOptions}
                    />
                    {requiredError && <FormErrorTip errors={[{ type: 'required' }]} />}
                </div>
            }
        </>
    )
}

export const CityInput = forwardRef((props, ref) => {
    const { errors, ...rest } = props

    return (
        <TextInput>
            <input
                type='text'
                id='city'
                name='city'
                placeholder='City'
                ref={ref}
                {...rest}
            />
            <FormErrorTip errors={[errors.city]} />
        </TextInput>
    )
})

export const NameOnCardInput = forwardRef((props, ref) => {
    const { errors, ...rest } = props
    return (
        <>
            <TextInput>
                <input
                    type='text'
                    id='name-on-card'
                    name='name'
                    placeholder='Name on card'
                    ref={ref}
                    {...rest}
                />
                <FormErrorTip errors={[errors.name]} />
            </TextInput>
            <div id="name-on-card-error">
                {errors.name?.type !== 'required' &&
                    <FormError msg={errors.name?.message} />}
            </div>
        </>
    )
})

export const ZipInput = forwardRef((props, ref) => {
    const { errors, ...rest } = props

    return (
        <TextInput>
            <input
                type='text'
                id='zip'
                name='zip'
                placeholder='Zip'
                ref={ref}
                {...rest}
            />
            <FormErrorTip errors={[errors.zip]} />
        </TextInput>
    )
})

export const CityStateZipInputs = ({ errors, register, field, loading }) => {

    const hasErrorMsg = (field) => {
        return errors[field]?.message && !errors[field]?.message.includes('required')
    }

    return (
        <>
            <div id='location-inputs-container' >
                <div id="city-container">
                    {loading
                        ? <InputShimmerDiv />
                        : <CityInput {...register('city')} errors={errors} />
                    }
                </div>
                <div id="state-container">
                    {loading
                        ? <InputShimmerDiv />
                        : <ProvenceSelect field={field} errors={[errors.state]} />}
                </div>
                <div id="zip-container">
                    {loading
                        ? <InputShimmerDiv />
                        : <ZipInput {...register('zip')} errors={errors} />}
                </div>
            </div>
            {(hasErrorMsg('city') || hasErrorMsg('state') || hasErrorMsg('zip')) &&
                <div id="location-input-errors">
                    <div id="city-error">
                        <FormError msg={errors.city?.message} />
                    </div>
                    <div id="state-error">
                        <FormError msg={errors.state?.message} />
                    </div>
                    <div id="zip-error">
                        <FormError msg={errors.zip?.message} />
                    </div>
                </div>
            }
        </>
    )
}

export const baseBillingSchema = object({
    city: string()
        .required()
        .matches(/^[a-zA-Z ]+$/, 'Invalid city'),
    state: object().required('required'),
    zip: string()
        .required()
        .matches(/^\d{5}(?:[-\s]\d{4})?$/, 'Invalid zip'),
})
