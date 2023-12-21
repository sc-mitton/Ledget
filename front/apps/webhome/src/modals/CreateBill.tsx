import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from "react-hook-form"
import { z } from 'zod'

import './styles/Forms.scss'
import SubmitForm from '@components/pieces/SubmitForm'
import { withModal } from '@ledget/ui'
import {
    EmojiComboText,
    DollarRangeInput,
    AddReminder,
    BillScheduler,
    PeriodSelect
} from '@components/inputs'
import { Checkbox } from '@ledget/ui'
import { useAddnewBillMutation, Bill } from '@features/billSlice'
import { Reminder } from '@features/remindersSlice'

export const billSchema = z.object({
    name: z.string().toLowerCase().min(1, { message: 'required' }).max(50, { message: 'Name is too long.' }),
    lower_amount: z.number().transform((value) => (isNaN(value) ? undefined : value)).nullable(),
    upper_amount: z.number().transform((value) => (isNaN(value) ? undefined : value)),
    period: z.string().min(1, { message: 'required' }),

    day: z.number().nullable(),
    week: z.number().nullable(),
    week_day: z.number().nullable(),
    month: z.number().nullable(),

}).refine((data) => {
    return data.lower_amount && data.upper_amount
        ? data.lower_amount < data.upper_amount
        : true
})

export const extractBill = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as any)
    let body = Object.fromEntries(formData as any)

    // Check if schedule is missing
    if (!body.day && !(body.week && body.weekDay) && !(body.month && body.day)) {
        return { errors: { schedule: 'required.' } }
    }

    // Extract reminder objects
    let reminders: Reminder[] = []
    for (const [key, value] of Object.entries(body)) {
        if (key.includes('reminder')) {
            const values = key.match(/\[(\w+)\]/g)?.map((match) => {
                const matches = /[\w]+/.exec(match)
                return matches ? matches[0] : ''
            })

            if (!values) { continue }

            const index = parseInt(values[0]);
            reminders[index] = { ...reminders[index], [values[1]]: value };

            delete body[key]
        }
    }

    if (reminders.length > 0)
        body.reminders = reminders

    delete body.range
    return body
}

const Form = withModal((props) => {
    const [addNewBill, { isLoading, isSuccess }] = useAddnewBillMutation()
    const [scheduleMissing, setScheduleMissing] = useState(false)
    const [rangeMode, setRangeMode] = useState(false)

    const { register, handleSubmit, formState: { errors }, control } = useForm<z.infer<typeof billSchema>>({
        resolver: zodResolver(billSchema),
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    })

    useEffect(() => {
        isSuccess && props.closeModal()
    }, [isSuccess])

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        const body = extractBill(e)
        if (body.errors) {
            body.errors.schedule && setScheduleMissing(true)
        }

        handleSubmit((data) => {
            if (body.errors) { return }
            addNewBill({ ...body, ...data } as Bill)
        })(e)
    }

    const billPeriod = useWatch({ control, name: 'period' })

    useEffect(() => {
        console.log('errors', errors)
    }, [errors])

    return (
        <>
            <h3>New Bill</h3>
            <hr />
            <form
                className="create-form"
                id="new-bill-form"
                onSubmit={submitForm}
            >
                <div className="padded-row">
                    <label htmlFor="schedule">Schedule</label>
                    <div className="multi-input-row">
                        <div>
                            <PeriodSelect name="period" control={control} enableAll={true} />
                        </div>
                        {billPeriod !== 'once' &&
                            <div>
                                <BillScheduler
                                    billPeriod={billPeriod as Bill['period']}
                                    error={scheduleMissing}
                                    register={register}
                                />
                            </div>}
                        <AddReminder />
                    </div>
                </div>
                <div>
                    <EmojiComboText
                        name="name"
                        placeholder="Name"
                        register={register}
                        error={errors.name}
                    />
                </div>
                <div className="padded-row">
                    <DollarRangeInput
                        rangeMode={rangeMode}
                        control={control}
                        errors={errors}
                    />
                    <div id="range-checkbox--container">
                        <Checkbox
                            checked={rangeMode}
                            setChecked={setRangeMode}
                            label='Range'
                            id="range"
                            aria-label='Change bill amount to a range.'
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
})

export default function () {

    const navigate = useNavigate()

    return (
        <Form
            onClose={() => navigate(-1)}
            maxWidth={'21.875rem'}
            minWidth={'0'}
            blur={2}
        />
    )
}
