import React, { useContext, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string } from "yup"

import './styles/Items.css'
import { ItemsProvider, ItemsContext } from './context'
import {
    EmojiComboText,
    DollarRangeInput,
    PeriodSelect,
    useBillScheduler,
    AddReminder,
    Checkbox
} from '@components/inputs'
import { BottomButtons, ItemsList } from './Reusables'


const Form = ({ children }) => {
    const { BillScheduler, reset: resetScheduler } = useBillScheduler()
    const [rangeMode, setRangeMode] = useState(false)
    const [reminders, setReminders] = useState([])
    const [period, setPeriod] = useState(null)
    const [scheduleMissing, setScheduleMissing] = useState(false)

    const schema = object().shape({
        name: string().required(),
        lowerAmount: rangeMode
            ? string().required().test('lowerAmount', 'Lower value must be smaller.', (value) => {
                const upperAmount = this.upperAmount
                return parseInt(value.replace(/[^0-9.]/g, ''), 10)
                    < parseInt(upperAmount.replace(/[^0-9.]/g, ''), 10)
            })
            : '',
        upperAmount: string().required(),
    })

    const [emoji, setEmoji] = useState('')
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    })

    const resetForm = () => {
        setEmoji('')
        resetScheduler()
        setReminders([])
        reset()
    }

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

    return (
        <form onSubmit={handleSubmit((data, e) => submitForm(e))}>
            <div>
                <div>
                    <PeriodSelect value={period} onChange={setPeriod} />
                </div>
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
                <div id="bill-scheduler--container">
                    <BillScheduler
                        billPeriod={`${period}ly`}
                        error={scheduleMissing}
                    />
                    <AddReminder
                        value={reminders}
                        onChange={setReminders}
                    />
                </div>
                <div>
                    <DollarRangeInput mode={rangeMode} register={register} errors={errors} />
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
            </div>
            {children}
        </form>
    )
}

const AddBills = () => {
    const { itemsEmpty } = useContext(ItemsContext)

    return (
        <div className="window2">
            <h2 className="spaced-header2">Bills</h2>
            {itemsEmpty &&
                <>
                    <h4 >Add your monthly and yearly bills</h4>
                    <hr className="spaced-header" />
                </>
            }
            <ItemsList />
            <Form >
                <BottomButtons />
            </Form>
        </div>
    )
}

const Enriched = () => (
    <ItemsProvider>
        <AddBills />
    </ItemsProvider>
)


export default Enriched
