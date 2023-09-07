import React, { useContext, useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { Tab } from '@headlessui/react'
import { animated } from '@react-spring/web'

import './styles/Items.css'
import { ItemsProvider, ItemsContext } from './ItemsContext'
import {
    EmojiComboText,
    DollarRangeInput,
    PeriodSelect,
    BillScheduler,
    AddReminder,
    Checkbox
} from '@components/inputs'
import { ShadowedContainer, DollarCentsRange } from '@components/pieces'
import { Bell, BellOff } from '@assets/icons'
import { BottomButtons, TabView, RecommendationsButton } from './Reusables'
import { billSchema, extractBill } from '@modals/CreateBill'
import { DeleteButton } from '@components/buttons'
import { formatName, getLongestLength } from '@utils'
import { useGetBillRecommendationsQuery } from '@features/billSlice'
import { CloseButton } from '@ledget/shared-ui'

const BillsColumn = ({ period }) => {
    const context = useContext(ItemsContext)[period]
    const [nameFlexBasis, setNameFlexBasis] = useState('auto')
    const [amountFlexBasis, setAmountFlexBasis] = useState('auto')

    const {
        items,
        setItems,
        transitions,
        containerProps,
    } = context

    useEffect(() => {
        const longestNameLength = getLongestLength(context.items, 'name')
        setNameFlexBasis(`${longestNameLength + 1}ch`)

        const longestAmountLengths = {
            upper: getLongestLength(context.items, 'upper_amount'),
            lower: getLongestLength(context.items, 'lower_amount')
        }
        setAmountFlexBasis(`${longestAmountLengths.upper + longestAmountLengths.lower + 1}ch`)
    }, [items])

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
                    >
                        <div
                            className="budget-item-name--container"
                            style={{ flexBasis: nameFlexBasis }}
                        >
                            <div className="budget-item-name">
                                <span>{item.emoji}</span>
                                <span>{formatName(item.name)}</span>
                            </div>
                        </div>
                        <div
                            className="amount--container"
                            style={{ flexBasis: amountFlexBasis }}
                        >
                            <div
                                className="budget-dollar--container"
                                style={{
                                    width: `${getLongestLength(context.items, 'lower_amount')
                                        + getLongestLength(context.items, 'upper_amount') + 3
                                        }ch`
                                }}
                            >
                                <DollarCentsRange lower={item.lower_amount} upper={item.upper_amount} />
                            </div>
                        </div >
                        <div >
                            <div style={{ opacity: item.reminders.length > 0 ? '1' : '.5' }}>
                                {item.reminders.length > 0
                                    ? <Bell numberOfAlerts={item.reminders.length} />
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

const ListView = () => {
    const { year: { isEmpty: emptyYearItems } } = useContext(ItemsContext)

    return (
        <>
            <Tab.Panel>
                <BillsColumn period={'month'} />
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
                            <span> yearly bills yet...</span>
                        </div>
                        : <BillsColumn period={'year'} />
                }
            </Tab.Panel>
        </>
    )
}

const RecommendationsView = ({ recommendations }) => {
    const { isLoading, isError } = useGetBillRecommendationsQuery()
    const { setRecommendationsMode } = useContext(ItemsContext)
    const {
        month: { items: monthItems },
        year: { items: yearItems },
        setBufferItem,
    } = useContext(ItemsContext)

    return (
        <>
            <CloseButton
                onClick={() => setRecommendationsMode(false)}
                aria-label="Close recommendations"
            />
            <Tab.Panel>
                <div className="recommendations-container">
                    hello world
                </div>
            </Tab.Panel>
            <Tab.Panel>
                <div className="recommendations-container">
                    hello world
                </div>
            </Tab.Panel>
        </>
    )
}

const BillsList = () => {
    const { itemsEmpty, recommendationsMode } = useContext(ItemsContext)
    const { data: billRecommendations } = useGetBillRecommendationsQuery()

    return (
        <div
            id="budget-items--container"
            className={`${itemsEmpty ? '' : 'expand'}`}
        >
            <TabView>
                {recommendationsMode
                    ? <RecommendationsView recommendations={billRecommendations} />
                    : <ListView />
                }
            </TabView>
        </div>
    )
}

const Form = ({ children }) => {
    const { items: monthItems, setItems: setMonthItems } = useContext(ItemsContext).month
    const { items: yearItems, setItems: setYearItems } = useContext(ItemsContext).year

    const [period, setPeriod] = useState(null)
    const [scheduleMissing, setScheduleMissing] = useState(false)
    const [readyToSubmit, setReadyToSubmit] = useState(false)
    const [hasSchedule, setHasSchedule] = useState(false)

    const { register, watch, handleSubmit, reset, formState: { errors, isValid }, control } = useForm({
        resolver: yupResolver(billSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    })

    const submitForm = (e) => {
        const body = extractBill(e)
        if (body.errors) {
            body.errors.schedule && setScheduleMissing(true)
        }

        handleSubmit((data) => {
            if (body.errors) { return }

            const item = { ...body, ...data }
            if (body.period === 'month') {
                setMonthItems([...monthItems, item])
            } else {
                setYearItems([...yearItems, item])
            }
        })(e)

        reset()
    }

    useEffect(() => {
        if (hasSchedule && isValid) {
            setReadyToSubmit(true)
        } else {
            setReadyToSubmit(false)
        }
    }, [hasSchedule, isValid])

    return (
        <form
            onSubmit={submitForm}
            key={`create-bill-form-${monthItems.length}-${yearItems.length}}`}
        >
            <div>
                <div>
                    <PeriodSelect
                        value={period}
                        onChange={setPeriod}
                    />
                </div>
                <div>
                    <EmojiComboText
                        name="name"
                        placeholder="Name"
                        register={register}
                        error={[errors.name]}
                    />
                </div>
                <div id="bill-scheduler--container">
                    <BillScheduler
                        billPeriod={`${period}ly`}
                        error={scheduleMissing}
                        setHasSchedule={setHasSchedule}
                    />
                    <AddReminder />
                </div>
                <div>
                    <DollarRangeInput
                        rangeMode={watch('range', '')}
                        control={control}
                        errors={errors}
                    />
                    <Checkbox
                        label='Range'
                        name='range'
                        id="range"
                        aria-label='Change bill amount to a range.'
                        {...register('range')}
                    />
                </div>
            </div>
            {children(readyToSubmit)}
        </form>
    )
}

const Window = () => {
    const { itemsEmpty, recommendationsMode } = useContext(ItemsContext)

    return (
        <div className="window2" id="add-bills--window">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Bills</h2>
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
                    Add your monthly and yearly bills or click on the upper right icon for recommendations.
                </div>
            }
            {(itemsEmpty && !recommendationsMode) && <hr className="spaced-header" />}
            <BillsList />
            <Form >
                {(readyToSubmit) => (
                    <BottomButtons expanded={readyToSubmit || !itemsEmpty} />
                )}
            </Form>
        </div>
    )
}

const AddBills = () => (
    <ItemsProvider>
        <Window />
    </ItemsProvider>
)

export default AddBills
