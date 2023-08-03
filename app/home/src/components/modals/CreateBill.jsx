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
    AddReminder
} from '@components/inputs'
import { FormErrorTip } from '@components/pieces'

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
            ? string().required()
            : string(),
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
            <h2>New Bill</h2>
            <form onSubmit={handleSubmit((data) => submit(data))} id="new-bill-form">
                <div style={{ display: 'inline-block' }}>
                    <GreenRadios options={radioOptions} />
                    <hr style={{ opacity: ".1" }} />
                </div>
                <div
                    className="responsive-inputs-row-container"
                    style={{ marginTop: '12px' }}
                >
                    <div>
                        <EmojiComboText
                            name="name"
                            placeholder="Name"
                            emoji={emoji}
                            setEmoji={setEmoji}
                            ref={nameRef}
                            register={register}
                        >
                            {errors.name && <FormErrorTip />}
                        </EmojiComboText>
                    </div>
                    <div>
                        <label htmlFor="upperRange">Amount</label>
                        <div >
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
                                {(errors.upperRange || errors.lowerRange)
                                    && <FormErrorTip />}
                            </TextInput>
                        </div >
                    </div>
                </div>
                <div id="below-inputs" style={{ marginBottom: '16px' }}>
                    <div>
                        <AddReminder />
                    </div>
                    <Checkbox
                        label='Range'
                        name='range'
                        id='range'
                        value={rangeMode}
                        onChange={(e) => { setRangeMode(e.target.checked) }}
                    />
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
            maxWidth={props.maxWidth || '325px'}
            blur={3}
        />

    )
}
