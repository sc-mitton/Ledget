import React, { useState, useRef, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string } from "yup"

import './styles/Forms.css'
import SubmitForm from './pieces/SubmitForm'
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
    const [billPeriod, setBillPeriod] = useState('monthly')
    const [rangeMode, setRangeMode] = useState(false)

    const [emoji, setEmoji] = useState('')
    const [lowerLimit, setlowerLimit] = useState('')
    const [upperLimit, setupperLimit] = useState('')

    const [addNewBill, { isLoading, isSuccess }] = useAddnewBillMutation()
    const [scheduleMissing, setScheduleMissing] = useState(false)

    const schema = object().shape({
        name: string().required(),
        lowerLimit: rangeMode
            ? string().required().test('lowerLimit', 'Lower value must be smaller.', (value) => {
                return parseInt(value.replace(/[^0-9.]/g, ''), 10)
                    < parseInt(upperLimit.replace(/[^0-9.]/g, ''), 10)
            })
            : '',
        upperLimit: string().required(),
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

    const submit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        let body = Object.fromEntries(formData)
        console.log(body)
    }

    useEffect(() => {
        isSuccess && props.setVisible(false)
    }, [isSuccess])


    return (
        <form
            className="create-form"
            id="new-bill-form"
            onSubmit={handleSubmit((data, e) => submit(e))}
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
                        <Scheduler.Button />
                        {billPeriod === 'monthly'
                            ? <Scheduler.DayWeekPicker />
                            : <Scheduler.MonthDayPicker />
                        }
                    </Scheduler>
                </div>
            </div>
            <div id="limit-inputs-container" className="padded-row">
                <label htmlFor="upperLimit">Amount</label>
                <TextInput >
                    {rangeMode &&
                        <DollarInput
                            dollar={lowerLimit}
                            setDollar={setlowerLimit}
                            name="lowerLimit"
                            id="lowerLimit"
                            register={register}
                        />
                    }
                    <DollarInput
                        dollar={upperLimit}
                        setDollar={setupperLimit}
                        name="upperLimit"
                        id="upperLimit"
                        register={register}
                    />
                    <FormErrorTip errors={[errors.upperLimit, errors.lowerLimit]} />
                </TextInput>
                {errors.lowerLimit?.type !== 'required'
                    && <FormError msg={errors.lowerLimit?.message} />}
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
