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
import { formatName, getLongestLength } from '@ledget/shared-utils'
import { useGetBillRecommendationsQuery } from '@features/billSlice'
import { CloseButton, Checkbox } from '@ledget/shared-ui'

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
            if (!hasSchedule || body.errors) { return }

            const item = { ...body, ...data }
            if (body.period === 'month') {
                setMonthItems([...monthItems, item])
            } else {
                setYearItems([...yearItems, item])
            }
        })(e)

        reset()
    }

    return (
        <form
            onSubmit={submitForm}
            key={`create-bill-form-${monthItems.length}-${yearItems.length}}`}
        >
            <div>
                <div className="split-row-inputs">
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
    const { itemsEmpty, recommendationsMode } = useContext(ItemsContext)

    return (
        <div className="window3" id="add-bills--window">
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
                    Add your monthly and yearly bills
                </div>
            }
            {(itemsEmpty && !recommendationsMode) && <hr className="spaced-header" />}
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
