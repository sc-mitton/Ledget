import React, { useContext, useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"

import './styles/Items.css'
import { ItemsProvider, ItemsContext } from './context'
import {
    EmojiComboText,
    DollarRangeInput,
    PeriodSelect,
    useBillScheduler,
    AddReminder,
    Checkbox
} from '@components/inputs'
import { ShadowedContainer } from '@components/pieces'
import { BottomButtons, TabView } from './Reusables'
import { billSchema, extractBill } from '@modals/CreateBill'
import { DeleteButton } from '@components/buttons'

const BillsColumn = ({ period }) => {
    const context = useContext(ItemsContext)[period]

    const {
        items,
        setItems,
        flexBasis,
        transitions,
        containerProps,
    } = context

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
                            className="budget-item-name"
                            style={{ flexBasis: flexBasis }}
                        >
                            <span>{item.emoji}</span>
                            <span>{formatName(item.name)}</span>
                        </div>
                        <div >
                            {`$${item.limit_amount / 100}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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

const BillsList = () => (
    <div id="budget-items--container">
        <TabView>
            <TabView.Panel>
                <BillsColumn period="month" />
            </TabView.Panel>
            <TabView.Panel>
                <BillsColumn period="year" />
            </TabView.Panel>
        </TabView>
    </div>
)

const Form = ({ children }) => {
    const { BillScheduler, reset: resetScheduler, hasSchedule } = useBillScheduler()
    const [rangeMode, setRangeMode] = useState(false)
    const [reminders, setReminders] = useState([])
    const [period, setPeriod] = useState(null)
    const [scheduleMissing, setScheduleMissing] = useState(false)
    const [lowerAmount, setLowerAmount] = useState('')
    const [upperAmount, setUpperAmount] = useState('')
    const [readyToSubmit, setReadyToSubmit] = useState(false)
    const { items: monthItems, setItems: setMonthItems } = useContext(ItemsContext).month
    const { items: yearItems, setItems: setYearItems } = useContext(ItemsContext).year

    const [emoji, setEmoji] = useState('')
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(billSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    })

    const resetForm = () => {
        setEmoji('')
        resetScheduler()
        setReminders([])
        setRangeMode(false)
        setUpperAmount('')
        setLowerAmount('')
        reset()
    }

    const submitForm = (e) => {
        const body = extractBill(e)
        if (body.errors) {
            body.errors.schedule && setScheduleMissing(true)
        }

        handleSubmit((data) => {
            if (body.errors) { return }

            const item = { ...body, ...data }
            if (body.period === 'month') {
                // setMonthItems([...monthItems, item])
            } else {
                // setYearItems([...yearItems, item])
            }
            resetForm()
        })(e)
    }

    useEffect(() => {
        if (hasSchedule && isValid && (rangeMode === false || lowerAmount) && upperAmount) {
            setReadyToSubmit(true)
        } else {
            setReadyToSubmit(false)
        }
    }, [hasSchedule, isValid, emoji, lowerAmount, upperAmount])

    return (
        <form onSubmit={submitForm}>
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
                        emoji={emoji}
                        setEmoji={setEmoji}
                        register={register}
                        error={[errors.name]}
                    />
                </div>
                <div id="bill-scheduler--container">
                    <BillScheduler
                        billPeriod={`${period}ly`}
                        error={scheduleMissing}
                    />
                    <AddReminder
                        value={reminders}
                        onChange={setReminders}
                    />
                </div>
                <div>
                    <DollarRangeInput
                        mode={rangeMode}
                        lowerRange={lowerAmount}
                        setLowerRange={setLowerAmount}
                        upperRange={upperAmount}
                        setUpperRange={setUpperAmount}
                        register={register}
                        errors={errors}
                    />
                    <Checkbox
                        label='Range'
                        name='range'
                        id="range"
                        aria-label='Change bill amount to a range.'
                        value={rangeMode}
                        onChange={(e) => { setRangeMode(e.target.checked) }
                        }
                    />
                </div>
            </div>
            {children(readyToSubmit)}
        </form>
    )
}

const Window = () => {
    const { itemsEmpty } = useContext(ItemsContext)

    return (
        <div className="window2">
            <h2 className="spaced-header2">Bills</h2>
            {itemsEmpty
                ? <>
                    <h4 >Add your monthly and yearly bills</h4>
                    <hr className="spaced-header" />
                </>
                : <BillsList />
            }
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
