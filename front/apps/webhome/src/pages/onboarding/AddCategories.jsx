import { useState, useContext, useEffect, useRef } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { Tab } from '@headlessui/react'
import { animated } from '@react-spring/web'

import './styles/Items.css'
import { CheckMark } from '@ledget/media'
import { BottomButtons, TabView, RecommendationsButton } from './Reusables'
import { ItemsProvider, ItemsContext } from './ItemsContext'
import { ShadowedContainer } from '@components/pieces'
import { DeleteButton, GripButton } from '@components/buttons'
import { EmojiComboText, LimitAmountInput, PeriodSelect } from '@components/inputs'
import { schema as categorySchema } from '@modals/CreateCategory'
import { monthRecommendations, yearRecommendations } from './categoryRecommendations'
import {
    formatName,
    formatRoundedCurrency,
    getLongestLength,
    shuffleArray,
    useSpringDrag,
    CloseButton,
    FormErrorTip
} from '@ledget/ui'
import { itemHeight, itemPadding } from './constants'

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

    const order = useRef(items.map((_, index) => index))

    const bind = useSpringDrag({
        order: order,
        api: api,
        onRest: (newOrder) => {
            setItems(newOrder.map((index) => items[index]))
        },
        style: {
            padding: itemPadding,
            size: itemHeight,
            axis: 'y',
        }
    })

    return (
        <ShadowedContainer style={{ height: 'auto' }}>
            <animated.div style={containerProps} >
                {transitions((style, item, state, index) => {
                    return (
                        <animated.div
                            className="budget-item category-item"
                            style={style}
                            {...bind(index)}
                        >
                            <GripButton />
                            <div
                                className="budget-item-name--container"
                                style={{ flexBasis: getLongestLength(context.items, 'name') + 6 }}
                            >
                                <div className="budget-item-name">
                                    <span>{item.emoji}</span>
                                    <span>{formatName(item.name)}</span>
                                </div>
                            </div>
                            <div >
                                <div className="budget-dollar--container">
                                    {`${formatRoundedCurrency(item.limit_amount)}`}
                                </div>
                            </div >
                            <DeleteButton onClick={() => handleDelete(item)} />
                        </animated.div>
                    )
                })}
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
                            <CheckMark
                                width={'.7em'}
                                height={'.7em'}
                                stroke={monthItems.some((item) => item.name === suggestion.name.toLowerCase())
                                    ? 'var(--white-text)' : 'currentColor'
                                }
                            />
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
                            <CheckMark
                                width={'.7em'}
                                height={'.7em'}
                                stroke={yearItems.some((item) => item.name === suggestion.name.toLowerCase())
                                    ? 'var(--white-text)' : 'currentColor'
                                }
                            />
                        </div>
                    ))}
                </div>
            </Tab.Panel>
        </>
    )
}

const ListView = () => {
    const {
        year: { isEmpty: emptyYearItems },
        month: { isEmpty: emptyMonthItems }
    } = useContext(ItemsContext)

    return (
        <>
            <Tab.Panel>
                {emptyMonthItems
                    ?
                    <div className="empty-message--container">
                        <span>Looks like you haven't added any</span><br />
                        <span>monthly categories yet...</span>
                    </div>
                    : <CategoriesColumn period={'month'} />
                }
            </Tab.Panel>
            <Tab.Panel>
                {emptyYearItems
                    ?
                    <div className="empty-message--container">
                        <span>Looks like you haven't added any</span><br />
                        <span>yearly categories yet...</span>
                    </div>
                    : <CategoriesColumn period={'year'} />
                }
            </Tab.Panel>
        </>
    )
}

const CategoriesList = () => {
    const {
        recommendationsMode,
        year: { isEmpty: emptyYearItems },
        month: { isEmpty: emptyMonthItems }
    } = useContext(ItemsContext)

    const StartPrompt = () => (
        <div className="start-prompt">
            Add some budget categories
        </div>
    )

    return (
        <div
            id="budget-items--container"
            className={`${!emptyYearItems && !emptyMonthItems ? '' : 'expand'}`}
        >
            {!recommendationsMode && (emptyYearItems && emptyMonthItems)
                ?
                <StartPrompt />
                :
                <TabView>
                    {recommendationsMode
                        ? <RecommendationsView />
                        : <ListView />
                    }
                </TabView>
            }
        </div>
    )
}

const Form = () => {
    const {
        month: { setItems: setMonthItems, items: monthItems },
        year: { setItems: setYearItems, items: yearItems },
        bufferItem,
        setBufferItem
    } = useContext(ItemsContext)
    const [formKey, setFormKey] = useState(Date.now())
    const [period, setPeriod] = useState('month')

    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm({
        resolver: yupResolver(categorySchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    })

    const submit = (data, e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        let body = Object.fromEntries(formData)
        body = { ...body, ...data }

        if (body.period === 'month') {
            setMonthItems((prev) => [...prev, body])
        } else {
            setYearItems((prev) => [...prev, body])
        }
    }

    useEffect(() => {
        let timeout = setTimeout(() => {
            reset()
            setFormKey(Date.now())
        }, 100)
        return () => clearTimeout(timeout)
    }, [monthItems, yearItems])

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

                <div className='split-row-inputs'>
                    <div>
                        <EmojiComboText
                            name="name"
                            placeholder="Name"
                            register={register}
                            error={[errors.name]}
                        />
                    </div>
                    <div>
                        <LimitAmountInput control={control}>
                            < FormErrorTip errors={[errors.limit_amount]} />
                        </LimitAmountInput>
                    </div>
                </div>
                <div
                    style={{
                        display: 'inline-flex',
                        flexDirection: 'column',
                        gap: '6px',
                        marginTop: "8px"
                    }}
                >
                    <div>
                        <PeriodSelect
                            labelPrefix={'Refresh'}
                            value={period}
                            onChange={setPeriod}
                        />
                    </div>
                </div>
            </div>
            <BottomButtons />
        </form>
    )
}

const Window = () => {
    const { recommendationsMode } = useContext(ItemsContext)

    return (
        <div className="window3" id="add-categories--window">
            <div>
                <h2>Budget Categories</h2>
                {!recommendationsMode && < RecommendationsButton />}
            </div>
            <CategoriesList />
            <Form />
        </div>
    )
}

export default function () {
    return (
        <ItemsProvider>
            <Window />
        </ItemsProvider>
    )
}
