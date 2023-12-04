import React, { useRef, useEffect, useState, HTMLProps } from 'react'

import { useController } from 'react-hook-form'
import { Control } from 'react-hook-form'

import './styles/Text.scss'
import Emoji from './Emoji'
import { EmojiProps, emoji } from './Emoji'
import { formatCurrency, makeIntCurrencyFromStr } from '@ledget/ui'
import { IconButton2, TextInputWrapper, FormErrorTip, FormError } from '@ledget/ui'
import { ArrowIcon } from '@ledget/media'

export const EmojiComboText = (props:
    { register: any, error: any, hasLabel?: boolean } & EmojiProps & HTMLProps<HTMLInputElement>) => {
    const {
        register,
        error,
        emoji: propsEmoji,
        setEmoji: propsSetEmoji,
        hasLabel = true,
        ...rest
    } = props

    const { ref: formRef, ...registerRest } = register('name')
    const ref = useRef<HTMLInputElement>()

    const [em, setEm] = useState<emoji>()
    const emoji = propsEmoji || em
    const setEmoji = propsSetEmoji || setEm

    useEffect(() => {
        emoji && ref.current?.focus()
    }, [emoji])

    return (
        <>
            {hasLabel && <label htmlFor="name">Name</label>}
            <TextInputWrapper>
                <Emoji emoji={emoji} setEmoji={setEmoji}>
                    {({ emoji }) => (
                        <>
                            <div id="emoji-picker-ledget--button-container">
                                <Emoji.Button
                                    id='emoji-picker-ledget--button'
                                    emoji={emoji}
                                />
                            </div>
                            <Emoji.Picker />
                            <input
                                type="hidden"
                                name="emoji"
                                value={typeof emoji === 'string' ? emoji : emoji?.native}
                            />
                        </>
                    )}
                </Emoji>
                <input
                    type="text"
                    {...rest}
                    {...registerRest}
                    ref={(e) => {
                        formRef(e)
                        if (e)
                            ref.current = e
                    }}
                    style={{ marginLeft: '.25em' }}
                />
                <FormErrorTip errors={error} />
            </TextInputWrapper>
        </>
    )
}
interface IncrementDecrement {
    val: string;
    setVal: React.Dispatch<React.SetStateAction<string>>;
    field?: {
        onChange: (newVal: number) => void;
    }
}

type IncrementFunction = (args: IncrementDecrement) => void;


const increment: IncrementFunction = ({ val, setVal, field }) => {
    let newVal: number
    if (!val || val === '') {
        newVal = 1000
    } else {
        newVal = makeIntCurrencyFromStr(val)
        newVal += 1000
    }

    field?.onChange(newVal)
    setVal(formatCurrency({ val: newVal }))
}

const decrement: IncrementFunction = ({ val, setVal, field }) => {
    let newVal
    if (!val) {
        newVal = 0
    } else {
        newVal = makeIntCurrencyFromStr(val)
    }

    newVal = newVal > 1000 ? newVal - 1000 : 0
    field?.onChange(newVal)
    setVal(formatCurrency({ val: newVal }))
}

const IncrementDecrementButton = ({ val, setVal, field }: IncrementDecrement) => (
    <div className="increment-arrows--container">
        <IconButton2
            type="button"
            onClick={() => increment({ val, setVal, field })}
            aria-label="increment"
            tabIndex={-1}
        >
            <ArrowIcon size={'.75em'} rotation={-180} stroke={'currentColor'} />
        </IconButton2>
        <IconButton2
            type="button"
            onClick={() => decrement({ val, setVal, field })}
            aria-label="decrement"
            tabIndex={-1}
        >
            <ArrowIcon size={'.75em'} stroke={'currentColor'} />
        </IconButton2>
    </div>
)

export const LimitAmountInput = (
    { control, defaultValue, children, hasLabel = true, withCents = true, ...rest }: {
        control?: Control,
        defaultValue?: string,
        children?: React.ReactNode
        name?: string
        hasLabel?: boolean
        withCents?: boolean
        style?: React.CSSProperties
    }
) => {
    const [val, setVal] = useState<string>('')

    const {
        field,
    } = useController({
        control,
        name: rest.name || 'limit_amount'
    })

    // set field value to default if present
    useEffect(() => {
        if (defaultValue) {
            field.onChange(makeIntCurrencyFromStr(defaultValue))
            setVal(defaultValue)
        }
    }, [defaultValue])

    return (
        <>
            {hasLabel && <label htmlFor="limit">Limit</label>}
            <TextInputWrapper className="limit-amount--container">
                <input
                    type="text"
                    name='limit_amount'
                    id="limit_amount"
                    placeholder={withCents ? '$0.00' : '$0'}
                    value={val}
                    ref={field.ref}
                    onKeyDown={(e) => {
                        if (e.key === 'Right' || e.key === 'ArrowRight') {
                            e.preventDefault()
                            increment({ val, setVal, field })
                        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                            e.preventDefault()
                            decrement({ val, setVal, field })
                        }
                    }}
                    onChange={(e) => {
                        field.onChange(makeIntCurrencyFromStr(e.target.value))
                        setVal(formatCurrency({ val: e.target.value, withCents }))
                    }}
                    onFocus={(e) => {
                        if (e.target.value.length <= 1 || val === '$0') {
                            withCents ? setVal('$0.00') : setVal('$0')
                            field.onChange(0)
                        }
                    }}
                    onBlur={(e) => {
                        (e.target.value.length <= 1 || val === '$0' || val === '$0.00') && setVal('')
                        field.onBlur()
                    }}
                    size={14}
                    {...rest}
                />
                <IncrementDecrementButton val={val} setVal={setVal} field={field} />
                {children}
            </TextInputWrapper>
        </>
    )
}

export const ControlledDollarInput = ({
    value, setValue, hasLabel = true, withCents = true, ...rest
}: {
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    withCents?: boolean
    hasLabel?: boolean
} & HTMLProps<HTMLInputElement>
) => {

    return (
        <>
            {hasLabel && <label htmlFor="limit">Limit</label>}
            <TextInputWrapper className={`limit-amount--container${value ? ' valid' : ''}`}>
                <input
                    type='text'
                    name='limit_amount'
                    placeholder={withCents ? '$0.00' : '$0'}
                    value={value}
                    onKeyDown={(e) => {
                        if (e.key === 'Right' || e.key === 'ArrowRight') {
                            e.preventDefault()
                            increment({ val: value, setVal: setValue })
                        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                            e.preventDefault()
                            decrement({ val: value, setVal: setValue })
                        }
                    }}
                    onChange={(e) => {
                        setValue(formatCurrency({ val: e.target.value, withCents }))
                    }}
                    onFocus={(e) => {
                        if (e.target.value.length <= 1 || value === '$0') {
                            withCents ? setValue('$0.00') : setValue('$0')
                        }
                    }}
                    onBlur={(e) => {
                        (e.target.value.length <= 1 || value === '$0' || value === '$0.00') && setValue('')
                    }}
                    size={14}
                    {...rest}
                />
                <IncrementDecrementButton
                    val={formatCurrency({ val: value, withCents })}
                    setVal={setValue}
                />
            </TextInputWrapper>
        </>
    )
}

export const DollarRangeInput = (
    { control, defaultLowerValue, defaultUpperValue, errors, hasLabel = true, rangeMode = false }: {
        control: Control,
        defaultLowerValue: string,
        defaultUpperValue: string,
        errors: any,
        hasLabel?: boolean,
        rangeMode?: boolean
    }
) => {

    return (
        <>
            {hasLabel && <label htmlFor="upper_amount">Amount</label>}
            <div className={`dollar-range-input--container ${rangeMode ? 'range-mode' : ''}`}>
                {rangeMode &&
                    <LimitAmountInput
                        hasLabel={false}
                        defaultValue={defaultLowerValue}
                        control={control}
                        name={'lower_amount'}
                    >
                        <FormErrorTip errors={errors.lower_amount && [errors.lower_amount]} />
                    </LimitAmountInput>
                }
                <LimitAmountInput
                    hasLabel={false}
                    defaultValue={defaultUpperValue}
                    control={control}
                    name={'upper_amount'}
                >
                    <FormErrorTip errors={errors.upper_amount && [errors.upper_amount]} />
                </LimitAmountInput>
            </div>
            {(errors.lower_amount?.type !== 'required' && errors.lower_amount?.message !== 'required')
                && <FormError msg={errors.lower_amount?.message} />}
            {(errors.lower_amount?.type !== 'required'
                && errors.lower_amount?.type !== 'typeError'
                && errors.lower_amount?.message !== 'required')
                && <FormError msg={errors.lower_amount?.message} />}
        </>
    )
}
