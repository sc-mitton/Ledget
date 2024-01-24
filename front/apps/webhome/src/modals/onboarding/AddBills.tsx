import { useEffect, useState, Fragment } from 'react'

import { Tab } from '@headlessui/react'
import { animated } from '@react-spring/web'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Plus } from '@geist-ui/icons'

import './styles/Items.scss'
import { TabView, BottomButtons } from './Reusables'
import { useItemsContext, ItemsProvider } from "./ItemsContext"
import { LimitAmountInput, EmojiComboText, BillScheduler, emoji } from '@components/inputs'
import {
    getLongestLength,
    BillCatLabel,
    DeleteButton,
    ShadowScrollDiv,
    DollarCents,
    FormErrorTip,
    IconButton,
} from '@ledget/ui'
import { Recommendations } from '@ledget/media'
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
                                tint={true}
                                hoverable={false}
                            />
                        </div>
                        <div className="amount--container">
                            <div className="budget-dollar--container">
                                <DollarCents value={item?.upper_amount || 0} />
                            </div>
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
                        <span>No monthly bills added yet</span>
                    </div>
                    : <BillsColumn period={'month'} />}
            </Tab.Panel>
            <Tab.Panel as={Fragment}>
                {(emptyYearItems)
                    ?
                    <div className="empty-message--container">
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
        <Tab.Panel
            as={'form'}
            onSubmit={submitForm}
            key={`create-bill-form-${monthItems.length}-${yearItems.length}}`}
        >
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
                    <IconButton>
                        <Check className='icon' />
                    </IconButton>
                </div>
            </div>
        </Tab.Panel>
    )
}

const AddSuggestedCustomBills = () => (
    <Tab.Group as='div'>
        <Tab.Panels as={Fragment}>
            <CutomTabPanel />
            <Tab.Panel className="suggested-bills--container">
                <span>Coming soon</span>
            </Tab.Panel>
        </Tab.Panels>
        <Tab.List className="custom-suggested-tabs">
            <Tab>
                Custom
                <Plus className='icon' />
            </Tab>
            <Tab>
                Suggested
                <Recommendations fill={'currentColor'} />
            </Tab>
        </Tab.List>
    </Tab.Group>
)

const AddBills = () => (
    <ItemsProvider itemType="bill">
        <div id="add-bills--window">
            <div>
                <h1>Bills</h1>
                <h4>Let's add a few of your monthly and yearly bills</h4>
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
