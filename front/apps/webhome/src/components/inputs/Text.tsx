import React, { FC, useRef, useEffect, useState, HTMLProps } from 'react'

import { useController, Control, Controller } from 'react-hook-form'

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
    if (!val || val === '' || val === '$0' || val === '$0.00') {
        newVal = 100
    } else {
        newVal = makeIntCurrencyFromStr(val)
        newVal += Math.pow(10, Math.floor(Math.log10(newVal)))
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

    newVal -= Math.pow(10, Math.floor(Math.log10(newVal)))
    if (newVal < 0) {
        newVal = 0
    }
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

export const LimitAmountInput: FC<HTMLProps<HTMLInputElement> & {
    control?: Control<any>,
    defaultValue?: number,
    hasLabel?: boolean
    withCents?: boolean
}> = ({
    control,
    defaultValue,
    children,
    hasLabel = true,
    withCents = true,
    required = true,
    ...rest
}) => {
        const [val, setVal] = useState<string>('')

        const { field } = useController({
            control,
            name: rest.name || 'limit_amount',
            rules: { required }
        })

        // set field value to default if present
        useEffect(() => {
            if (defaultValue) {
                field.onChange(formatCurrency({ val: defaultValue }))
                setVal(formatCurrency({ val: defaultValue }))
            }
        }, [defaultValue])

        return (
            <>
                {hasLabel && <label htmlFor="limit">Limit</label>}
                <Controller
                    control={control}
                    name={rest.name || 'limit_amount'}
                    render={({ field: { onChange, onBlur, ref } }) => (
                        <TextInputWrapper className={`limit-amount--container ${val ? 'valid' : ''}`}>
                            <input
                                type="text"
                                name='limit_amount'
                                id="limit_amount"
                                placeholder={withCents ? '$0.00' : '$0'}
                                value={val}
                                ref={ref}
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
                                    onChange(formatCurrency({ val: e.target.value, withCents }))
                                    setVal(formatCurrency({ val: e.target.value, withCents }))
                                }}
                                onFocus={(e) => {
                                    if (e.target.value.length <= 1 || val === '$0') {
                                        withCents ? setVal('$0.00') : setVal('$0')
                                        onChange(0)
                                    }
                                }}
                                onBlur={(e) => {
                                    (e.target.value.length <= 1 || val === '$0' || val === '$0.00') && setVal('')
                                    onBlur()
                                }}
                                size={14}
                                {...rest}
                            />
                            <IncrementDecrementButton val={val} setVal={setVal} field={field} />
                            {children}
                        </TextInputWrapper>
                    )}
                />
            </>
        )
    }

export const DollarRangeInput = (
    { control, defaultLowerValue, defaultUpperValue, errors, hasLabel = true, rangeMode = false }: {
        control: Control<any>,
        errors?: any,
        defaultLowerValue?: number,
        defaultUpperValue?: number,
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
            {(errors.lower_amount?.type !== 'required' && errors.lower_amount?.message.toLowerCase() !== 'required')
                && <FormError msg={errors.lower_amount?.message} />}
            {(errors.lower_amount?.type !== 'required'
                && errors.lower_amount?.type !== 'typeError'
                && errors.lower_amount?.message.toLowerCase() !== 'required')
                && <FormError msg={errors.lower_amount?.message} />}
        </>
    )
}
