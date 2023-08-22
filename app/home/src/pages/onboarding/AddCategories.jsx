import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string } from "yup"

import './styles/AddCategories.css'
import Checkmark from '@assets/icons/Checkmark'
import Bell from '@assets/icons/Bell'
import BellOff from '@assets/icons/BellOff'
import Delete from '@assets/icons/Delete'
import Arrow from '@assets/icons/Arrow'
import { FormErrorTip } from '@components/pieces'
import { EmojiComboText, AddAlert, EvenDollarInput, PeriodSelect } from '@components/inputs'

const schema = object().shape({
    name: string().required(),
    limit: string().required(),
})

const BottomButtons = ({ saveDisabled, continueDisabled }) => {
    const navigate = useNavigate()

    return (
        <div
            className={`btn-container
                ${saveDisabled && continueDisabled ? 'disabled' : 'enabled'}`}
        >
            <button
                className="btn-grn btn3"
                id="connect-account-btn"
                aria-label="Add Category"
                style={{ visibility: saveDisabled ? 'hidden' : 'visible' }}
                disabled={saveDisabled}
                type="submit"
            >
                <span>Save Category</span>
                <Checkmark width={'.8em'} height={'.8em'} />
            </button>
            <button
                className={`btn-chcl btn3
                ${continueDisabled ? 'disabled' : 'enabled'}`}
                id="connect-account-btn"
                aria-label="Next"
                onClick={() => navigate('/welcome/add-bills')}
                disabled={continueDisabled}
            >
                Continue
                <Arrow
                    width={'.8em'}
                    height={'.8em'}
                    rotation={-90}
                    stroke={'var(--window)'}
                    onClick={() => navigate('/welcome/add-bills')}
                />
            </button>
        </div>
    )
}

const Form = ({ onSubmit, children }) => {
    const [emoji, setEmoji] = useState('')
    const [type, setType] = useState('month')
    const [dollarLimit, setDollarLimit] = useState('')
    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    })

    return (
        <form onSubmit={handleSubmit((data, e) => onSubmit(e))}>
            <div>
                <div>
                    <PeriodSelect value={type} setValue={setType} />
                </div>
                <div>
                    <EmojiComboText
                        name="name"
                        placeholder="Name"
                        emoji={emoji}
                        setEmoji={setEmoji}
                        register={register}
                    >
                        <FormErrorTip errors={[errors.name]} />
                    </EmojiComboText>
                </div>
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
            {children({ isValid })}
        </form>
    )
}

const CategoryColumn = ({ categories }) => {

    return (
        <div>
            {categories[0]?.period === 'month'
                ? <h4 className="spaced-header2">Month Categories</h4>
                : <h4 className="spaced-header2">Year Categories</h4>
            }
            <div className="budget-items-column">
                {categories.map((category, i) => (
                    <>
                        <div className="budget-item--container">
                            <div className="budget-item">
                                <span>{category.emoji}</span>
                                <span>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</span>
                            </div>
                        </div>
                        <div className="category-limit">
                            {`$${category.limit_amount / 100}`}
                        </div >
                        <div className="category-alerts" style={{ opacity: category.alerts.length > 0 ? '1' : '.5' }}>
                            {category.alerts.length > 0
                                ? <Bell numberOfAlerts={category.alerts.length} />
                                : <BellOff />}
                        </div>
                        <div className="delete-button--container">
                            <button
                                className={`btn delete-button show`}
                                aria-label="Remove"
                            >
                                <Delete width={'1.1em'} height={'1.1em'} />
                            </button>
                        </div>
                        <div className="line"></div>
                    </>
                ))}
            </div>
        </div>
    )
}

const AddCategories = () => {
    const [continueDisabled, setContinueDisabled] = useState(false)
    const [monthCategories, setMonthCategories] = useState([])
    const [yearCategories, setYearCategories] = useState([])

    useEffect(() => {
        if (monthCategories.length > 0 || yearCategories.length > 0) {
            setContinueDisabled(false)
        } else {
            setContinueDisabled(true)
        }
    }, [monthCategories, yearCategories])

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        let body = Object.fromEntries(formData)

        body.limit_amount = Number(body.limit.replace(/[^0-9]/g, '')) * 100
        delete body.limit
        body.name = body.name.toLowerCase()

        let alerts = []
        for (const [key, value] of Object.entries(body)) {
            if (key.includes('alert')) {
                alerts.push({ percent_amount: Number(value.replace(/[^0-9]/g, '')) })
                delete body[key]
            }
        }
        body.alerts = alerts

        if (body.period === 'month') {
            setMonthCategories([...monthCategories, body])
        } else {
            setYearCategories([...yearCategories, body])
        }
    }

    return (
        <div className="window2">
            <h2 className="spaced-header">Budget Categories</h2>
            <div id="budget-items-columns">
                {
                    monthCategories.length !== 0 &&
                    <CategoryColumn categories={monthCategories} />
                }
                {
                    yearCategories.length !== 0 &&
                    <CategoryColumn categories={yearCategories} />
                }
            </div>
            <Form onSubmit={handleSubmit} >
                {({ isValid }) => (
                    <BottomButtons
                        saveDisabled={!isValid}
                        continueDisabled={continueDisabled}
                    />
                )}
            </Form>
        </div>
    )
}

export default AddCategories
