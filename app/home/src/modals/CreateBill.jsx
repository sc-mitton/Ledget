import React, { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string, boolean } from "yup"

import './styles/Forms.css'
import SubmitForm from '@components/pieces/SubmitForm'
import { withModal } from '@components/hocs'
import {
    EmojiComboText,
    DollarRangeInput,
    BlackRadios,
    Checkbox,
    AddReminder,
    useBillScheduler,
} from '@components/inputs'
import { useAddnewBillMutation } from '@api/apiSlice'

const radioOptions = [
    { name: 'period', value: 'monthly', label: 'Monthly', default: true },
    { name: 'period', value: 'yearly', label: 'Yearly' },
]

export const billSchema = object().shape({
    name: string().required().lowercase(),
    range: boolean(),
    lower_amount: string().when('range', {
        is: true,
        then: () => string().required('required')
            .test('lowerAmount', 'Lower amount must be smaller.', (value, { parent }) => {
                if (!value || !parent.upper_amount) { return true }

                return value.replace(/[^0-9.]/g, '')
                    < parent.upper_amount.replace(/[^0-9.]/g, '')
            })
            .transform((value) => {
                if (!value) { return }
                let val = value.replace(/[^0-9.]/g, '')
                val > 100 && (val *= 100)
                return val.toString()
            })
    }),
    upper_amount: string().required('required').transform((value) => {
        if (!value) { return }
        let val = value.replace(/[^0-9.]/g, '')
        val > 100 && (val *= 100)
        return val.toString()
    }),
})

export const extractBill = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    let body = Object.fromEntries(formData)

    // Check if schedule is missing
    if (!body.day && !(body.week && body.weekDay) && !(body.month && body.day)) {
        return { errors: { schedule: 'required.' } }
    }

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
    delete body.range

    return body
}

const Form = (props) => {
    const [addNewBill, { isLoading, isSuccess }] = useAddnewBillMutation()
    const { BillScheduler } = useBillScheduler()
    const [billPeriod, setBillPeriod] = useState('monthly')
    const [emoji, setEmoji] = useState('')
    const [scheduleMissing, setScheduleMissing] = useState(false)

    const { register, watch, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(billSchema),
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    })
    const watchRange = watch('range', false)

    useEffect(() => {
        isSuccess && props.setVisible(false)
    }, [isSuccess])

    const submitForm = (e) => {
        const body = extractBill(e)
        if (body.errors) {
            body.errors.schedule && setScheduleMissing(true)
        }

        handleSubmit((data) => {
            if (body.errors) { return }
            addNewBill({ data: { ...body, ...data } })
        })(e)
    }

    return (
        <form
            className="create-form"
            id="new-bill-form"
            onSubmit={submitForm}
        >
            <h2>New Bill</h2>
            <BlackRadios
                options={radioOptions}
                value={billPeriod}
                onChange={setBillPeriod}
            />
            <hr />
            <div>
                <EmojiComboText
                    name="name"
                    placeholder="Name"
                    emoji={emoji}
                    setEmoji={setEmoji}
                    register={register}
                    error={[errors.name]}
                />
            </div>
            <div className="split-inputs padded-row bottom-row">
                <div className="padded-row">
                    <BillScheduler
                        billPeriod={billPeriod}
                        error={scheduleMissing}
                    />
                    <div id="add-reminder--container">
                        <AddReminder />
                    </div>
                </div>
                <div className="padded-row">
                    <DollarRangeInput
                        mode={watchRange}
                        register={register}
                        errors={errors}
                    />
                    <div id="range-checkbox--container">
                        <Checkbox
                            label='Range'
                            name='range'
                            id="range"
                            aria-label='Change bill amount to a range.'
                            {...register('range')}
                        />
                    </div>
                </div>
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
            maxWidth={props.maxWidth || '375px'}
            minWidth={props.minWidth || '0px'}
            blur={2}
        />
    )
}
