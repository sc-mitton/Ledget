import { useRef, useState, useEffect, Fragment } from 'react'

import { animated } from '@react-spring/web'
import { Tab } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit2, Check } from '@geist-ui/icons'

import { TabView, BottomButtons } from './Reusables'
import { EmojiComboText, LimitAmountInput, emoji } from '@components/inputs'
import {
    ShadowScrollDiv,
    useSpringDrag,
    BillCatLabel,
    DeleteButton,
    getLongestLength,
    DollarCents,
    FormErrorTip,
    IconButtonHalfGray,
    formatCurrency,
    makeIntCurrencyFromStr,
    TabNavListUnderlined,
    GripButton
} from '@ledget/ui'
import { useItemsContext, ItemsProvider, Period } from "./ItemsContext"
import { monthRecommendations, yearRecommendations } from './categoryRecommendations'

const itemHeight = 25
const itemPadding = 8

const CategoriesColumn = ({ period }: { period: Period }) => {
    const context = useItemsContext('category')
    const [editAmountIndex, setEditAmountIndex] = useState<number | boolean>(false)
    const [editValue, setEditValue] = useState<number>()

    const {
        items,
        transitions,
        containerProps,
        api
    } = period === 'month' ? context.month : context.year

    const {
        month: { setItems: setMonthItems },
        year: { setItems: setYearItems }
    } = useItemsContext('category')

    let order = useRef<string[]>([])

    useEffect(() => {
        order.current = items.map((item) => item.id)
    }, [items])

    const bind = useSpringDrag({
        order: order,
        api: api,
        onRest: (newOrder) => {
            // newOrder.map((itemId) => items.find((item) => item.id === itemId)))
            if (period === 'month') {
                setMonthItems(
                    (prev) => prev.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id)))
            } else {
                setYearItems(
                    (prev) => prev.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id)))
            }
        },
        style: {
            padding: itemPadding,
            size: itemHeight,
            axis: 'y',
        }
    })

    const handleEditAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = makeIntCurrencyFromStr(e.target.value)
        setEditValue(newVal)
    }

    const finalizeEditAmountChange = (index: number) => {
        if (period === 'month' && editValue) {
            setMonthItems((prev) => {
                const newItems = [...prev]
                newItems[index].limit_amount = editValue
                return newItems
            })
        } else if (editValue) {
            setYearItems((prev) => {
                const newItems = [...prev]
                newItems[index].limit_amount = editValue
                return newItems
            })
        }
        setEditAmountIndex(false)
    }

    return (
        <ShadowScrollDiv
            style={{
                overflowY: items.length > 6 ? 'auto' : 'hidden',
                overflowX: 'hidden'
            }}
        >
            <animated.div style={containerProps} >
                {transitions((style, item, _, index) => {
                    return (
                        <animated.div
                            className="budget-item category-item"
                            style={style}
                            {...bind(item?.id)}
                        >
                            <GripButton />
                            <div
                                className="budget-item-name--container"
                                style={{ flexBasis: getLongestLength(items, 'name') + 6 }}
                            >
                                <BillCatLabel
                                    labelName={item?.name || ''}
                                    emoji={item?.emoji}
                                    slim={true}
                                    color={period === 'month' ? 'blue' : 'green'}
                                    hoverable={false}
                                />
                            </div>
                            <div >
                                <button
                                    className="budget-dollar--container"
                                    onClick={() => setEditAmountIndex(index)}
                                >
                                    {editAmountIndex === index
                                        ? <input
                                            value={formatCurrency(editValue || 0, false)}
                                            onChange={handleEditAmount}
                                            onFocus={() => setEditValue(item?.limit_amount || 0)}
                                            onBlur={() => finalizeEditAmountChange(index)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    finalizeEditAmountChange(index)
                                                }
                                            }}
                                            autoFocus={true}
                                        />
                                        : <><DollarCents value={item?.limit_amount || 0} withCents={false} />
                                            <Edit2 size={'1em'} /></>}
                                </button>
                            </div >
                            <div>
                                <DeleteButton
                                    visible={true}
                                    onClick={() => {
                                        if (period === 'month') {
                                            setMonthItems((prev) => prev.filter((i) => i !== item))
                                        } else {
                                            setYearItems((prev) => prev.filter((i) => i !== item))
                                        }
                                    }}
                                />
                            </div>
                        </animated.div>
                    )
                })}
            </animated.div>
        </ShadowScrollDiv>
    )
}

const ListOfCategories = () => {
    const {
        year: { isEmpty: emptyYearItems },
        month: { isEmpty: emptyMonthItems }
    } = useItemsContext('category')

    return (
        <TabView item='category'>
            <Tab.Panel as={Fragment}>
                {emptyMonthItems
                    ?
                    <div className="empty-message--container">
                        <span>No monthly categories added yet</span>
                    </div>
                    : <CategoriesColumn period={'month'} />
                }
            </Tab.Panel>
            <Tab.Panel as={Fragment}>
                {emptyYearItems
                    ?
                    <div className="empty-message--container">
                        <span>No yearly categories added yet</span>
                    </div>
                    : <CategoriesColumn period={'year'} />
                }
            </Tab.Panel>
        </TabView>
    )
}

const categorySchema = z.object({
    name: z.string().min(1, { message: 'Category name required.' }),
    limit_amount: z.number().min(1, { message: 'Limit amount required.' })
})

const CustomTabPanel = () => {
    const [emoji, setEmoji] = useState<emoji>()

    const {
        month: { setItems: setMonthItems, items: monthItems },
        year: { setItems: setYearItems, items: yearItems },
        periodTabIndex
    } = useItemsContext('category')

    const { register, handleSubmit, reset, formState: { errors }, control } = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    })

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {

        handleSubmit((data) => {
            e.preventDefault()
            const item = {
                ...data,
                id: Math.random().toString(36).slice(2),
                emoji: typeof emoji === 'string' ? emoji : emoji?.native
            }

            if (periodTabIndex === 0) {
                setMonthItems((prev) => [...prev, { ...item, period: 'month' }])
            } else {
                setYearItems((prev) => [...prev, { ...item, period: 'year' }])
            }
            reset()
            setEmoji(undefined)
        })(e)
    }

    return (
        <Tab.Panel key={`create-category-form-${monthItems.length}-${yearItems.length}}`}>
            <form onSubmit={submitForm}>
                <div>
                    <div>
                        <EmojiComboText
                            hasLabel={false}
                            name="name"
                            placeholder="Name"
                            register={register}
                            emoji={emoji}
                            setEmoji={setEmoji}
                            error={errors.name}
                        />
                    </div>
                    <div>
                        <LimitAmountInput control={control} hasLabel={false} withCents={false} >
                            <FormErrorTip error={errors.limit_amount} />
                        </LimitAmountInput>
                    </div>
                    <div>
                        <IconButtonHalfGray><Check className="icon" /></IconButtonHalfGray>
                    </div>
                </div>
            </form>
        </Tab.Panel>
    )
}

const SuggestedTabPanel = () => {
    const {
        periodTabIndex,
        month: { items: monthItems, setItems: setMonthItems },
        year: { items: yearItems, setItems: setYearItems }
    } = useItemsContext('category')

    return (
        <Tab.Panel className="suggested-items--container" as='div'>
            {periodTabIndex === 0
                ? monthRecommendations.filter(r => !monthItems.find(i => i.name === r.name)).map((item, index) => {
                    return (
                        <BillCatLabel
                            as='button'
                            key={item.name}
                            labelName={item.name}
                            emoji={item.emoji}
                            color={periodTabIndex === 0 ? 'blue' : 'green'}
                            onClick={() => {
                                const newItem = {
                                    ...item,
                                    period: 'month',
                                    limit_amount: 100,
                                    id: Math.random().toString(36).slice(2)
                                } as const
                                setMonthItems((prev) => [...prev, newItem])
                            }}
                        />
                    )
                })
                : yearRecommendations.filter(r => !yearItems.find(i => i.name === r.name)).map((item, index) => {
                    return (
                        <BillCatLabel
                            as='button'
                            key={item.name}
                            labelName={item.name}
                            emoji={item.emoji}
                            color={periodTabIndex === 0 ? 'blue' : 'green'}
                            onClick={() => {
                                const newItem = {
                                    ...item,
                                    period: 'year',
                                    limit_amount: 100,
                                    id: Math.random().toString(36).slice(2)
                                } as const
                                setYearItems((prev) => [...prev, newItem])
                            }}
                        />
                    )
                })
            }
        </Tab.Panel>
    )
}

const AddSuggestedCustomCategories = () => (
    <Tab.Group as='div'>
        {({ selectedIndex }) => (
            <>
                <TabNavListUnderlined selectedIndex={selectedIndex}>
                    <Tab>Suggested</Tab>
                    <Tab>Custom</Tab>
                </TabNavListUnderlined>
                <Tab.Panels as={Fragment}>
                    <SuggestedTabPanel />
                    <CustomTabPanel />
                </Tab.Panels>
            </>
        )}
    </Tab.Group>
)

export default function () {
    return (
        <ItemsProvider itemType="category">
            <div id="add-categories--window">
                <div>
                    <h2>Categories</h2>
                    <span>Now let's add a few spending categories</span>
                </div>
                <ListOfCategories />
                <AddSuggestedCustomCategories />
                <BottomButtons item={'category'} />
            </div>
        </ItemsProvider>
    )
}
