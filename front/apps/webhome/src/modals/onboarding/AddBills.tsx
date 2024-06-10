import { useEffect, useState, Fragment } from 'react'

import { Tab } from '@headlessui/react'
import { animated } from '@react-spring/web'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from '@geist-ui/icons'

import styles from './styles/items.module.scss'
import { TabView, BottomButtons } from './Reusables'
import { useItemsContext, ItemsProvider } from "./ItemsContext"
import { LimitAmountInput, EmojiComboText, BillScheduler, emoji } from '@components/inputs'
import { getLongestLength } from '@ledget/helpers'
import {
    BillCatLabel,
    DeleteButton,
    ShadowScrollDiv,
    DollarCents,
    FormErrorTip,
    IconButtonHalfGray,
    TabNavListUnderlined
} from '@ledget/ui'
import { extractReminders } from '@modals/CreateBill'

const formSchema = z.object({
    name: z.string().min(1, { message: 'required' }),
    upper_amount: z.number(),
    day: z.coerce.number().min(1).max(31).optional(),
    week: z.coerce.number().min(1).max(5).optional(),
    week_day: z.coerce.number().min(1).max(7).optional(),
    month: z.coerce.number().min(1).max(12).optional(),
}).refine((data) => {
    const check1 = data.day === undefined
    const check2 = data.week === undefined && data.week_day === undefined
    const check3 = data.month === undefined && data.day === undefined
    if (check1 && check2 && check3)
        return false
    else return true
}, { message: 'required', path: ['day'] })


const BillsColumn = ({ period }: { period: 'month' | 'year' }) => {
    const [nameFlexBasis, setNameFlexBasis] = useState('auto')

    const context = useItemsContext('bill')

    const {
        items,
        transitions,
        containerProps
    } = period === 'month' ? context.month : context.year

    const {
        month: { setItems: setMonthItems },
        year: { setItems: setYearItems }
    } = useItemsContext('bill')

    useEffect(() => {
        const longestNameLength = getLongestLength(items, 'name')
        setNameFlexBasis(`${longestNameLength + 1}ch`)
    }, [items])

    return (
        <ShadowScrollDiv style={{ height: 'auto' }}>
            <animated.div style={containerProps} >
                {transitions((style, item, index) =>
                    <animated.div
                        className={[styles.budgetItem, styles.billItem].join(' ')}
                        style={style}
                    >
                        <div style={{ flexBasis: nameFlexBasis }}>
                            <BillCatLabel
                                labelName={item?.name || ''}
                                emoji={item?.emoji}
                                color={item?.period === 'month' ? 'blue' : 'green'}
                                slim={true}
                                hoverable={false}
                            />
                        </div>
                        <div className={styles.amountContainer}>
                            <div className={styles.budgetDollarContainer}>
                                <DollarCents value={item?.upper_amount || 0} />
                            </div>
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
                    <div className={styles.emptyMessageContainer}>
                        <span>No monthly bills added yet</span>
                    </div>
                    : <BillsColumn period={'month'} />}
            </Tab.Panel>
            <Tab.Panel as={Fragment}>
                {(emptyYearItems)
                    ?
                    <div className={styles.emptyMessageContainer}>
                        <span>No yearly categories added yet</span>
                    </div>
                    : <BillsColumn period={'year'} />}
            </Tab.Panel>
        </>
    )
}


const CutomTabPanel = () => {
    const {
        month: { items: monthItems, setItems: setMonthItems },
        year: { items: yearItems, setItems: setYearItems },
        periodTabIndex
    } = useItemsContext('bill')

    const [emoji, setEmoji] = useState<emoji>()

    const { register, handleSubmit, reset, formState: { errors }, control } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onSubmit', reValidateMode: 'onChange'
    })

    useEffect(() => {
        const timeout = setTimeout(() => { reset() }, 100)
        return () => clearTimeout(timeout)
    }, [monthItems, yearItems])

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {

        setEmoji(undefined)
        handleSubmit((data) => {
            const reminders = extractReminders(e)
            const item = { ...data, reminders, emoji: typeof emoji === 'string' ? emoji : emoji?.native }

            if (periodTabIndex === 0) {
                setMonthItems((prev) => [...prev, { ...item, period: 'month' }])
            } else {
                setYearItems((prev) => [...prev, { ...item, period: 'year' }])
            }
        })(e)
    }

    return (
        <Tab.Panel key={`create-bill-form-${monthItems.length}-${yearItems.length}}`}>
            <form onSubmit={submitForm}>
                <div>
                    <div>
                        <EmojiComboText
                            emoji={emoji}
                            setEmoji={setEmoji}
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
                            error={errors.day}
                            register={register}
                        />
                    </div>
                    <div>
                        <IconButtonHalfGray>
                            <Check className='icon' />
                        </IconButtonHalfGray>
                    </div>
                </div>
            </form>
        </Tab.Panel>
    )
}

const AddSuggestedCustomBills = () => (
    <Tab.Group as='div'>
        {({ selectedIndex }) => (
            <>
                <TabNavListUnderlined selectedIndex={selectedIndex} >
                    <Tab>Custom</Tab>
                    <Tab>Suggested</Tab>
                </TabNavListUnderlined>
                <Tab.Panels as={Fragment}>
                    <CutomTabPanel />
                    <Tab.Panel className={styles.suggestedBillsContainer}>
                        <span>Coming soon</span>
                    </Tab.Panel>
                </Tab.Panels>
            </>
        )}
    </Tab.Group>
)

const AddBills = () => (
    <ItemsProvider itemType="bill">
        <div className={styles.addItemsWindow}>
            <div>
                <h2>Bills</h2>
                <span>Let's add a few of your monthly and yearly bills</span>
            </div>
            <TabView item='bill'>
                <ListView />
            </TabView>
            <AddSuggestedCustomBills />
            <BottomButtons item={'bill'} />
        </div>
    </ItemsProvider>
)

export default AddBills
