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
    BillScheduler
} from '@components/inputs'
import { ShadowedContainer, DollarCentsRange } from '@components/pieces'
import { BottomButtons, TabView, RecommendationsButton } from './Reusables'
import { billSchema, extractBill } from '@modals/CreateBill'
import { DeleteButton } from '@components/buttons'
import { formatName, getLongestLength } from '@ledget/utils'
import { useGetBillRecommendationsQuery } from '@features/billSlice'
import { CloseButton, Checkbox } from '@ledget/ui'

const BillsColumn = ({ period }) => {
    const context = useContext(ItemsContext)[period]
    const [nameFlexBasis, setNameFlexBasis] = useState('auto')

    const {
        items,
        setItems,
        transitions,
        containerProps,
    } = context

    useEffect(() => {
        const longestNameLength = getLongestLength(context.items, 'name')
        setNameFlexBasis(`${longestNameLength + 1}ch`)
    }, [items])

    const handleDelete = (toDelete) => {
        setItems(items.filter((category) => category !== toDelete))
    }

    return (
        <ShadowedContainer style={{ height: 'auto' }}>
            <animated.div style={containerProps} >
                {transitions((style, item, index) =>
                    <animated.div
                        className="budget-item bill-item"
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
                        <div className="amount--container">
                            <div className="budget-dollar--container">
                                <DollarCentsRange lower={item.lower_amount} upper={item.upper_amount} />
                            </div>
                        </div >
                        <DeleteButton onClick={() => handleDelete(item)} />
                    </animated.div>
                )}
            </animated.div>
        </ShadowedContainer>
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
                {(emptyMonthItems)
                    ?
                    <div className="empty-message--container">
                        <span>Looks like you haven't added any</span><br />
                        <span>monthly bills yet...</span>
                    </div>
                    : <BillsColumn period={'month'} />}
            </Tab.Panel>
            <Tab.Panel>
                {(emptyYearItems)
                    ?
                    <div className="empty-message--container">
                        <span>Looks like you haven't added any</span><br />
                        <span>yearly bills yet...</span>
                    </div>
                    : <BillsColumn period={'year'} />}
            </Tab.Panel>
        </>
    )
}

const RecommendationsView = () => {
    const { isLoading, isError } = useGetBillRecommendationsQuery()
    const { setRecommendationsMode } = useContext(ItemsContext)
    const {
        month: { items: monthItems },
        year: { items: yearItems },
        setBufferItem,
    } = useContext(ItemsContext)
    const { data: billRecommendations } = useGetBillRecommendationsQuery()

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
    const {
        recommendationsMode,
        year: { isEmpty: emptyYearItems },
        month: { isEmpty: emptyMonthItems }
    } = useContext(ItemsContext)

    const StartPrompt = () => (
        <div className="start-prompt">
            Add some of your bills to get started
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
                    {recommendationsMode ? <RecommendationsView /> : <ListView />}
                </TabView>
            }
        </div>
    )
}

const Form = () => {
    const { items: monthItems, setItems: setMonthItems } = useContext(ItemsContext).month
    const { items: yearItems, setItems: setYearItems } = useContext(ItemsContext).year

    const [period, setPeriod] = useState(null)
    const [scheduleMissing, setScheduleMissing] = useState(false)
    const [hasSchedule, setHasSchedule] = useState(false)

    const { register, watch, handleSubmit, reset, formState: { errors }, control } = useForm({
        resolver: yupResolver(billSchema),
        mode: 'onSubmit', reValidateMode: 'onChange'
    })

    const submitForm = (e) => {
        const body = extractBill(e)
        if (body.errors) {
            body.errors.schedule && setScheduleMissing(true)
        }

        handleSubmit((data) => {
            if (!hasSchedule || body.errors) { return }

            const item = { ...body, ...data }
            if (body.period === 'month') {
                setMonthItems([...monthItems, item])
            } else {
                setYearItems([...yearItems, item])
            }
        })(e)
    }

    useEffect(() => { hasSchedule && setScheduleMissing(false) }, [hasSchedule])

    useEffect(() => {
        let timeout = setTimeout(() => {
            reset()
            setScheduleMissing(false)
        }, 100)
        return () => clearTimeout(timeout)
    }, [monthItems, yearItems])

    return (
        <form
            onSubmit={submitForm}
            key={`create-bill-form-${monthItems.length}-${yearItems.length}}`}
        >
            <div>
                <label>Schedule</label>
                <div className="padded-input-row">
                    <div>
                        <PeriodSelect
                            value={period}
                            onChange={setPeriod}
                        />
                    </div>
                    <div >
                        <BillScheduler
                            billPeriod={`${period}ly`}
                            error={scheduleMissing}
                            setHasSchedule={setHasSchedule}
                        />
                    </div>
                </div>
                <div>
                    <EmojiComboText
                        name="name"
                        placeholder="Name"
                        register={register}
                        error={[errors.name]}
                    />
                </div>
                <div >
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
            <BottomButtons />
        </form>
    )
}

const Window = () => {
    const { recommendationsMode } = useContext(ItemsContext)
    return (
        <div className="window3" id="add-bills--window">
            <div>
                <h2>Bills</h2>
                {!recommendationsMode && < RecommendationsButton />}
            </div>
            <BillsList />
            <Form />
        </div>
    )
}

const AddBills = () => (
    <ItemsProvider>
        <Window />
    </ItemsProvider>
)

export default AddBills
