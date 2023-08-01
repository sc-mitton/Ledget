import React, { useState, useRef } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string, number } from "yup"
import { useNavigate } from 'react-router-dom'


import { Radios, AddAlert, TextInput, Emoji } from '@components/inputs'
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
    const [submitting, setSubmitting] = useState(false)
    const [upperLimit, setUpperLimit] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    })

    const submit = (data) => {
        setSubmitting(true)
        setSubmitting(false)
    }
    const nameRef = useRef(null)
    const { ref, ...rest } = register('name')

    const Limit = () => {

        return (
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
        )
    }

    const EmojiInput = () => {
        return (
            <Emoji onClose={() => nameRef.current.focus()}>
                {({ emoji, picker, setPicker }) => (
                    <>
                        <div id="emoji-picker-ledget--button-container">
                            <div
                                className="btn-gr2"
                                id="emoji-picker-ledget--button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setPicker(!picker)
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setPicker(!picker)
                                    }
                                }}
                                role="button"
                                aria-label="Emoji picker"
                                aria-haspopup="true"
                                aria-expanded={picker}
                                aria-controls="emoji-picker-ledget--container"
                                tabIndex={0}
                            >
                                {emoji ? emoji.native : '☺'}
                            </div>
                        </div>
                        <Emoji.Picker />
                        {emoji &&
                            <input type="hidden" name="emoji"
                                value={emoji.native} />
                        }
                    </>
                )}
            </Emoji>
        )
    }

    const Name = () => {

        return (
            <div>
                <label htmlFor="name">Name</label>
                <TextInput>
                    <EmojiInput />
                    <input
                        type="text"
                        name="name"
                        className="category-name"
                        placeholder="Category name"
                        {...rest}
                        ref={(e) => {
                            ref(e)
                            nameRef.current = e
                        }}
                    />
                    {errors.name && <FormErrorTip />}
                </TextInput>
            </div>
        )
    }

    return (
        <div className="create-form" id='category-form'>
            <h2>New Category</h2>
            <form onSubmit={handleSubmit((data) => submit(data))}>
                <div style={{ paddingLeft: '4px', display: 'inline-block' }}>
                    <Radios options={radioOptions} />
                </div>
                <div className="responsive-inputs-row-container">
                    <Name />
                    <Limit />
                </div>
                <div className='inputs-row-container'>
                    <AddAlert
                        limit={upperLimit}
                        defaultOptions={[
                            { id: 1, value: 25, disabled: false },
                            { id: 2, value: 50, disabled: false },
                            { id: 3, value: 75, disabled: false },
                            { id: 4, value: 100, disabled: false },
                        ]}
                    />
                    {false &&
                        // TODO: this option is only available
                        // for shared accounts
                        <Checkbox
                            label="Make private"
                            name="private"
                            id="private"
                            checked={false}
                        />
                    }
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
