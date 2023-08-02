import React, { useState, useRef } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string } from "yup"
import { useNavigate } from 'react-router-dom'

import './styles/Forms.css'
import { AddAlert, NameInput, TextInput, GreenRadios } from '@components/inputs'
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

    return (
        <>
            <label htmlFor="limit">Limit</label>
            <TextInput>
                <input
                    name={props.name}
                    type="text"
                    id="limit"
                    placeholder="$0"
                    {...register('limit')}
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
        <div className="create-form">
            <h2>New Category</h2>
            <form onSubmit={handleSubmit((data) => submit(data))} id="new-cat-form">
                <div style={{ paddingLeft: '4px', display: 'inline-block' }}>
                    <GreenRadios options={radioOptions} />
                </div>
                <div className="responsive-inputs-row-container">
                    <div>
                        <NameInput
                            name="name"
                            placeholder="Category name..."
                            emoji={emoji}
                            setEmoji={setEmoji}
                            ref={nameRef}
                            register={register}
                        >
                            {errors.name && <FormErrorTip />}
                        </NameInput>
                    </div>
                    <div>
                        <LimitInput
                            name="limit"
                            dollarLimit={dollarLimit}
                            setDollarLimit={setDollarLimit}
                            register={register}
                        >
                            {errors.limit && !dollarLimit && <FormErrorTip />}
                        </LimitInput>
                    </div>
                </div>
                <div style={{ margin: '-8px 0 0 4px' }}>
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
