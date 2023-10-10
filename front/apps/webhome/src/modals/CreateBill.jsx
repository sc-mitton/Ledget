import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string, boolean, number } from "yup"

import './styles/Forms.css'
import SubmitForm from '@components/pieces/SubmitForm'
import { withModal } from '@ledget/shared-utils'
import {
    EmojiComboText,
    DollarRangeInput,
    AddReminder,
    BillScheduler,
    PeriodSelect
} from '@components/inputs'
import { Checkbox } from '@ledget/shared-ui'
import { useAddnewBillMutation } from '@features/billSlice'


export const billSchema = object().shape({
    name: string().required().lowercase(),
    range: boolean(),
    lower_amount: number('Enter an amount').when('range', {
        is: true,
        then: () => number('Enter an amount').required('required')
            .test('lower_amount', 'First value must be smaller', (value, { parent }) => {
                return value < parent.upper_amount
            })
    }),
    upper_amount: number('Enter an amount').required('required')
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

    if (reminders.length > 0) {
        body.reminders = reminders
    }
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
        isSuccess && props.closeModal()
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
        <>
            <h2>New Bill</h2>
            <hr />
            <form
                className="create-form"
                id="new-bill-form"
                onSubmit={submitForm}
            >
                <div className="padded-row">
                    <label htmlFor="schedule">Schedule</label>
                    <div className="multi-input-row">
                        <div><PeriodSelect /></div>
                        <div>
                            <BillScheduler
                                billPeriod={billPeriod}
                                error={scheduleMissing}
                            />
                        </div>
                        <AddReminder />
                    </div>
                </div>
                <div>
                    <EmojiComboText
                        name="name"
                        placeholder="Name"
                        register={register}
                        error={[errors.name]}
                    />
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
                <SubmitForm
                    submitting={isLoading}
                    onCancel={() => props.closeModal()}
                />
            </form>
        </>
    )
}

const Modal = withModal(Form)

export default (props) => {
    const navigate = useNavigate()

    return (
        <Modal
            {...props}
            onClose={() => navigate(-1)}
            maxWidth={props.maxWidth || '350px'}
            minWidth={props.minWidth || '0px'}
            blur={2}
        />
    )
}
