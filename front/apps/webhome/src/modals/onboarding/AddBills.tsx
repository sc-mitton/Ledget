import { useEffect, useState, Fragment } from 'react'

import { Tab } from '@headlessui/react'
import { animated } from '@react-spring/web'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tab } from '@headlessui/react'

import './styles/Items.scss'
import { TabView, BottomButtons } from './Reusables'
import { useItemsContext, ItemsProvider } from "./ItemsContext"
import { LimitAmountInput, EmojiComboText, BillScheduler } from '@components/inputs'
import {
    getLongestLength,
    BillCatLabel,
    DeleteButton,
    ShadowScrollDiv,
    DollarCents,
    FormErrorTip,
    IconButton,
    TabNavList
} from '@ledget/ui'
import { CheckMark } from '@ledget/media'

const formSchema = z.object({
    name: z.string().min(1, { message: 'required' }),
    upper_amount: z.number().min(0, { message: 'required' }),
    day: z.number().min(1, { message: 'required' }),
    week: z.number().min(1, { message: 'required' }),
    week_day: z.number().min(1, { message: 'required' }),
    month: z.number().min(1, { message: 'required' }),
})

const BillsColumn = ({ period }: { period: 'month' | 'year' }) => {
    const context = useItemsContext('bill')
    const [nameFlexBasis, setNameFlexBasis] = useState('auto')

    const {
        items,
        setItems,
        transitions,
        containerProps
    } = period === 'month' ? context.month : context.year

    useEffect(() => {
        const longestNameLength = getLongestLength(items, 'name')
        setNameFlexBasis(`${longestNameLength + 1}ch`)
    }, [items])

    return (
        <ShadowScrollDiv style={{ height: 'auto' }}>
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
                            <BillCatLabel
                                name={item?.name || ''}
                                emoji={item?.emoji}
                                color={item?.period === 'month' ? 'blue' : 'green'}
                                slim={true}
                            />
                        </div>
                        <div className="amount--container">
                            <div className="budget-dollar--container">
                                <DollarCents value={item?.upper_amount || 0} />
                            </div>
                        </div >
                        <DeleteButton onClick={() =>
                            setItems((prev: any) => prev.filter((i: any) => i !== item))} />
                    </animated.div>
                )}
            </animated.div>
        </ShadowScrollDiv>
    )
}

const ListView = () => {
    const {
        year: { isEmpty: emptyYearItems },
        month: { isEmpty: emptyMonthItems }
    } = useItemsContext('bill')

    return (
        <>
            <Tab.Panel as={Fragment}>
                {(emptyMonthItems)
                    ?
                    <div className="empty-message--container">
                        <span>Looks like you haven't added any</span><br />
                        <span>monthly bills yet...</span>
                    </div>
                    : <BillsColumn period={'month'} />}
            </Tab.Panel>
            <Tab.Panel as={Fragment}>
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

const Form = () => {
    const {
        month: { items: monthItems }, year: { items: yearItems }
    } = useItemsContext('bill')

    const [scheduleMissing, setScheduleMissing] = useState(false)
    const [hasSchedule, setHasSchedule] = useState(false)

    const { register, handleSubmit, reset, formState: { errors }, control } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onSubmit', reValidateMode: 'onChange'
    })

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
            onSubmit={handleSubmit((data) => {
                console.log(data)
            })}
            key={`create-bill-form-${monthItems.length}-${yearItems.length}}`}
        >
            <label>Custom</label>
            <div>
                <div>
                    <EmojiComboText
                        hasLabel={false}
                        name="name"
                        placeholder="Name"
                        register={register}
                        error={errors.name}
                    />
                </div>
                <div >
                    <LimitAmountInput name="upper_amount" control={control} hasLabel={false}>
                        <FormErrorTip error={errors.upper_amount && errors.upper_amount as any} />
                    </LimitAmountInput>
                </div>
                <div>
                    <BillScheduler
                        billPeriod="month"
                        iconPlaceholder={true}
                        error={scheduleMissing}
                        setHasSchedule={setHasSchedule}
                        register={register}
                    />
                </div>
                <div>
                    <IconButton>
                        <CheckMark />
                    </IconButton>
                </div>
            </div>
            <BottomButtons item={'bill'} />
        </form>
    )
}

const AddBills = () => (
    <ItemsProvider itemType="bill">
        <div id="add-bills--window">
            <div>
                <h1>Bills</h1>
                <span>
                    Let's add a few of your monthly and yearly bills
                </span>
            </div>
            <div id="budget-items--container">
                <TabView item={'bill'}>
                    <ListView />
                </TabView>
            </div>
            <Form />
        </div>
    </ItemsProvider>
)

export default AddBills
