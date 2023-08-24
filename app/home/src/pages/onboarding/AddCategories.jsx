import React, { useEffect, useState, useContext, useRef } from 'react'

import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { Tab } from '@headlessui/react'
import { object, string } from "yup"
import { useDrag } from 'react-use-gesture'
import { useTransition, useSpring, animated, useSpringRef, useChain } from '@react-spring/web'
import clamp from 'lodash.clamp'
import swap from 'lodash-move'

import './styles/AddCategories.css'
import Checkmark from '@assets/icons/Checkmark'
import Bell from '@assets/icons/Bell'
import BellOff from '@assets/icons/BellOff'
import Delete from '@assets/icons/Delete'
import Arrow from '@assets/icons/Arrow'
import Grip from '@assets/icons/Grip'
import { FormErrorTip, ShadowedContainer } from '@components/pieces'
import { EmojiComboText, AddAlert, EvenDollarInput, PeriodSelect } from '@components/inputs'
import { usePillAnimation } from '@utils/hooks'

const schema = object().shape({
    name: string().required(),
    limit: string().required(),
})

const transitionConfig = {
    from: () => ({ opacity: 0 }),
    enter: (item, index) => ({ opacity: 1, y: index * (itemHeight + itemPadding) }),
    update: (item, index) => ({ y: index * (itemHeight + itemPadding) }),
    leave: () => ({ opacity: 0 }),
    config: { duration: 200 },
}

const itemHeight = 25
const itemPadding = 8
const fn = (categories, active = false, originalIndex, curIndex = 0, y = 0) => (index, item) =>
    active && item.item === originalIndex
        ? {
            y: curIndex * (itemHeight + itemPadding) + y,
            zIndex: 1,
            opacity: 1,
            immediate: (key) => key === 'y' || key === 'zIndex',
        }
        : {
            y: categories.indexOf(item.item) * (itemHeight + itemPadding),
            scale: 1,
            zIndex: 0,
            opacity: 1,
            immediate: false,
        }

const CategoryContext = React.createContext()
const ContextProvider = ({ children }) => {
    const [monthCategories, setMonthCategories] = useState([])
    const [yearCategories, setYearCategories] = useState([])
    const [yearFlexBasis, setYearFlexBasis] = useState(0)
    const [monthFlexBasis, setMonthFlexBasis] = useState(0)
    const [categoriesNotEmpty, setCategoriesNotEmpty] = useState(true)
    const monthApi = useSpringRef()
    const yearApi = useSpringRef()
    const monthContainerApi = useSpringRef()
    const yearContainerApi = useSpringRef()

    const getFlexBasis = (categories) => {
        const val = categories.reduce((acc, curr) => {
            if (curr.name.length > acc) {
                return curr.name.length
            } else {
                return acc
            }
        }, 0)
        return val
    }

    const updateFlexiBasis = (period) => {
        if (period === 'month') {
            const monthFlexBasis = getFlexBasis(monthCategories)
            setMonthFlexBasis(`${monthFlexBasis}ch`)
        } else {
            const yearFlexBasis = getFlexBasis(yearCategories)
            setYearFlexBasis(`${yearFlexBasis}ch`)
        }
    }

    const monthTransitions = useTransition(
        monthCategories,
        {
            ...transitionConfig,
            config: { duration: 100 },
            ref: monthApi
        }
    )
    const yearTransitions = useTransition(
        yearCategories,
        {
            ...transitionConfig,
            config: { duration: 100 },
            ref: yearApi
        }
    )
    const monthContainerProps = useSpring({
        height: monthCategories.length * (itemHeight + itemPadding),
        maxHeight: 6 * (itemHeight + itemPadding),
        ref: monthContainerApi,
        config: { duration: 100 },
        position: 'relative',
        overflowX: 'hidden',
        marginTop: '12px',
        overflowY: monthCategories.length >= 6 ? 'scroll' : 'hidden',
    })
    const yearContainerProps = useSpring({
        height: yearCategories.length * (itemHeight + itemPadding),
        maxHeight: 6 * (itemHeight + itemPadding),
        ref: yearContainerApi,
        position: 'relative',
        overflowX: 'hidden',
        marginTop: '12px',
        overflowY: yearCategories.length >= 6 ? 'scroll' : 'hidden',
        config: { duration: 100 },
    })

    useChain([monthApi, monthContainerApi], [0, 0])
    useChain([yearApi, yearContainerApi,], [0, 0])

    useEffect(() => {
        monthApi.start()
        updateFlexiBasis('month')
        monthContainerApi.start()
    }, [monthCategories])

    useEffect(() => {
        yearApi.start()
        updateFlexiBasis('year')
        yearContainerApi.start()
    }, [yearCategories])

    useEffect(() => {
        if (monthCategories.length > 0 || yearCategories.length > 0) {
            setCategoriesNotEmpty(true)
        } else {
            setCategoriesNotEmpty(false)
        }
    }, [monthCategories, yearCategories])

    const vals = {
        monthCategories,
        setMonthCategories,
        yearCategories,
        setYearCategories,
        yearFlexBasis,
        monthFlexBasis,
        yearTransitions,
        yearApi,
        monthTransitions,
        monthApi,
        categoriesNotEmpty,
        yearContainerApi,
        yearContainerProps,
        monthContainerApi,
        monthContainerProps
    }

    return (
        <CategoryContext.Provider value={vals}>
            {children}
        </CategoryContext.Provider>
    )
}

const CategoriesColumn = ({ period }) => {
    let categories, setCategories, flexBasis, transitions, api, containerProps
    const context = useContext(CategoryContext)

    if (period === 'month') {
        categories = context.monthCategories
        setCategories = context.setMonthCategories
        flexBasis = context.monthFlexBasis
        transitions = context.monthTransitions
        api = context.monthApi
        containerProps = context.monthContainerProps
    } else {
        categories = context.yearCategories
        setCategories = context.setYearCategories
        flexBasis = context.yearFlexBasis
        transitions = context.yearTransitions
        api = context.yearApi
        containerProps = context.yearContainerProps
    }

    const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
        if (!document.activeElement.getAttribute('draggable-item')) {
            return
        }

        const curIndex = categories.indexOf(originalIndex)
        const curRow = clamp(Math.round((curIndex * itemHeight + y) / itemHeight), 0, categories.length - 1)
        const newCategories = swap(categories, curIndex, curRow)
        api.start(fn(newCategories, active, originalIndex, curIndex, y))
        if (!active) setCategories(newCategories)
    })

    const handleDelete = (toDelete) => {
        setCategories(categories.filter((category) => category !== toDelete))
    }

    const formatName = (name) => (
        name.split(' ').map((word) => {
            name.charAt(0).toUpperCase() + name.slice(1)
            return word.charAt(0).toUpperCase() + word.slice(1)
        }).join(' ')
    )

    return (
        <ShadowedContainer style={{ height: 'auto' }}>
            <animated.div style={containerProps} >
                {transitions((style, item, index) =>
                    <animated.div
                        className="budget-item"
                        style={style}
                        {...bind(item)}
                    >
                        <div
                            className="budget-item-name--container"
                            style={{ flexBasis: flexBasis }}
                        >
                            <button
                                className="btn grip-btn"
                                aria-label="Move"
                                draggable-item="true"
                            >
                                <Grip />
                            </button>
                            <div className="budget-item-name">
                                <span>{item.emoji}</span>
                                <span>{formatName(item.name)}</span>
                            </div>
                        </div>
                        <div >
                            {`$${item.limit_amount / 100}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
                                className={`btn delete-button-show`}
                                aria-label="Remove"
                                onClick={() => handleDelete(item)}
                            >
                                <Delete width={'1.1em'} height={'1.1em'} />
                            </button>
                        </div>
                    </animated.div>
                )}
            </animated.div>
        </ShadowedContainer>
    )
}

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
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="tab-list--container" ref={tabListRef}>
                <div className="tab-list">
                    {['Month', 'Year'].map((tab, i) => (
                        <Tab key={i} as={React.Fragment}>
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
                    <CategoriesColumn period={'month'} />
                </Tab.Panel>
                <Tab.Panel>
                    <CategoriesColumn period={'year'} />
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    )
}

const ColumnView = () => {

    return (
        <>
            <div>
                <h4 className="spaced-header2">Month</h4>
                <CategoriesColumn period={'month'} />
            </div>
            <div>
                <h4 className="spaced-header2">Year</h4>
                <CategoriesColumn period={'year'} />
            </div>
        </>
    )
}

const Categories = () => {
    const [tabView, setTabView] = useState(true)
    const { categoriesNotEmpty } = useContext(CategoryContext)

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

    return (
        <div
            id="budget-items--container"
            className={`${categoriesNotEmpty ? 'expand' : ''}`}
        >
            {categoriesNotEmpty &&
                <>
                    {tabView ? <TabView /> : <ColumnView />}
                </>
            }
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

const BottomButtons = ({ formIsValid }) => {
    const navigate = useNavigate()
    const { categoriesNotEmpty } = useContext(CategoryContext)

    return (
        <div
            className='btn-container-enabled'
        >
            <button
                className="btn-grn btn3"
                id="connect-account-btn"
                aria-label="Add Category"
                type="submit"
            >
                <span>Save Category</span>
                <Checkmark width={'.8em'} height={'.8em'} />
            </button>
            <button
                className="btn-chcl btn3"
                style={{ visibility: categoriesNotEmpty ? 'visible' : 'hidden' }}
                id="connect-account-btn"
                aria-label="Next"
                onClick={() => navigate('/welcome/add-bills')}
                disabled={!categoriesNotEmpty}
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
