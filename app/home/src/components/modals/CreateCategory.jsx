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
    { name: 'type', value: 'month', label: 'Month', default: true },
    { name: 'type', value: 'year', label: 'Year' },
]

const LimitInput = (props) => {
    const { dollarLimit, setDollarLimit, register } = props
    const { onBlur, onChange, ...rest } = register('limit')

    const handleChange = (e) => {
        const formatted = e.target.value
            .replace(/[^0-9]/g, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        setDollarLimit(`$${formatted}`)
        onChange && onChange(e)
    }

    const hanldeBlur = (e) => {
        e.target.value.length <= 1 && setDollarLimit('')
        onBlur && onBlur(e)
    }

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
                    onChange={handleChange}
                    onBlur={hanldeBlur}
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

    const submit = (e) => {
        e.preventDefault()
        setSubmitting(true)
        const formData = new FormData(e.target)

        // extract alert inputs
        let alerts = []
        for (const entry of Array.from(formData.entries())) {
            const [fieldName, fieldValue] = entry
            if (fieldName.includes('alert')) {
                alerts.push({ percent_amount: Number(fieldValue) })
                formData.delete(fieldName)
            }
        }
        formData.append('alerts', JSON.stringify(alerts))

        formData.append('limit_amount', Number(dollarLimit.replace(/[^0-9]/g, '')))
        formData.delete('limit')

        // Make 2 seperate api calls, one to create a category
        // and one to create the associated alerts

        setTimeout(() => {
            setSubmitting(false)
            // props.setVisible(false)
        }, 1000)
    }

    return (
        <form
            onSubmit={handleSubmit((data, e) => submit(e))}
            id="new-cat-form"
            className="create-form"
        >
            <h2>New Category</h2>
            <div style={{ margin: '4px 0' }}>
                <GreenRadios options={radioOptions} />
            </div>
            <hr style={{ opacity: ".1", marginBottom: '16px' }} />
            <div className="flex-responsive1">
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
            maxWidth={props.maxWidth || '275px'}
            blur={3}
        />

    )
}
