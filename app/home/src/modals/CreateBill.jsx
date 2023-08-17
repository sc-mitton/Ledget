import React, { useState, useRef, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string } from "yup"

import './styles/Forms.css'
import SubmitForm from '@components/pieces/SubmitForm'
import withModal from './with/withModal'
import {
    EmojiComboText,
    TextInput,
    DollarInput,
    GreenRadios,
    Checkbox,
    AddReminder,
    Scheduler
} from '@components/inputs'
import { FormErrorTip, FormError } from '@components/pieces'
import { useAddnewBillMutation } from '@api/apiSlice'

const radioOptions = [
    { name: 'categoryType', value: 'monthly', label: 'Monthly', default: true },
    { name: 'categoryType', value: 'yearly', label: 'Yearly' },
]

const Form = (props) => {
    const [addNewBill, { isLoading, isSuccess }] = useAddnewBillMutation()

    const [billPeriod, setBillPeriod] = useState('monthly')
    const [rangeMode, setRangeMode] = useState(false)
    const [emoji, setEmoji] = useState('')
    const [lowerAmount, setlowerAmount] = useState('')
    const [upperAmount, setupperAmount] = useState('')
    const [scheduleMissing, setScheduleMissing] = useState(false)

    const schema = object().shape({
        name: string().required(),
        lowerAmount: rangeMode
            ? string().required().test('lowerAmount', 'Lower value must be smaller.', (value) => {
                return parseInt(value.replace(/[^0-9.]/g, ''), 10)
                    < parseInt(upperAmount.replace(/[^0-9.]/g, ''), 10)
            })
            : '',
        upperAmount: string().required(),
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    })

    const nameRef = useRef(null)
    useEffect(() => {
        emoji && nameRef.current.focus()
    }, [emoji])

    const finalSubmit = (body) => {

        Object.keys(body).forEach((key) => {
            const snakeCase = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
            if (snakeCase !== key) {
                body[snakeCase] = body[key]
                delete body[key]
            }
        })

        if (rangeMode) {
            body.lower_amount = body.lower_amount.replace(/[^0-9]/g, '')
            body.lower_amount < 100 && (body.lower_amount *= 100)
        }
        body.upper_amount = body.upper_amount.replace(/[^0-9]/g, '')
        body.upper_amount < 100 && (body.upper_amount *= 100)
        body.name = body.name.toLowerCase()

        // Extract reminder objects
        let reminders = []
        for (const [key, value] of Object.entries(body)) {
            if (key.includes('reminder')) {
                const values = key.match(/\[(\w+)\]/g).map((match) => /[\w]+/.exec(match)[0])
                if (reminders.length < values[0] - 1) {
                    reminders.push({})
                }
                reminders[values[0]] = { ...reminders[values[0]], [values[1]]: value }
                delete body[key]
            }
        }
        body.reminders = reminders

        addNewBill({ data: body })
    }

    const submitForm = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        let body = Object.fromEntries(formData)
        delete body.range

        // Check if schedule is missing
        if (!body.day && !(body.week && body.weekDay) && !(body.month && body.day)) {
            setScheduleMissing(true)
        } else {
            setScheduleMissing(false)
        }

        handleSubmit(() => {
            if (scheduleMissing) return
            finalSubmit(body)
        })(e)
    }

    useEffect(() => {
        isSuccess && props.setVisible(false)
    }, [isSuccess])

    return (
        <form
            className="create-form"
            id="new-bill-form"
            onSubmit={submitForm}
        >
            <h2>New Bill</h2>
            <GreenRadios
                options={radioOptions}
                value={billPeriod}
                onChange={setBillPeriod}
            />
            <hr />
            <div className='split-inputs'>
                <div>
                    <label htmlFor="name">Name</label>
                    <EmojiComboText
                        name="name"
                        placeholder="Name"
                        emoji={emoji}
                        setEmoji={setEmoji}
                        ref={nameRef}
                        register={register}
                    >
                        <FormErrorTip errors={[errors.name]} />
                    </EmojiComboText>
                </div>
                <div>
                    <label htmlFor="name">Schedule</label>
                    <Scheduler>
                        <Scheduler.Button>
                            {scheduleMissing &&
                                <FormErrorTip errors={[{ type: 'required' }]} />}
                        </Scheduler.Button>
                        {billPeriod === 'monthly'
                            ? <Scheduler.DayWeekPicker />
                            : <Scheduler.MonthDayPicker />
                        }
                    </Scheduler>
                </div>
            </div>
            <div id="limit-inputs-container" className="padded-row">
                <label htmlFor="upperAmount">Amount</label>
                <TextInput >
                    {rangeMode &&
                        <DollarInput
                            dollar={lowerAmount}
                            setDollar={setlowerAmount}
                            name="lowerAmount"
                            id="lowerAmount"
                            register={register}
                        />
                    }
                    <DollarInput
                        dollar={upperAmount}
                        setDollar={setupperAmount}
                        name="upperAmount"
                        id="upperAmount"
                        register={register}
                    />
                    <FormErrorTip errors={[errors.upperAmount, errors.lowerAmount]} />
                </TextInput>
                {errors.lowerAmount?.type !== 'required'
                    && <FormError msg={errors.lowerAmount?.message} />}
            </div>
            <div id="bottom-inputs">
                <AddReminder />
                <Checkbox
                    label='Range'
                    name='range'
                    id="range"
                    aria-label='Change bill amount to a range.'
                    value={rangeMode}
                    onChange={(e) => { setRangeMode(e.target.checked) }
                    }
                />
            </div>
            <SubmitForm
                submitting={isLoading}
                onCancel={() => props.setVisible(false)}
            />
        </form>
    )
}

const Modal = withModal(Form)

export default (props) => {
    const navigate = useNavigate()

    return (
        <Modal
            {...props}
            cleanUp={() => navigate(-1)}
            maxWidth={props.maxWidth || '325px'}
            minWidth={props.minWidth || '0px'}
            blur={3}
        />
    )
}
