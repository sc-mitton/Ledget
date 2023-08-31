import React, { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string, boolean, number } from "yup"

import './styles/Forms.css'
import SubmitForm from '@components/pieces/SubmitForm'
import { withModal } from '@components/hocs'
import {
    EmojiComboText,
    DollarRangeInput,
    BlackRadios,
    Checkbox,
    AddReminder,
    BillScheduler,
} from '@components/inputs'
import { useAddnewBillMutation } from '@features/billSlice'

const radioOptions = [
    { name: 'period', value: 'monthly', label: 'Monthly', default: true },
    { name: 'period', value: 'yearly', label: 'Yearly' },
]

export const billSchema = object().shape({
    name: string().required().lowercase(),
    range: boolean(),
    lower_amount: number().when('range', {
        is: true,
        then: () => number().required('required')
            .test('lower_amount', 'First value must be smaller', (value, { parent }) => {
                return value < parent.upper_amount
            })
    }),
    upper_amount: number().required('required')
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
    const [billPeriod, setBillPeriod] = useState('monthly')
    const [scheduleMissing, setScheduleMissing] = useState(false)

    const { register, watch, handleSubmit, formState: { errors }, control } = useForm({
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
                        rangeMode={watchRange}
                        control={control}
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
