import React, { useState, useContext, useEffect } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { Tab } from '@headlessui/react'
import { animated } from '@react-spring/web'

import './styles/Items.css'
import { BottomButtons, TabView, RecommendationsButton } from './Reusables'
import { ItemsProvider, ItemsContext } from './ItemsContext'
import { useItemsDrag } from './hooks'
import { Bell, BellOff, Grip, CheckMark } from '@assets/icons'
import { ShadowedContainer, FormErrorTip } from '@components/pieces'
import { DeleteButton, CloseButton } from '@components/buttons'
import { EmojiComboText, AddAlert, LimitAmountInput, PeriodSelect } from '@components/inputs'
import { formatName, formatRoundedCurrency, getLongestLength } from '@utils'
import { schema as categorySchema } from '@modals/CreateCategory'
import { monthRecommendations, yearRecommendations } from './categoryRecommendations'
import { shuffleArray } from '@utils'

const yearRecommendationsIndexes = Array.from({ length: yearRecommendations.length - 1 }, (_, i) => i + 1)
const monthRecommendationsIndexes = Array.from({ length: monthRecommendations.length - 1 }, (_, i) => i + 1)
const yearAnimationOrder = shuffleArray(yearRecommendationsIndexes)
const monthAnimationOrder = shuffleArray(monthRecommendationsIndexes)

const CategoriesColumn = ({ period }) => {
    const context = useContext(ItemsContext)[period]

    const {
        items,
        setItems,
        transitions,
        api,
        containerProps,
    } = context

    const bind = useItemsDrag(items, setItems, api)

    const handleDelete = (toDelete) => {
        setItems(items.filter((category) => category !== toDelete))
    }

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
                            style={{ flexBasis: getLongestLength(context.items, 'name') }}
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
                            <div
                                className="budget-dollar--container"
                                style={{ width: `${getLongestLength(context.items, 'limit_amount')}ch` }}
                            >
                                {`${formatRoundedCurrency(item.limit_amount)}`}
                            </div>
                        </div >
                        <div >
                            <div style={{ opacity: item.alerts.length > 0 ? '1' : '.5' }}>
                                {item.alerts.length > 0
                                    ? <Bell numberOfAlerts={item.alerts.length} />
                                    : <BellOff />}
                            </div>
                        </div>
                        <DeleteButton onClick={() => handleDelete(item)} />
                    </animated.div>
                )}
            </animated.div>
        </ShadowedContainer>
    )
}

const RecommendationsView = () => {
    const { setRecommendationsMode } = useContext(ItemsContext)
    const {
        month: { items: monthItems },
        year: { items: yearItems },
        setBufferItem,
    } = useContext(ItemsContext)

    const handleClick = (e, type) => {
        e.preventDefault()
        let target = e.target;
        // If the target is the checkmark, use the parent element instead
        if (target.tagName === 'svg' || target.tagName === 'path') {
            target = target.parentElement;
        }

        if (monthItems.some((item) => item.name === target.innerText.toLowerCase()) ||
            yearItems.some((item) => item.name === target.innerText.toLowerCase())) {
            return
        }

        setBufferItem({
            period: type,
            name: type === 'month'
                ? monthRecommendations[target.getAttribute('item-number')].name
                : yearRecommendations[target.getAttribute('item-number')].name,
            emoji: type === 'month'
                ? monthRecommendations[target.getAttribute('item-number')].emoji
                : yearRecommendations[target.getAttribute('item-number')].emoji
        })
    }

    return (
        <>
            <CloseButton
                onClick={() => setRecommendationsMode(false)}
                aria-label="Close recommendations"
            />
            <Tab.Panel>
                <div className="recommendations-container">
                    {monthRecommendations.map((suggestion, index) => (
                        <div
                            key={`month-suggestion-${index}`}
                            className={`budget-item-name
                                ${monthItems.some((item) => item.name === suggestion.name.toLowerCase())
                                    ? 'selected' : 'unselected'}`}
                            style={{ '--animation-order': monthAnimationOrder[index] }}
                            onClick={(e) => handleClick(e, 'month')}
                            role='button'
                            item-number={index}
                        >
                            {`${suggestion.emoji} ${suggestion.name}`}
                            <CheckMark width={'.7em'} height={'.7em'} />
                        </div>
                    ))}
                </div>
            </Tab.Panel>
            <Tab.Panel>
                <div className="recommendations-container">
                    {yearRecommendations.map((suggestion, index) => (
                        <div
                            key={`year-suggestion-${index}`}
                            className={`budget-item-name
                                ${yearItems.some((item) => item.name === suggestion.name.toLowerCase())
                                    ? 'selected' : 'unselected'} `}
                            style={{ '--animation-order': yearAnimationOrder[index] }}
                            onClick={(e) => handleClick(e, 'year')}
                            role='button'
                            item-number={index}
                        >
                            {`${suggestion.emoji} ${suggestion.name}`}
                            <CheckMark width={'.7em'} height={'.7em'} />
                        </div>
                    ))}
                </div>
            </Tab.Panel>
        </>
    )
}

const ListView = () => {
    const { year: { isEmpty: emptyYearItems } } = useContext(ItemsContext)

    return (
        <>
            <Tab.Panel>
                <CategoriesColumn period={'month'} />
            </Tab.Panel>
            <Tab.Panel>
                {
                    emptyYearItems
                        ?
                        <div
                            style={{
                                margin: '24px 0 16px 0',
                                textAlign: 'center',
                                fontWeight: '500',
                                opacity: '.4'
                            }}
                        >
                            <span>Looks you haven't added any</span><br />
                            <span> yearly categories yet...</span>
                        </div>
                        : <CategoriesColumn period={'year'} />
                }
            </Tab.Panel>
        </>
    )
}

const CategoriesList = () => {
    const { itemsEmpty, recommendationsMode } = useContext(ItemsContext)

    return (
        <div
            id="budget-items--container"
            className={`${(itemsEmpty && !recommendationsMode) ? '' : 'expand'}`}
        >
            <TabView>
                {recommendationsMode ? <RecommendationsView /> : <ListView />}
            </TabView>
        </div>
    )
}

const Form = ({ children }) => {
    const [readyToSubmit, setReadyToSubmit] = useState(false)
    const {
        month: { setItems: setMonthItems },
        year: { setItems: setYearItems },
        bufferItem,
        setBufferItem
    } = useContext(ItemsContext)
    const [formKey, setFormKey] = useState(Date.now())
    const [emoji, setEmoji] = useState('')
    const [period, setPeriod] = useState('month')

    const { register, watch, handleSubmit, reset, setValue, formState: { errors, isValid }, control } = useForm({
        resolver: yupResolver(categorySchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    })

    useEffect(() => {
        isValid && setReadyToSubmit(true)
    }, [isValid])

    const submit = (data, e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        let body = Object.fromEntries(formData)
        body = { ...body, ...data }

        // Extract alerts
        let alerts = []
        for (const [key, value] of Object.entries(body)) {
            if (key.includes('alert')) {
                alerts.push({ percent_amount: Number(value.replace(/[^0-9]/g, '')) })
                delete body[key]
            }
        }
        body.alerts = alerts
        if (body.period === 'month') {
            setMonthItems((prev) => [...prev, body])
        } else {
            setYearItems((prev) => [...prev, body])
        }

        reset()
        setFormKey(Date.now())
        setEmoji('')
    }

    useEffect(() => {
        if (bufferItem) {
            setValue('name', bufferItem.name)
            setEmoji({ 'native': bufferItem.emoji })
            setPeriod(bufferItem.period)
        }
        setBufferItem(undefined)
    }, [bufferItem])

    return (
        <form
            onSubmit={handleSubmit((data, e) => submit(data, e))}
            key={`create-category-form-${formKey}`}
        >
            <div>
                <div>
                    <PeriodSelect value={period} onChange={setPeriod} />
                </div>
                <div>
                    <EmojiComboText
                        name="name"
                        placeholder="Name"
                        register={register}
                        error={[errors.name]}
                        emoji={emoji}
                        setEmoji={setEmoji}
                    />
                </div>
                <div>
                    <LimitAmountInput control={control}>
                        < FormErrorTip errors={[errors.limit_amount]} />
                    </LimitAmountInput>
                </div>
                <div>
                    <AddAlert limitAmount={watch('limit_amount', '')} />
                </div>
            </div>
            {children(readyToSubmit)}
        </form>
    )
}

const Window = () => {
    const { itemsEmpty, recommendationsMode, setRecommendationsMode } = useContext(ItemsContext)

    return (
        <div className="window2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Budget Categories</h2>
                {!recommendationsMode && < RecommendationsButton />}
            </div>
            {(itemsEmpty && !recommendationsMode) &&
                <div
                    className=" body"
                    style={{
                        marginTop: '12px',
                        maxWidth: '350px'
                    }}
                >
                    Add your personalized categories or click on the upper right icon for recommendations.
                </div>
            }
            {(itemsEmpty && !recommendationsMode) && <hr className="spaced-header" />}
            <CategoriesList />
            <Form >
                {(readyToSubmit) => (
                    <BottomButtons expanded={readyToSubmit || !itemsEmpty} />
                )}
            </Form>
        </div>
    )
}

const AddCategories = () => {

    return (
        <ItemsProvider>
            <Window />
        </ItemsProvider>
    )
}

export default AddCategories
