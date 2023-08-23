import React, { useEffect, useState, useContext, useRef } from 'react'

import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { set, useForm } from "react-hook-form"
import { useTransition, animated } from '@react-spring/web'
import { Tab } from '@headlessui/react'
import { object, string } from "yup"

import './styles/AddCategories.css'
import Checkmark from '@assets/icons/Checkmark'
import Bell from '@assets/icons/Bell'
import BellOff from '@assets/icons/BellOff'
import Delete from '@assets/icons/Delete'
import Arrow from '@assets/icons/Arrow'
import { FormErrorTip, ShadowedContainer } from '@components/pieces'
import { EmojiComboText, AddAlert, EvenDollarInput, PeriodSelect } from '@components/inputs'
import { usePillAnimation } from '@utils/hooks'

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
    const [showSave, setShowSave] = useState(formIsValid)
    const [showContinue, setShowContinue] = useState(false)
    const { monthCategories, yearCategories } = useContext(CategoryContext)

    useEffect(() => {
        if (monthCategories.length > 0 || yearCategories.length > 0) {
            setShowContinue(true)
            setExpandContainer(true)
        } else {
            setShowContinue(false)
            setExpandContainer(false)
            setShowSave(false)
        }
    }, [monthCategories, yearCategories])

    useEffect(() => {
        if (formIsValid) {
            setExpandContainer(true)
            setShowSave(true)
        }
    }, [formIsValid])

    return (
        <div
            className={`btn-container ${expandContainer ? 'enabled' : ''}`}
        >
            <button
                className="btn-grn btn3"
                id="connect-account-btn"
                aria-label="Add Category"
                style={{ visibility: showSave ? 'visible' : 'hidden' }}
                disabled={!showSave}
                type="submit"
            >
                <span>Save Category</span>
                <Checkmark width={'.8em'} height={'.8em'} />
            </button>
            <button
                className="btn-chcl btn3"
                style={{ visibility: showContinue ? 'visible' : 'hidden' }}
                id="connect-account-btn"
                aria-label="Next"
                onClick={() => navigate('/welcome/add-bills')}
                disabled={!showContinue}
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
    const [dollarLimit, setDollarLimit] = useState('')
    const [alerts, setAlerts] = useState([])
    const { monthCategories, setMonthCategories, yearCategories, setYearCategories } = useContext(CategoryContext)

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    })

    const resetForm = () => {
        setEmoji('')
        setAlerts([])
        setDollarLimit('')
        reset()
    }

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

        resetForm()
    }

    return (
        <form onSubmit={handleSubmit((data, e) => submit(e))}>
            <div>
                <div>
                    <PeriodSelect />
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
                    <AddAlert
                        limit={dollarLimit}
                        alerts={alerts}
                        setAlerts={setAlerts}
                    />
                </div>
            </div>
            {children({ isValid })}
        </form>
    )
}

const CategoriesColumn = ({ categories }) => {
    const { setMonthCategories, setYearCategories, monthCategories, yearCategories } = useContext(CategoryContext)

    const transitions = useTransition(categories, {
        from: { opacity: 0, maxHeight: '0' },
        enter: { opacity: 1, maxHeight: '100px' },
        leave: { opacity: 0, maxHeight: '0' },
        config: { duration: 250 },
    })

    const handleDelete = (item) => {
        if (item.period === 'month') {
            setMonthCategories(monthCategories.filter((category) => category.name !== item.name))
        } else {
            setYearCategories(yearCategories.filter((category) => category.name !== item.name))
        }
    }

    const formatName = (name) => {

        return (
            name.split(' ').map((word) => {
                name.charAt(0).toUpperCase() + name.slice(1)
                return word.charAt(0).toUpperCase() + word.slice(1)
            }).join(' ')
        )
    }

    const getFlexBasis = (type) => {
        const longestMonthCategory = monthCategories.reduce((acc, curr) => {
            if (curr.name.length > acc) {
                return curr.name.length
            } else {
                return acc
            }
        }, 0)
        const longestYearCategory = yearCategories.reduce((acc, curr) => {
            if (curr.name.length > acc) {
                return curr.name.length
            } else {
                return acc
            }
        }, 0)

        return type === 'month' ? longestMonthCategory : longestYearCategory
    }

    return (
        <ShadowedContainer>
            <div className="budget-items--container">
                {transitions((style, item) =>
                    <animated.div
                        className="budget-item--container"
                        key={item.name}
                        style={style}
                    >
                        <div
                            style={{
                                flexBasis: `${getFlexBasis(item.period)}ch`,
                            }}
                        >
                            <div className="budget-item-name">
                                <span>{item.emoji}</span>
                                <span>{formatName(item.name)}</span>
                            </div>
                        </div>
                        <div >
                            {`$${item.limit_amount / 100}`}
                        </div >
                        <div >
                            <div style={{ opacity: item.alerts.length > 0 ? '1' : '.5' }}>
                                {item.alerts.length > 0
                                    ? <Bell numberOfAlerts={item.alerts.length} />
                                    : <BellOff />}
                            </div>
                        </div>
                        <div>
                            <button
                                className={`btn delete-button show`}
                                aria-label="Remove"
                                onClick={() => handleDelete(item)}
                            >
                                <Delete width={'1.1em'} height={'1.1em'} />
                            </button>
                        </div>
                    </animated.div>
                )}
            </div>
        </ShadowedContainer>
    )
}

const Categories = () => {
    const { monthCategories, yearCategories } = useContext(CategoryContext)
    const [tabView, setTabView] = useState(true)

    const handleResize = () => {
        if (window.innerWidth < 768) {
            setTabView(true)
        } else {
            setTabView(false)
        }
    }

    // When window gets smaller than 768px, switch to tab view
    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const ColumnView = () => (
        <>
            {(monthCategories.length !== 0 || yearCategories.length !== 0) &&
                <>
                    <div>
                        <h4 className="spaced-header2">Month</h4>
                        <CategoriesColumn categories={monthCategories} />
                    </div>
                    <div>
                        <h4 className="spaced-header2">Year</h4>
                        <CategoriesColumn categories={yearCategories} />
                    </div>
                </>
            }
        </>
    )

    const TabView = () => {
        const [selectedIndex, setSelectedIndex] = useState(0)
        const [updatePill, setUpdatePill] = useState(false)
        const tabListRef = useRef(null)

        const { props } = usePillAnimation({
            ref: tabListRef,
            update: [updatePill],
            refresh: [],
            querySelectall: '[role=tab]',
            find: (element) => {
                return element.getAttribute('data-headlessui-state') === 'selected'
            }
        })

        useEffect(() => {
            setUpdatePill(!updatePill)
        }, [selectedIndex])

        return (
            <>
                {(monthCategories.length !== 0 || yearCategories.length !== 0) &&
                    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                        <Tab.List className="tab-list--container" ref={tabListRef}>
                            <div className="tab-list">
                                {['Month', 'Year'].map((tab,) => (
                                    <Tab as={React.Fragment}>
                                        {({ selected }) => (
                                            <button
                                                className="btn-2slim"
                                                style={{
                                                    color: selected
                                                        ? 'var(--white-text)'
                                                        : 'var(--input-placeholder2)'
                                                }}
                                            >
                                                {tab}
                                            </button>
                                        )}
                                    </Tab>
                                ))}
                                <animated.span style={props} className="tab-list--pill" />
                            </div>
                        </Tab.List>
                        <Tab.Panels>
                            <Tab.Panel>
                                <CategoriesColumn categories={monthCategories} />
                            </Tab.Panel>
                            <Tab.Panel>
                                <CategoriesColumn categories={yearCategories} />
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                }
            </>
        )
    }

    return (
        <div className="budget-items-column--container">
            <div
                id="budget-items"
                className={`${(monthCategories.length !== 0 || yearCategories.length !== 0) ? 'expand' : ''}`}
            >
                {tabView ? <TabView /> : <ColumnView />}
            </div>
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
