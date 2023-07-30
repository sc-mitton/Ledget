import React, { useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string, number } from "yup"
import { useNavigate } from 'react-router-dom'


import { Radios, AddAlert, TextInput } from '@components/inputs'
import Checkbox from '@components/inputs/Checkbox'
import withModal from './with/withModal'
import SubmitForm from './pieces/SubmitForm'
import { FormErrorTip } from '@components/pieces'
import './styles/CreateCategory.css'

const schema = object().shape({
    name: string().required(),
    upperLimit: number().required(),
})

const radioOptions = [
    { name: 'categoryType', value: 'month', label: 'Month', default: true },
    { name: 'categoryType', value: 'year', label: 'Year' },
]

const Form = (props) => {
    const [upperLimit, setUpperLimit] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    })

    const submit = (data) => {
        setSubmitting(true)
        setSubmitting(false)
    }

    return (
        <div className="create-form" id='category-form'>
            <h2>New Category</h2>
            <form onSubmit={handleSubmit((data) => submit(data))}>
                <div style={{ paddingLeft: '4px' }}>
                    <Radios options={radioOptions} />
                </div>
                <div className="responsive-inputs-row-container">
                    <div>
                        <label htmlFor="name">Name</label>
                        <TextInput>
                            <input
                                type="text"
                                name="emoji"
                                className="emoji"
                                placeholder="☺"
                            />
                            <input
                                type="text"
                                name="name"
                                className="category-name"
                                placeholder="Category name"
                                {...register('name')}
                            />
                            {errors.name && <FormErrorTip />}
                        </TextInput>
                    </div>
                    <div>
                        <label htmlFor="limit">Limit</label>
                        <TextInput>
                            <input
                                type="text"
                                name="upperLimit"
                                id="upperLimit"
                                placeholder="$0"
                                value={upperLimit}
                                {...register('upperLimit')}
                                onChange={(e) => {
                                    const formatted = e.target.value
                                        .replace(/[^0-9.]/g, '')
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    setUpperLimit(`$${formatted}`)
                                }}
                                onBlur={(e) => e.target.value.length <= 1 && setUpperLimit('')}
                            />
                            {errors.upperLimit && <FormErrorTip />}
                        </TextInput>
                    </div>
                </div>
                <div className='inputs-row-container'>
                    <AddAlert limit={upperLimit} />
                    <Checkbox
                        label="Make private"
                        name="private"
                        id="private"
                        checked={false}
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
