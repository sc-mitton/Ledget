import React, { useEffect, useState } from 'react'

import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm, FieldValues } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import './styles/Forms.css'
import { withModal } from '@ledget/ui'
import { useGetCategoriesQuery, Category, useUpdateCategoriesMutation } from '@features/categorySlice'
import { AddAlert, EmojiComboText, LimitAmountInput, PeriodSelect } from '@components/inputs'
import SubmitForm from '@components/pieces/SubmitForm'
import { FormErrorTip, formatCurrency } from '@ledget/ui'
import { schema as categoryFormSchema } from './CreateCategory'

const EditCategory = withModal((props) => {
    const [searchParams] = useSearchParams()
    const { data: categories, isSuccess: categoriesAreFetched } = useGetCategoriesQuery()
    const [emoji, setEmoji] = useState<string>()
    const [defaultLimit, setDefaultLimit] = useState<number>()
    const [category, setCategory] = useState<Category>()
    const [updateCategory, { isSuccess: categoryIsUpdated, isLoading: isUpdatingCategory }] = useUpdateCategoriesMutation()


    const { register, handleSubmit, watch, formState: { errors }, control, setValue } = useForm({
        resolver: yupResolver(categoryFormSchema) as any,
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    })
    const watchLimitAmount = watch('limit_amount')

    const submit = (data: FieldValues, e: React.BaseSyntheticEvent | undefined) => {
        e?.preventDefault()
        const formData = new FormData(e?.currentTarget)
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

        updateCategory({ id: category?.id, ...body } as Category)
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
                            defaultValue={formatCurrency(category?.limit_amount || 0).split('.')[0]}
                            control={control}
                        >
                            < FormErrorTip errors={errors.limit_amount && [errors.limit_amount]} />
                        </LimitAmountInput>
                    </div>

                </div>
                <div className="extra-padded-row">
                    <div>
                        <PeriodSelect labelPrefix={'Resets'} default={category?.period} />
                    </div>
                    <div>
                        <AddAlert limitAmount={watchLimitAmount} />
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
