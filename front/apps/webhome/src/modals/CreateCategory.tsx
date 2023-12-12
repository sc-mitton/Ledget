import { useEffect } from 'react'

import Big from 'big.js'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { useNavigate, useLocation } from 'react-router-dom'

import './styles/Forms.scss'
import { useAddNewCategoryMutation, Category } from '@features/categorySlice'
import { AddAlert, EmojiComboText, LimitAmountInput, PeriodSelect } from '@components/inputs'
import { withModal } from '@ledget/ui'
import SubmitForm from '@components/pieces/SubmitForm'
import { FormErrorTip } from '@ledget/ui'

export const schema = z.object({
    name: z.string().min(1, { message: 'required' }).toLowerCase(),
    limit_amount: z.string().min(1, { message: 'required' }).transform((value) =>
        Big(value.replace(/\D+/g, '')).times(100).toString(),
    ),
    period: z.string().min(1, { message: 'required' }),
})

const CreateCategoryModal = withModal((props) => {
    const location = useLocation()
    const [addNewCategory, { isLoading, isSuccess }] = useAddNewCategoryMutation()

    const { register, watch, control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    })
    const watchLimitAmount = watch('limit_amount')

    useEffect(() => {
        isSuccess && props.closeModal()
    }, [isSuccess])

    return (
        <>
            <h3>New Category</h3>
            <hr />
            <form
                onSubmit={handleSubmit((data, e) => {
                    e?.preventDefault()
                    const formData = new FormData(e?.target)
                    let body = Object.fromEntries(formData as any)
                    let alerts = []
                    for (const [key, value] of Object.entries(body)) {
                        if (key.includes('alert')) {
                            alerts.push({ percent_amount: Number(value.replace(/\D+/g, '')) })
                            delete body[key]
                        }
                    }
                    if (alerts.length > 0) {
                        body.alerts = alerts
                    }

                    addNewCategory({ ...body, ...data } as Category)
                })}
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
                            <FormErrorTip errors={[(errors as any).limit_amount]} />
                        </LimitAmountInput>
                    </div>

                </div>
                <div className="extra-padded-row">
                    <div>
                        <PeriodSelect
                            name="period"
                            control={control}
                            labelPrefix={'Resets'}
                            default={location.state?.period}
                        />
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
})

export default () => {
    const navigate = useNavigate()

    return (
        <CreateCategoryModal
            onClose={() => navigate(-1)}
            maxWidth={'21.875rem'}
            minWidth={'0'}
            blur={2}
        />

    )
}
