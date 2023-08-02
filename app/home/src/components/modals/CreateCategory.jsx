import React, { useState, useRef } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string, number } from "yup"
import { useNavigate } from 'react-router-dom'

import './styles/Forms.css'
import { AddAlert, TextInput, Emoji, PeriodRadios } from '@components/inputs'
import Checkbox from '@components/inputs/Checkbox'
import withModal from './with/withModal'
import SubmitForm from './pieces/SubmitForm'
import { FormErrorTip } from '@components/pieces'

const schema = object().shape({
    name: string().required(),
    limit: string().required(),
})

const LimitInput = (props) => {
    const { dollarLimit, setDollarLimit, children, ...rest } = props

    return (
        <div>
            <label htmlFor="limit">Limit</label>
            <TextInput>
                <input
                    {...rest}
                    type="text"
                    id="limit"
                    placeholder="$0"
                    value={dollarLimit}
                    onChange={(e) => {
                        const formatted = e.target.value
                            .replace(/[^0-9.]/g, '')
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        setDollarLimit(`$${formatted}`)
                    }}
                    onBlur={(e) => e.target.value.length <= 1 && setDollarLimit('')}
                    size="14"
                />
                {children}
            </TextInput>
        </div>
    )
}

const Form = (props) => {
    const [submitting, setSubmitting] = useState(false)
    const [dollarLimit, setDollarLimit] = useState('')
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
            <h2>New Category</h2>
            <form onSubmit={handleSubmit((data) => submit(data))}>
                <PeriodRadios />
                <div className="responsive-inputs-row-container">
                    <NameInput />
                    <LimitInput
                        name='limit'
                        dollarLimit={dollarLimit}
                        setDollarLimit={setDollarLimit}
                        {...register('limit')}
                    >
                        {errors.limit && !dollarLimit && <FormErrorTip />}
                    </LimitInput>
                    <div style={{ margin: '8px 0 0 2px' }}>
                        <AddAlert
                            limit={dollarLimit}
                            defaultOptions={[
                                { id: 1, value: 25, disabled: false },
                                { id: 2, value: 50, disabled: false },
                                { id: 3, value: 75, disabled: false },
                                { id: 4, value: 100, disabled: false },
                            ]}
                        />
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
