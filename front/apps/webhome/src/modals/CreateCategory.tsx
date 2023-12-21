import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm, useWatch } from "react-hook-form"
import { useNavigate, useLocation } from 'react-router-dom'

import './styles/Forms.scss'
import { useAddNewCategoryMutation, Category } from '@features/categorySlice'
import { AddAlert, EmojiComboText, LimitAmountInput, PeriodSelect, emoji } from '@components/inputs'
import { withModal } from '@ledget/ui'
import SubmitForm from '@components/pieces/SubmitForm'
import { FormErrorTip } from '@ledget/ui'

export const schema = z.object({
    name: z.string().min(1, { message: 'required' }).toLowerCase(),
    limit_amount: z.number().min(1, { message: 'required' }).transform((value) => (isNaN(value) ? undefined : value)),
    period: z.string().min(1, { message: 'required' }),
    alerts: z.array(z.object({ percent_amount: z.number() })).optional(),
})

const CreateCategoryModal = withModal((props) => {
    const location = useLocation()
    const [emoji, setEmoji] = useState<emoji>()
    const [addNewCategory, { isLoading, isSuccess }] = useAddNewCategoryMutation()

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    })
    const watchLimitAmount = useWatch({ control, name: 'limit_amount' })

    useEffect(() => {
        isSuccess && props.closeModal()
    }, [isSuccess])

    return (
        <>
            <h3>New Category</h3>
            <hr />
            <form
                onSubmit={handleSubmit((data, e) => {
                    addNewCategory({ ...data, emoji: emoji } as Category)
                })}
                id="new-cat-form"
                className="create-form"
            >
                <div className="split-inputs">
                    <div>
                        <EmojiComboText
                            emoji={emoji}
                            setEmoji={setEmoji}
                            name="name"
                            placeholder="Name"
                            register={register}
                            error={[errors.name]}
                        />
                    </div>
                    <div>
                        <LimitAmountInput withCents={false} control={control}>
                            <FormErrorTip error={(errors as any).limit_amount} />
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
                        <AddAlert limitAmount={watchLimitAmount} control={control} />
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
