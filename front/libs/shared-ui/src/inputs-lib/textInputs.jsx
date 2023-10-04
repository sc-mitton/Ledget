import React, { forwardRef, useRef, useState } from 'react'

import { VisibilityIcon } from "@ledget/shared-assets"
import { CardElement } from '@stripe/react-stripe-js'
import { object, string } from 'yup'

import './styles/textInputs.css'
import './styles/PasswordInput.css'
import { FormErrorTip, FormError } from '../pieces-lib/pieces'
import { ProvenceSelect } from './dropdownInputs'
import { BlockShimmerDiv } from '../pieces-lib/shimmer'


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

export const PlainTextInput = forwardRef((props, ref) => {
    const { errors, loading, ...rest } = props

    return (
        <>
            {loading
                ?
                <BlockShimmerDiv />
                :
                <TextInput>
                    <input
                        type='text'
                        ref={ref}
                        {...rest}
                    />
                    {errors &&
                        <FormErrorTip
                            errors={[
                                Object.hasOwn(errors, rest.name)
                                && errors[rest.name]
                            ]}
                        />
                    }
                </TextInput>
            }
        </>
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
                ? <BlockShimmerDiv />
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

export const baseBillingSchema = object({
    city: string()
        .required()
        .matches(/^[a-zA-Z ]+$/, 'Invalid city'),
    state: string().required('required'),
    zip: string()
        .required()
        .matches(/^\d{5}(?:[-\s]\d{4})?$/, 'Invalid zip'),
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
                        ? <BlockShimmerDiv />
                        : <CityInput {...register('city')} errors={errors} />
                    }
                </div>
                <div id="state-container">
                    {loading
                        ? <BlockShimmerDiv />
                        : <ProvenceSelect field={field} errors={errors} />}
                </div>
                <div id="zip-container">
                    {loading
                        ? <BlockShimmerDiv />
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

export const PasswordInput = React.forwardRef((props, ref) => {
    const {
        name,
        inputType,
        loading,
        visible: propsVisible,
        setVisible: propsSetVisible,
        onChange,
        error,
        ...rest
    } = props

    const [pwdInput, setPwdInput] = useState(false)
    let [localVis, setLocalVis] = useState(propsVisible || false)
    const localRef = useRef(null)
    const r = ref || localRef

    const visible = propsVisible || localVis
    const setVisible = propsSetVisible || setLocalVis

    return (
        <>
            {props.loading
                ?
                <BlockShimmerDiv />
                :
                <TextInput>
                    <input
                        name={name}
                        type={visible ? 'text' : 'password'}
                        ref={r}
                        onChange={(e) => {
                            e.target.value.length > 0 ? setPwdInput(true) : setPwdInput(false)
                            onChange && onChange(e)
                        }}
                        {...rest}
                    />
                    {pwdInput && inputType != 'confirm-password' &&
                        < VisibilityIcon mode={visible} onClick={() => { setVisible(!visible) }} />}
                    {error && (error.type === 'required' || error.msg?.includes('required'))
                        && <FormErrorTip errors={[{ type: 'required' }]} />
                    }
                </TextInput>
            }
        </>
    )
})

PasswordInput.defaultProps = {
    inputType: 'password',
    name: 'password',
    placeholder: 'Password',
    setVisible: null,
    visible: null,
}


export const PhoneInput = forwardRef((props, ref) => {
    const [value, setValue] = useState('')
    const { onChange, ...rest } = props

    const handleAutoFormat = (e) => {
        const { value } = e.target
        // Auto format like (000) 000-0000 and only except numbers
        let formatted = value.replace(/[^0-9]/g, '')
        formatted = formatted.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')

        setValue(formatted)
    }

    return (
        <PlainTextInput
            name="phone"
            type="tel"
            placeholder="(000) 000-0000"
            autoComplete="tel"
            value={value}
            onChange={(e) => {
                handleAutoFormat(e)
                onChange(e)
            }}
            ref={ref}
            {...rest}
            autoFocus
        />
    )
})
