import React, { forwardRef, useRef, useState } from 'react'
import { FC } from 'react'

import { CardElement } from '@stripe/react-stripe-js'
import { z } from 'zod'
import { FieldError, Control } from 'react-hook-form'
import { Eye, EyeOff } from '@geist-ui/icons'

import './text.scss'
import './password-input.scss'
import { FormErrorTip, FormError } from '../../pieces/form-errors/form-errors'
import { SelectProvence } from '../select-provence/select-provence'
import { InputShimmerDiv } from '../../pieces/shimmer/shimmer'
import { useStripeCardTheme } from '../../themes/themes'
import { useColorScheme } from '../../themes/hooks/use-color-scheme/use-color-scheme'


export interface TextInputWrapperProps extends React.HTMLProps<HTMLDivElement> {
  slim?: boolean
  focused?: boolean
}

export const TextInputWrapper = forwardRef<HTMLDivElement, TextInputWrapperProps>((props, ref) => {

  const { className, children, focused, slim, ...rest } = props

  return (
    <div
      className={`input-container ${className || ''} ${slim ? 'slim' : ''} ${focused ? 'focused' : ''}`}
      ref={ref}
      {...rest}
    >
      {children}
    </div>
  )
})


interface PlainTextInputProps extends React.HTMLProps<HTMLInputElement> {
  loading?: boolean
  name: string
  error?: FieldError
}

export const PlainTextInput = forwardRef<HTMLInputElement, PlainTextInputProps>((props, ref) => {
  const { error, loading, name, ...rest } = props

  return (
    <>
      {loading
        ?
        <InputShimmerDiv />
        :
        <TextInputWrapper>
          <input
            type='text'
            name={name}
            ref={ref}
            {...rest}
          />
          {error && <FormErrorTip error={error} />}
        </TextInputWrapper>
      }
    </>
  )
})

export const MenuTextInput: FC<React.HTMLProps<HTMLDivElement>> = (props) => {
  const { className, onClick, children, ...rest } = props
  const ref = useRef<HTMLDivElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // focus input element inside the container
    if (!ref.current) { return }
    const element = ref.current.querySelector('input')

    if (element) {
      element.focus()
    }

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

interface CardProps {
  requiredError: boolean,
  onComplete: () => void,
  clearError: () => void,
  loading: boolean
}

export const CardInput = ({ requiredError, onComplete, clearError, loading }: CardProps) => {
  let [cardFocus, setCardFocus] = useState(false)
  const { isDark } = useColorScheme()
  const stripeCardTheme = useStripeCardTheme({ isDark, focus: cardFocus })

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
            options={stripeCardTheme}
          />
          {requiredError && <FormErrorTip error={{ type: 'required' }} />}
        </div>
      }
    </>
  )
}

interface ZodValidatedInputProps extends React.HTMLProps<HTMLInputElement> {
  errors: any;
}

export const CityInput = forwardRef<HTMLInputElement, ZodValidatedInputProps>((props, ref) => {
  const { errors, ...rest } = props

  return (
    <TextInputWrapper>
      <input
        type='text'
        id='city'
        name='city'
        placeholder='City'
        ref={ref}
        {...rest}
      />
      <FormErrorTip error={errors.city} />
    </TextInputWrapper>
  )
})

export const NameOnCardInput = forwardRef<HTMLInputElement, ZodValidatedInputProps>((props, ref) => {
  const { errors, ...rest } = props

  return (
    <>
      <TextInputWrapper>
        <input
          type='text'
          id='name-on-card'
          name='name'
          placeholder='Name on card'
          ref={ref}
          {...rest}
        />
        <FormErrorTip error={errors.name} />
      </TextInputWrapper>
      <div id="name-on-card-error">
        {errors.name?.type !== 'required' &&
          <FormError msg={errors.name?.message} />}
      </div>
    </>
  )
})

export const ZipInput = forwardRef<HTMLInputElement, ZodValidatedInputProps>((props, ref) => {
  const { errors, ...rest } = props

  return (
    <TextInputWrapper>
      <input
        type='text'
        id='zip'
        name='zip'
        placeholder='Zip'
        ref={ref}
        {...rest}
      />
      <FormErrorTip error={errors.zip} />
    </TextInputWrapper>
  )
})

export const baseBillingSchema = z.object({
  city: z.string()
    .min(1, 'required')
    .max(50, 'City is too long'),
  state: z.string().min(1, 'required'),
  zip: z.string()
    .min(1, 'required')
    .regex(/^\d{5}(?:[-\s]\d{4})?$/, 'Invalid zip'),
})

interface CityStateZipInputsProps {
  errors: any,
  register: (name: string, options?: any) => any,
  control: Control<any>
  loading: boolean
}

export const CityStateZipInputs = ({ errors, register, control, loading }: CityStateZipInputsProps) => {

  const hasErrorMsg = (field: string) => {
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
            : <SelectProvence control={control} errors={errors} />}
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
          </div>
          <div id="zip-error">
            <FormError msg={errors.zip?.message} />
          </div>
        </div>
      }
    </>
  )
}


interface PasswordProps extends React.HTMLProps<HTMLInputElement> {
  name?: string,
  inputType?: 'password' | 'confirm-password',
  placeholder?: string,
  loading?: boolean,
  visible?: boolean,
  setVisible?: (visible: boolean) => void,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  error?: any
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordProps>((props, ref) => {
  const {
    name = 'password',
    inputType = 'password',
    placeholder = 'Password',
    loading = false,
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
        <InputShimmerDiv />
        :
        <TextInputWrapper>
          <input
            name={name}
            type={visible ? 'text' : 'password'}
            placeholder={placeholder}
            ref={r}
            onChange={(e) => {
              e.target.value.length > 0 ? setPwdInput(true) : setPwdInput(false)
              onChange && onChange(e)
            }}
            {...rest}
          />
          {pwdInput && inputType != 'confirm-password' &&
            visible ? <EyeOff size={'1.25em'} onClick={() => { setVisible(false) }} tabIndex={0} />
            : <Eye size={'1.25em'} onClick={() => { setVisible(true) }} tabIndex={0} />}
          {error && (error.type === 'required' || error.msg?.includes('required'))
            && <FormErrorTip error={{ type: 'required' }} />}
        </TextInputWrapper>
      }
    </>
  )
})

export const PhoneInput = forwardRef<HTMLInputElement, React.HTMLProps<HTMLInputElement>>((props, ref) => {
  const [value, setValue] = useState('')
  const { onChange, ...rest } = props

  const handleAutoFormat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    // Auto format like (000) 000-0000 and only except numbers
    let formatted = value.replace(/[^0-9]/g, '')
    formatted = formatted.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')

    setValue(formatted)
  }

  return (
    <TextInputWrapper>
      <input
        name="phone"
        type="tel"
        placeholder="(000) 000-0000"
        autoComplete="tel"
        value={value}
        onChange={(e) => {
          handleAutoFormat(e)
          if (onChange) {
            onChange(e)
          }
        }}
        ref={ref}
        {...rest}
        autoFocus
        required
      />
    </TextInputWrapper>
  )
})
