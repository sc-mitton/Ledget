import { useRef, useState, useId, Fragment } from 'react'

import { animated } from '@react-spring/web'
import { Tab } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { TabView, BottomButtons } from './Reusables'
import { GripButton } from '@components/buttons'
import { EmojiComboText, LimitAmountInput, emoji } from '@components/inputs'
import {
    ShadowScrollDiv,
    useSpringDrag,
    BillCatLabel,
    DeleteButton,
    getLongestLength,
    DollarCents,
    FormErrorTip,
    IconButton,
    formatCurrency,
    makeIntCurrencyFromStr
} from '@ledget/ui'
import { Recommendations, Plus, CheckMark, Edit } from '@ledget/media'
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

    let order = useRef(items.map((item) => item.id))

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
        <ShadowScrollDiv>
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
                                    name={item?.name || ''}
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
                                            value={formatCurrency({ val: editValue || 0, withCents: false })}
                                            onChange={handleEditAmount}
                                            onFocus={() => setEditValue(item?.limit_amount || 0)}
                                            onBlur={() => finalizeEditAmountChange(index)}
                                            autoFocus={true}
                                        />
                                        : <><DollarCents value={item?.limit_amount || 0} withCents={false} />
                                            <Edit size={'.8em'} /></>}
                                </button>
                            </div >
                            <DeleteButton
                                show={true}
                                onClick={() => {
                                    if (period === 'month') {
                                        setMonthItems((prev) => prev.filter((i) => i !== item))
                                    } else {
                                        setYearItems((prev) => prev.filter((i) => i !== item))
                                    }
                                }}
                            />
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
    const id = useId()

    const {
        month: { setItems: setMonthItems, items: monthItems },
        year: { setItems: setYearItems, items: yearItems },
        periodTabIndex
    } = useItemsContext('category')

    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    })

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {

        handleSubmit((data) => {
            e.preventDefault()
            const item = {
                ...data,
                id: id + 1,
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
        <Tab.Panel
            as={'form'}
            onSubmit={submitForm}
            key={`create-category-form-${monthItems.length}-${yearItems.length}}`}
        >
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
                    <IconButton>
                        <CheckMark />
                    </IconButton>
                </div>
            </div>
        </Tab.Panel>
    )
}

const SuggestedTabPanel = () => {
    const {
        periodTabIndex,
        month: { items: monthItems, setItems: setMonthItems },
        year: { items: yearItems, setItems: setYearItems }
    } = useItemsContext('category')
    const id = useId()

    return (
        <Tab.Panel className="suggested-items--container" as='div'>
            {periodTabIndex === 0
                ? monthRecommendations.filter(r => !monthItems.find(i => i.name === r.name)).map((item) => {
                    return (
                        <BillCatLabel
                            as='button'
                            key={item.name}
                            name={item.name}
                            emoji={item.emoji}
                            color={periodTabIndex === 0 ? 'blue' : 'green'}
                            onClick={() => {
                                const newItem = {
                                    ...item,
                                    period: 'month',
                                    limit_amount: 100,
                                    id: id
                                } as const
                                setMonthItems((prev) => [...prev, newItem])
                            }}
                        />
                    )
                })
                : yearRecommendations.filter(r => !yearItems.find(i => i.name === r.name)).map((item) => {
                    return (
                        <BillCatLabel
                            as='button'
                            key={item.name}
                            name={item.name}
                            emoji={item.emoji}
                            color={periodTabIndex === 0 ? 'blue' : 'green'}
                            onClick={() => {
                                const newItem = {
                                    ...item,
                                    period: 'year',
                                    limit_amount: 100,
                                    id: id
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
        <Tab.Panels as={Fragment}>
            <SuggestedTabPanel />
            <CustomTabPanel />
        </Tab.Panels>
        <Tab.List className="custom-suggested-tabs">
            <Tab>
                Suggested
                <Recommendations fill={'currentColor'} />
            </Tab>
            <Tab>
                Custom
                <Plus size={'.8em'} />
            </Tab>
        </Tab.List>
    </Tab.Group>
)

export default function () {
    return (
        <ItemsProvider itemType="category">
            <div id="add-categories--window">
                <div>
                    <h1>Categories</h1>
                    <h3>Now let's add a few spending categories</h3>
                </div>
                <ListOfCategories />
                <AddSuggestedCustomCategories />
                <BottomButtons item={'category'} />
            </div>
        </ItemsProvider>
    )
}
