import { useEffect } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string } from "yup"
import { useNavigate, useLocation } from 'react-router-dom'

import './styles/Forms.css'
import { useAddNewCategoryMutation } from '@features/categorySlice'
import { AddAlert, EmojiComboText, LimitAmountInput, PeriodSelect } from '@components/inputs'
import { withModal } from '@ledget/ui'
import SubmitForm from '@components/pieces/SubmitForm'
import { FormErrorTip } from '@ledget/ui'

export const schema = object().shape({
    name: string().required().lowercase(),
    limit_amount: string().required().transform((value) => value.replace(/[^0-9]/g, '')),
})

const Form = (props) => {
    const location = useLocation()
    const [addNewCategory, { isLoading, isSuccess }] = useAddNewCategoryMutation()

    const { register, watch, control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    })
    const watchLimitAmount = watch('limit_amount')

    const submit = (data, e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        let body = Object.fromEntries(formData)

        let alerts = []
        for (const [key, value] of Object.entries(body)) {
            if (key.includes('alert')) {
                alerts.push({ percent_amount: Number(value.replace(/[^0-9]/g, '')) })
                delete body[key]
            }
        }
        if (alerts.length > 0) {
            body.alerts = alerts
        }

        addNewCategory({ ...body, ...data })
    }

    useEffect(() => {
        isSuccess && props.closeModal()
    }, [isSuccess])

    return (
        <>
            <h3>New Category</h3>
            <hr />
            <form
                onSubmit={handleSubmit((data, e) => submit(data, e))}
                id="new-cat-form"
                className="create-form"
            >
                <div className="split-inputs">
                    <div>
                        <EmojiComboText
                            name="name"
                            placeholder="Name"
                            register={register}
                            error={[errors.name]}
                        />
                    </div>
                    <div>
                        <LimitAmountInput withCents={false} control={control}>
                            < FormErrorTip errors={[errors.limit_amount]} />
                        </LimitAmountInput>
                    </div>

                </div>
                <div className="extra-padded-row">
                    <div>
                        <PeriodSelect labelPrefix={'Resets'} default={location.state?.period} />
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
        </>
    )
}

const Modal = withModal(Form)

export default (props) => {
    const navigate = useNavigate()

    return (
        <Modal
            {...props}
            onClose={() => navigate(-1)}
            maxWidth={props.maxWidth || '21.875rem'}
            minWidth={props.minWidth || '0'}
            blur={2}
        />

    )
}
