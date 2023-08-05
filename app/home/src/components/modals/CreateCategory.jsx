import React, { useState, useRef } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string } from "yup"
import { useNavigate } from 'react-router-dom'

import './styles/Forms.css'
import { AddAlert, EmojiComboText, TextInput, GreenRadios } from '@components/inputs'
import withModal from './with/withModal'
import SubmitForm from './pieces/SubmitForm'
import { FormErrorTip } from '@components/pieces'
import { useEffect } from 'react'

const schema = object().shape({
    name: string().required(),
    limit: string().required(),
})

const radioOptions = [
    { name: 'categoryType', value: 'month', label: 'Month', default: true },
    { name: 'categoryType', value: 'year', label: 'Year' },
]

const LimitInput = (props) => {
    const { dollarLimit, setDollarLimit, register } = props
    const { onBlur, onChange, ...rest } = register('limit')

    return (
        <>
            <label htmlFor="limit">Limit</label>
            <TextInput>
                <input
                    name={props.name}
                    type="text"
                    id="limit"
                    placeholder="$0"
                    value={dollarLimit}
                    onChange={(e) => {
                        const formatted = e.target.value
                            .replace(/[^0-9.]/g, '')
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        setDollarLimit(`$${formatted}`)
                        onChange && onChange(e)
                    }}
                    onBlur={(e) => {
                        e.target.value.length <= 1 && setDollarLimit('')
                        onBlur && onBlur(e)
                    }}
                    size="14"
                    {...rest}
                />
                {props.children}
            </TextInput>
        </>
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
        <form
            onSubmit={handleSubmit((data) => submit(data))}
            id="new-cat-form"
            className="create-form"
        >
            <div>
                <h2>New Category</h2>
                <div style={{ margin: '4px 0' }}>
                    <GreenRadios options={radioOptions} />
                </div>
                <hr style={{ opacity: ".1" }} />
            </div>
            <div className="flex-responsive">
                <div>
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
                    <LimitInput
                        name="limit"
                        dollarLimit={dollarLimit}
                        setDollarLimit={setDollarLimit}
                        register={register}
                    >
                        < FormErrorTip errors={[errors.limit]} />
                    </LimitInput>
                </div>
            </div>
            <div style={{ marginBottom: '20px', marginTop: '8px' }}>
                <AddAlert limit={dollarLimit} />
            </div>
            <SubmitForm
                submitting={submitting}
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
            blur={3}
        />

    )
}
