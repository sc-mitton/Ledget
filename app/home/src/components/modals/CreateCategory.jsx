import React, { useState, useRef } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string, number } from "yup"
import { useNavigate } from 'react-router-dom'
import { Listbox } from '@headlessui/react'

import Plus from '@assets/icons/Plus'
import Checkmark from '@assets/icons/Checkmark'
import { Radios } from '@components/inputs'
import Checkbox from '@components/inputs/Checkbox'
import withModal from './with/withModal'
import SubmitForm from './pieces/SubmitForm'
import { FormErrorTip } from '@components/pieces'
import { DropAnimation } from '@utils'
import './styles/CreateCategory.css'
import './styles/style.css'
import { useEffect } from 'react'

const schema = object().shape({
    name: string().required(),
    upperLimit: number().required(),
})

const defaultAlertOptions = [
    { id: 1, value: 25, unavailable: false },
    { id: 2, value: 50, unavailable: false },
    { id: 3, value: 75, unavailable: false },
    { id: 4, value: 100, unavailable: false },
]

const AddAlert = ({ limit }) => {
    const [selectedAlerts, setSelectedAlerts] = useState([defaultAlertOptions[0]])
    const [alertOptions, setAlertOptions] = useState(defaultAlertOptions)

    const formatDollar = (value, percentage) => {
        let dollar = parseInt(value.replace(/[^0-9.]/g, '')) * percentage / 100
        dollar = dollar.toFixed(0)
        // convert to string and add commas
        dollar = dollar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        return `$${dollar}`
    }

    const ListOption = ({ option }) => (
        <Listbox.Option
            key={option.id}
            value={option.value}
            disabled={option.unavailable}
        >
            {({ active, selected }) => (
                <div className={
                    `slct-item
                        ${active && "a-slct-item"}
                        ${selected && "s-slct-item"}`}
                >
                    <span>
                        {option.value}%
                        &nbsp;&nbsp;
                        <span
                            style={{
                                opacity: `${active ? .5 : 0}`,
                                fontSize: '.8em',
                                display: 'inline'
                            }}
                        >
                            {limit
                                ? `(${formatDollar(limit, option.value)})`
                                : ('of limit')
                            }
                        </span>
                    </span>
                    <span>
                        <Checkmark stroke={`${selected
                            ? 'var(--main-green-darker)'
                            : 'transparent'}`}
                        />
                    </span>
                </div>
            )}
        </Listbox.Option>
    )

    const CustomOption = () => {
        const [focused, setFocused] = useState(false)
        const [value, setValue] = useState('')
        const inputRef = useRef(null)

        const handleFocus = (e) => {
            setFocused(true)
            setValue('%')
        }

        const handleChange = (e) => {
            // only allow numbers and make sure it's only a 2 digit number
            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2)
        }



        return (
            <li>
                <div className='slct-item custom-input'>
                    <div className="input-container"
                        style={{
                            padding: "2px 2px",
                            margin: "0 -4px",
                            width: "100%",
                            backgroundColor: `${focused ? 'var(--input-color)' : 'transparent'}`,
                            boxShadow: `${focused ? 'var(--input-drop-shadow)' : 'none'}`,
                            color: `${focused ? 'var(--input-placeholder)' : 'var(--main-text-gray)'}`,
                        }}
                    >0
                        <input
                            type="text"
                            name="custom"
                            className='dropdown-input'
                            placeholder='Custom...'
                            onFocus={handleFocus}
                            onBlur={() => !value && setPlaceholder('Custom...')}
                            value={value}
                            onChange={handleChange}
                            size='10'
                            ref={inputRef}
                        />
                    </div>
                </div>
            </li>
        )
    }


    return (
        <div id="alert-select">
            <Listbox
                value={selectedAlerts}
                onChange={setSelectedAlerts}
                multiple={true}
            >
                {({ open }) => (
                    <>
                        <Listbox.Button id='add-alert-btn' style={{ margin: '4px 0' }}>
                            Spending Alert
                            <Plus
                                stroke={'var(--white-text)'}
                                strokeWidth={'18'}
                                width={'.9em'}
                                height={'.9em'}
                            />
                        </Listbox.Button>
                        <DropAnimation visible={open} >
                            <Listbox.Options
                                static
                                style={{
                                    position: 'absolute'
                                }}
                            >
                                <div className="dropdown" >
                                    <span></span>
                                    {alertOptions.map((option) => (
                                        <ListOption option={option} />
                                    ))}
                                    <CustomOption />
                                </div>
                            </Listbox.Options>
                        </DropAnimation>
                    </>
                )}
            </Listbox>
        </div>
    )
}

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
                <div style={{ padding: '0 4px' }}>
                    <Radios options={[
                        { name: 'categoryType', value: 'month', label: 'Month', default: true },
                        { name: 'categoryType', value: 'year', label: 'Year' },
                    ]} />
                </div>
                {/* row */}
                <div className="responsive-inputs-row-container">
                    <div>
                        <label htmlFor="name">Name</label>
                        <div className="input-container" id="category-name-input-container">
                            <input
                                type="text"
                                name="emoji"
                                id="emoji-input"
                                placeholder="☺"
                                style={{ fontSize: '16px', padding: '0 4px 0 0' }}
                            />
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Category name"
                                {...register('name')}
                            />
                            {errors.name && <FormErrorTip />}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="limit" style={{ visibility: 'visible' }}>Limit</label>
                        <div className="input-container" id="limit-input-container">
                            <input
                                type="text"
                                name="upperLimit"
                                id="upperLimit"
                                placeholder="$0"
                                value={upperLimit}
                                size="4"
                                {...register('upperLimit')}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9.]/g, '')
                                    const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    setUpperLimit(`$${formattedValue}`)
                                }}
                                onBlur={(e) => e.target.value.length <= 1 && setUpperLimit('')}
                            />
                            {errors.upperLimit && <FormErrorTip />}
                        </div>
                    </div>
                </div>
                {/* row */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 4px',
                    }}
                >
                    <AddAlert limit={upperLimit} />
                    <Checkbox
                        label="Make private"
                        name="private"
                        id="private"
                        checked={false}
                    />
                </div>
                {/* row */}
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
