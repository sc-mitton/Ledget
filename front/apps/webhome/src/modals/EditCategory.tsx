import React, { useEffect, useState } from 'react'

import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import './styles/Forms.scss'
import { withModal } from '@ledget/ui'
import { useGetCategoriesQuery, Category, useUpdateCategoriesMutation } from '@features/categorySlice'
import { AddAlert, EmojiComboText, LimitAmountInput, PeriodSelect, emoji } from '@components/inputs'
import SubmitForm from '@components/pieces/SubmitForm'
import { FormErrorTip } from '@ledget/ui'
import { schema as categoryFormSchema } from './CreateCategory'

const EditCategory = withModal((props) => {
    const [searchParams] = useSearchParams()
    const { data: categories, isSuccess: categoriesAreFetched } = useGetCategoriesQuery()
    const [emoji, setEmoji] = useState<emoji>()
    const [category, setCategory] = useState<Category>()
    const [updateCategory, { isSuccess: categoryIsUpdated, isLoading: isUpdatingCategory }] = useUpdateCategoriesMutation()


    const { register, handleSubmit, watch, formState: { errors }, control, setValue } = useForm({
        resolver: zodResolver(categoryFormSchema) as any,
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    })
    const watchLimitAmount = watch('limit_amount')

    const submit = (data: FieldValues, e: React.BaseSyntheticEvent | undefined) => {
        e?.preventDefault()
        const formData = new FormData(e?.target)
        let body = Object.fromEntries(formData as any)

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
        updateCategory({ id: category?.id, ...body, ...data } as Category)
    }

    // Set values on load
    useEffect(() => {
        const cat = categories?.find((c) => c.id === searchParams.get('category'))
        if (cat) {
            setCategory(cat)
            setEmoji(cat.emoji || '')
            setValue('name', cat.name.charAt(0).toUpperCase() + cat.name.slice(1))
        }
    }, [categoriesAreFetched])

    // Close Modal on success
    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (categoryIsUpdated) {
            timeout = setTimeout(() => {
                props.closeModal()
            }, 1000)
        }
    }, [categoryIsUpdated])

    return (
        <div>
            <form
                onSubmit={handleSubmit((data, e) => submit(data, e))}
                id="new-cat-form"
                className="create-form"
            >
                <h3>Edit Category</h3>
                <hr />
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
                        <LimitAmountInput
                            defaultValue={category?.limit_amount || 0}
                            control={control}
                        >
                            < FormErrorTip error={errors.limit_amount && errors.limit_amount as any} />
                        </LimitAmountInput>
                    </div>

                </div>
                <div className="extra-padded-row">
                    <div>
                        <PeriodSelect control={control} labelPrefix={'Resets'} default={category?.period} />
                    </div>
                    <div>
                        <AddAlert
                            limitAmount={watchLimitAmount}
                            defaultValues={category?.alerts}
                        />
                    </div>
                </div>
                <SubmitForm
                    success={categoryIsUpdated}
                    submitting={isUpdatingCategory}
                    onCancel={() => props.closeModal()}
                />
            </form>
        </div>
    )
})

export default function EnahncedModal() {
    const navigate = useNavigate()

    return (
        <EditCategory
            maxWidth={'20rem'}
            onClose={() => navigate(-1)}
        />
    )
}
