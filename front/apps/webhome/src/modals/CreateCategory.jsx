import React, { useEffect } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string, number } from "yup"
import { useNavigate } from 'react-router-dom'

import './styles/Forms.css'
import { useAddNewCategoryMutation } from '@features/categorySlice'
import { AddAlert, EmojiComboText, LimitAmountInput, BlackRadios } from '@components/inputs'
import { withModal } from '@ledget/shared-utils'
import SubmitForm from '@components/pieces/SubmitForm'
import { FormErrorTip } from '@ledget/shared-ui'

export const schema = object().shape({
    name: string().required().lowercase(),
    limit_amount: number().required('required'),
})

const radioOptions = [
    { name: 'period', value: 'month', label: 'Monthly', default: true },
    { name: 'period', value: 'year', label: 'Yearly' },
]

const Form = (props) => {
    const [addNewCategory, { isLoading, isSuccess }] = useAddNewCategoryMutation()

    const { register, watch, control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    })
    const watchLimitAmount = watch('limit_amount', '')

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
        isSuccess && props.closeModal()
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
                    register={register}
                    error={[errors.name]}
                />
            </div>
            <div
                className="split-inputs"
                style={{ marginBottom: '20px' }}
            >
                <div>
                    <LimitAmountInput control={control}>
                        < FormErrorTip errors={[errors.limit_amount]} />
                    </LimitAmountInput>
                </div>
                <div>
                    <AddAlert limitAmount={watchLimitAmount} />
                </div>
            </div>
            <SubmitForm
                submitting={isLoading}
                onCancel={() => props.closeModal()}
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
            onClose={() => navigate(-1)}
            maxWidth={props.maxWidth || '375px'}
            minWidth={props.minWidth || '0px'}
            blur={2}
        />

    )
}
