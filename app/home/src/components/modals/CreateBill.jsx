import React, { useState, useRef } from 'react'

import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string, number } from "yup"

import './styles/Forms.css'
import SubmitForm from './pieces/SubmitForm'
import withModal from './with/withModal'
import { TextInput, Emoji, PeriodRadios } from '@components/inputs'
import { FormErrorTip } from '@components/pieces'

const schema = object().shape({
    name: string().required(),
    bill: string().required(),
})

const Form = (props) => {
    const [submitting, setSubmitting] = useState(false)
    const [bill, setBill] = useState('')
    const [emoji, setEmoji] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    })

    const submit = (data) => {
        setSubmitting(true)
        console.log(data)
        setTimeout(() => {
            setSubmitting(false)
            props.setVisible(false)
        }, 1000)
    }

    const nameRef = useRef(null)
    const { ref, ...rest } = register('name')

    const NameInput = () => (
        <div>
            <label htmlFor="name">Name</label>
            <TextInput>
                <Emoji emoji={emoji} setEmoji={setEmoji}>
                    {({ emoji }) => (
                        <>
                            <div id="emoji-picker-ledget--button-container">
                                <Emoji.Button emoji={emoji} />
                            </div>
                            <Emoji.Picker onClose={() => nameRef.current.focus()} />
                            {emoji && <input type="hidden" name="emoji" value={emoji.native} />}
                        </>
                    )}
                </Emoji>
                <input
                    type="text"
                    name="name"
                    className="category-name"
                    placeholder="Category name..."
                    {...rest}
                    ref={(e) => {
                        ref(e)
                        nameRef.current = e
                    }}
                />
                {errors.name && <FormErrorTip />}
            </TextInput>
        </div>
    )

    return (
        <div className="create-form">
            <h2>New Bill</h2>
            <form onSubmit={handleSubmit((data) => submit(data))}>
                <PeriodRadios />
                <div className="responsive-inputs-row-container">
                    <NameInput />
                    <div>
                        <label htmlFor="bill">Amount</label>
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
                    <div></div>
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
