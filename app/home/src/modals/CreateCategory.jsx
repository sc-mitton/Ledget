import React, { useState, useRef } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string } from "yup"
import { useNavigate } from 'react-router-dom'

import './styles/Forms.css'
import { useAddNewCategoryMutation } from '@api/apiSlice'
import { AddAlert, EmojiComboText, EvenDollarInput, BlackRadios } from '@components/inputs'
import { withModal } from '@components/hocs'
import SubmitForm from '@components/pieces/SubmitForm'
import { FormErrorTip } from '@components/pieces'
import { useEffect } from 'react'

const schema = object().shape({
    name: string().required().lowercase(),
    limit: string().required(),
})

const radioOptions = [
    { name: 'period', value: 'month', label: 'Month', default: true },
    { name: 'period', value: 'year', label: 'Year' },
]

const Form = (props) => {
    const [dollarLimit, setDollarLimit] = useState('')
    const [emoji, setEmoji] = useState('')
    const [addNewCategory, { isLoading, isSuccess }] = useAddNewCategoryMutation()

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    })

    const submit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        let body = Object.fromEntries(formData)

        body.limit_amount = Number(body.limit.replace(/[^0-9]/g, '')) * 100
        delete body.limit

        let alerts = []
        for (const [key, value] of Object.entries(body)) {
            if (key.includes('alert')) {
                alerts.push({ percent_amount: Number(value.replace(/[^0-9]/g, '')) })
                delete body[key]
            }
        }
        body.alerts = alerts

        addNewCategory({ data: body })
    }

    useEffect(() => {
        isSuccess && props.setVisible(false)
    }, [isSuccess])

    return (
        <form
            onSubmit={handleSubmit((data, e) => submit(e))}
            id="new-cat-form"
            className="create-form"
        >
            <h2>New Category</h2>
            <div style={{ margin: '4px 0' }}>
                <BlackRadios options={radioOptions} />
            </div>
            <hr />
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
            <div
                className="split-inputs"
                style={{ marginBottom: '20px' }}
            >
                <div>
                    <EvenDollarInput
                        name="limit"
                        dollarLimit={dollarLimit}
                        setDollarLimit={setDollarLimit}
                        register={register}
                    >
                        < FormErrorTip errors={[errors.limit]} />
                    </EvenDollarInput>
                </div>
                <div>
                    <AddAlert limit={dollarLimit} />
                </div>
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
            maxWidth={props.maxWidth || '375px'}
            minWidth={props.minWidth || '0px'}
            blur={2}
        />

    )
}
