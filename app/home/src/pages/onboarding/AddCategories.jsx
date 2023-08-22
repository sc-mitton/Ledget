import React, { useEffect, useState, useContext } from 'react'

import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { useTransition, animated } from '@react-spring/web'
import { object, string } from "yup"

import './styles/AddCategories.css'
import Checkmark from '@assets/icons/Checkmark'
import Bell from '@assets/icons/Bell'
import BellOff from '@assets/icons/BellOff'
import Delete from '@assets/icons/Delete'
import Arrow from '@assets/icons/Arrow'
import { FormErrorTip, ShadowedContainer } from '@components/pieces'
import { EmojiComboText, AddAlert, EvenDollarInput, PeriodSelect } from '@components/inputs'

const schema = object().shape({
    name: string().required(),
    limit: string().required(),
})

const CategoryContext = React.createContext()
const ContextProvider = ({ children }) => {
    const [monthCategories, setMonthCategories] = useState([])
    const [yearCategories, setYearCategories] = useState([])

    const vals = {
        monthCategories,
        setMonthCategories,
        yearCategories,
        setYearCategories,
    }

    return (
        <CategoryContext.Provider value={vals}>
            {children}
        </CategoryContext.Provider>
    )
}

const BottomButtons = ({ formIsValid }) => {
    const navigate = useNavigate()
    const [expandContainer, setExpandContainer] = useState(false)
    const [continueDisabled, setContinueDisabled] = useState(false)
    const { monthCategories, yearCategories } = useContext(CategoryContext)

    useEffect(() => {
        if (monthCategories.length > 0 || yearCategories.length > 0) {
            setContinueDisabled(false)
            setExpandContainer(true)
        } else {
            setContinueDisabled(true)
            setExpandContainer(false)
        }
    }, [monthCategories, yearCategories])

    useEffect(() => {
        formIsValid && setExpandContainer(true)
    }, [formIsValid])

    return (
        <div
            className={`btn-container ${expandContainer ? 'enabled' : ''}`}
        >
            <button
                className="btn-grn btn3"
                id="connect-account-btn"
                aria-label="Add Category"
                style={{ visibility: !formIsValid ? 'hidden' : 'visible' }}
                disabled={!formIsValid}
                type="submit"
            >
                <span>Save Category</span>
                <Checkmark width={'.8em'} height={'.8em'} />
            </button>
            <button
                className="btn-chcl btn3"
                style={{ visibility: continueDisabled ? 'hidden' : 'visible' }}
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

const Form = ({ children }) => {
    const [emoji, setEmoji] = useState('')
    const [type, setType] = useState('month')
    const [dollarLimit, setDollarLimit] = useState('')
    const { monthCategories, setMonthCategories, yearCategories, setYearCategories } = useContext(CategoryContext)

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    })

    const submit = (e) => {
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
        <form onSubmit={handleSubmit((data, e) => submit(e))}>
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

const CategoriesColumn = ({ categories }) => {
    const transitions = useTransition(categories, {
        from: { opacity: 0, maxHeight: '0px' },
        enter: { opacity: 1, maxHeight: '100px' },
        leave: { opacity: 0, maxHeight: '0px' },
    })

    return (
        <div className="budget-items-column--container">
            {categories[0]?.period === 'month'
                ? <h4 className="spaced-header2">Month</h4>
                : <h4 className="spaced-header2">Year</h4>
            }
            <ShadowedContainer>
                <table className="budget-items-table">
                    <tbody>
                        {transitions((style, item) =>
                            <animated.tr key={item.name} style={style}>
                                <td >
                                    <div className="budget-item">
                                        <span>{item.emoji}</span>
                                        <span>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
                                    </div>
                                </td>
                                <td >
                                    {`$${item.limit_amount / 100}`}
                                </td >
                                <td >
                                    <div style={{ opacity: item.alerts.length > 0 ? '1' : '.5' }}>
                                        {item.alerts.length > 0
                                            ? <Bell numberOfAlerts={item.alerts.length} />
                                            : <BellOff />}
                                    </div>
                                </td>
                                <td>
                                    <button
                                        className={`btn delete-button show`}
                                        aria-label="Remove"
                                    >
                                        <Delete width={'1.1em'} height={'1.1em'} />
                                    </button>
                                </td>
                            </animated.tr>
                        )}
                    </tbody>
                </table>
            </ShadowedContainer>
        </div>
    )
}

const Categories = () => {
    const { monthCategories, yearCategories } = useContext(CategoryContext)

    return (
        <div
            id="budget-items-columns"
            className={`${(monthCategories.length !== 0 || yearCategories.length !== 0) ? 'expand' : ''}`}
        >
            {
                monthCategories.length !== 0 &&
                <CategoriesColumn categories={monthCategories} />
            }
            {
                yearCategories.length !== 0 &&
                <CategoriesColumn categories={yearCategories} />
            }
        </div>

    )
}

const AddCategories = () => {

    return (
        <div className="window2">
            <h2 className="spaced-header">Budget Categories</h2>
            <Categories />
            <Form >
                {({ isValid }) => (
                    <BottomButtons
                        formIsValid={isValid}
                    />
                )}
            </Form>
        </div>
    )
}

const Enriched = () => (
    <ContextProvider>
        <AddCategories />
    </ContextProvider>
)

export default Enriched
