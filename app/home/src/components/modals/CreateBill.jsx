import React, { useState, useRef, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string } from "yup"

import './styles/Forms.css'
import SubmitForm from './pieces/SubmitForm'
import withModal from './with/withModal'
import { TextInput, NameInput, GreenRadios } from '@components/inputs'
import { FormErrorTip } from '@components/pieces'

const schema = object().shape({
    name: string().required(),
    bill: string().required(),
})

const radioOptions = [
    { name: 'categoryType', value: 'monthly', label: 'Monthly', default: true },
    { name: 'categoryType', value: 'yearly', label: 'Yearly' },
]

const Form = (props) => {
    const [submitting, setSubmitting] = useState(false)
    const [bill, setBill] = useState('')
    const [emoji, setEmoji] = useState('')
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
                <div style={{ paddingLeft: '4px', display: 'inline-block' }}>
                    <GreenRadios options={radioOptions} />
                </div>
                <div className="responsive-inputs-row-container">
                    <div>
                        <NameInput
                            name="name"
                            placeholder="Bill name..."
                            emoji={emoji}
                            setEmoji={setEmoji}
                            ref={nameRef}
                            register={register}
                        >
                            {errors.name && <FormErrorTip />}
                        </NameInput>
                    </div>
                    <div>
                        <label htmlFor="bill" style={{ display: 'flex', flexDirection: 'row' }}>
                            <button>Amount</button>
                            <span> | </span>
                            <button style={{ opacity: '.3' }}>Range</button>
                        </label>
                        <TextInput>
                            <input
                                type="text"
                                name="amount"
                                id="amount"
                                placeholder="$0"
                                value={bill}
                                {...register('name')}
                                onChange={(e) => {
                                    const formatted = e.target.value
                                        .replace(/[^0-9.]/g, '')
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    setBill(`$${formatted}`)
                                }}
                                onBlur={(e) => e.target.value.length <= 1 && setBill('')}
                                size="14"
                            />
                            {errors.bill && !bill && <FormErrorTip />}
                        </TextInput>
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
            maxWidth={props.maxWidth || '375px'}
            blur={3}
        />

    )
}
