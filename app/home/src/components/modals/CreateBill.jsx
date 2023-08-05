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
    Schedule
} from '@components/inputs'
import { FormErrorTip, FormError } from '@components/pieces'

const radioOptions = [
    { name: 'categoryType', value: 'monthly', label: 'Monthly', default: true },
    { name: 'categoryType', value: 'yearly', label: 'Yearly' },
]

const Form = (props) => {
    const [submitting, setSubmitting] = useState(false)
    const [emoji, setEmoji] = useState('')
    const [rangeMode, setRangeMode] = useState(false)
    const [lowerRange, setLowerRange] = useState('')
    const [upperRange, setUpperRange] = useState('')

    const schema = object().shape({
        name: string().required(),
        lowerRange: rangeMode
            ? string().required().test('lowerRange', 'Lower value must be smaller.', (value) => {
                return parseInt(value.replace(/[^0-9.]/g, ''), 10)
                    < parseInt(upperRange.replace(/[^0-9.]/g, ''), 10)
            })
            : '',
        upperRange: string().required(),
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

    const submit = (data) => {
        setSubmitting(true)
        console.log(data)
        setTimeout(() => {
            setSubmitting(false)
            props.setVisible(false)
        }, 1000)
    }


    return (
        <div className="create-form">
            <form onSubmit={handleSubmit((data) => submit(data))} id="new-bill-form">
                <div className="form-top">
                    <h2>New Bill</h2>
                    <GreenRadios options={radioOptions} />
                    <hr style={{ opacity: ".1" }} />
                </div>
                <div className="padded-row">
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
                <div className="padded-row split-inputs">
                    <div id="limit-inputs-container">
                        <label htmlFor="upperRange">Amount</label>
                        <TextInput >
                            {rangeMode &&
                                <DollarInput
                                    dollar={lowerRange}
                                    setDollar={setLowerRange}
                                    name="lowerRange"
                                    id="lowerRange"
                                    register={register}
                                />
                            }
                            <DollarInput
                                dollar={upperRange}
                                setDollar={setUpperRange}
                                name="upperRange"
                                id="upperRange"
                                register={register}
                            />
                            <FormErrorTip errors={[errors.upperRange, errors.LowerRange]} />
                        </TextInput>
                        {errors.lowerRange && errors.lowerRange.type !== 'required'
                            && <FormError msg={errors.lowerRange?.message} />}
                        <div id="bottom-inputs">
                            <AddReminder />
                            <Checkbox
                                label='Range'
                                name='range'
                                id='range'
                                value={rangeMode}
                                onChange={(e) => { setRangeMode(e.target.checked) }}
                            />
                        </div>
                    </div>
                    <div style={{ marginLeft: '8px' }}>
                        <Schedule />
                    </div>
                </div>
                <SubmitForm
                    submitting={submitting}
                    onCancel={() => props.setVisible(false)}
                />
            </form>
        </div>
    )
}

const Modal = withModal(Form)

export default (props) => {
    const navigate = useNavigate()

    return (
        <Modal
            {...props}
            cleanUp={() => navigate(-1)}
            maxWidth={props.maxWidth || '350px'}
            minWidth={props.minWidth || '350px'}
            blur={3}
        />
    )
}
