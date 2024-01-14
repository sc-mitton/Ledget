import { useId, useState, useEffect, useRef } from 'react'

import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Menu, RadioGroup } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { DatePicker } from "antd"
import dayjs from 'dayjs'

import './styles/Bill.scss'
import { billSchema } from './CreateBill'
import { withModal } from '@ledget/ui'
import { useGetBillsQuery, TransformedBill, useDeleteBillMutation, useUpdateBillsMutation, UpdateBill } from '@features/billSlice'
import { Reminder } from '@features/remindersSlice'
import { SubmitForm } from '@components/pieces'
import {
    DollarCents,
    getDaySuffix,
    mapWeekDayNumberToName,
    DropDownDiv,
    SlideMotionDiv,
    useLoaded,
    Checkbox,
    IconButton,
    DropdownItem
} from '@ledget/ui'
import { extractReminders } from '@modals/CreateBill'
import { CheckMark2, Ellipsis, TrashIcon, BellOff, Edit } from '@ledget/media'
import {
    EmojiComboText,
    DollarRangeInput,
    BillScheduler,
    AddReminder,
    emoji
} from '@components/inputs'

const getRepeatsDescription = ({ day, week, week_day, month, year }:
    { day: number | undefined, week: number | undefined, week_day: number | undefined, month: number | undefined, year: number | undefined }) => {

    if (year && month && day) {
        return `One time on ${new Date(year, month, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    } else if (month) {
        return `Yearly on ${new Date(2000, month, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    } else if (week_day && week) {
        return `The ${week_day}${getDaySuffix(week_day)} ${mapWeekDayNumberToName(week)} of the month`
    } else if (day) {
        return `The ${day}${getDaySuffix(day)} of every month`
    } else {
        return ''
    }
}

const getNextBillDate = ({ day, week, week_day, month, year }:
    { day: number | undefined, week: number | undefined, week_day: number | undefined, month: number | undefined, year: number | undefined }) => {
    let date = new Date()

    if (year && month && day) {
        return new Date(year, month, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } else if (month && day) {
        date.setMonth(month)
        date.setDate(day)
        date.setFullYear(date.getFullYear() + 1)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } else if (week_day && week) {
        date.setMonth(date.getMonth() + 1)
        date.setDate(1 + (week! - 1) * 7)
        date.setDate(date.getDate() + (week_day! - 1 - date.getDay() + 7) % 7)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } else if (day) {
        date.setMonth(date.getMonth() + 1)
        date.setDate(day)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
}

type Action = 'delete' | 'edit' | 'none'

const Actions = ({ setAction }: { setAction: React.Dispatch<React.SetStateAction<Action>> }) => {
    const [openEllipsis, setOpenEllipsis] = useState(false)

    return (
        <Menu as="div" className="corner-dropdown">
            {({ open }) => (
                <>
                    <Menu.Button as={IconButton} onClick={() => setOpenEllipsis(!openEllipsis)}>
                        <Ellipsis rotate={90} size={'1.375em'} />
                    </Menu.Button>
                    <div>
                        <DropDownDiv
                            placement='right'
                            arrow='right'
                            className='right'
                            visible={open}
                        >
                            <Menu.Items static>
                                <Menu.Item>
                                    {({ active }) => (
                                        <DropdownItem
                                            as='button'
                                            active={active}
                                            onClick={() => setAction('edit')}
                                        >
                                            <Edit size={'1em'} fill={'currentColor'} />
                                            <span>Edit Bill</span>
                                        </DropdownItem>
                                    )}
                                </Menu.Item>
                                <hr />
                                <Menu.Item>
                                    {({ active }) => (
                                        <DropdownItem
                                            as='button'
                                            active={active}
                                            onClick={() => setAction('delete')}
                                        >
                                            <TrashIcon fill={'currentColor'} />
                                            <span>Delete Bill</span>
                                        </DropdownItem>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </DropDownDiv>
                    </div>
                </>
            )}
        </Menu>
    )
}

const BillInfo = ({ bill }: { bill: TransformedBill }) => {
    return (
        <div id="bill-info">
            <div className="header">
                {bill &&
                    <h2>
                        {bill.emoji}&nbsp;&nbsp;
                        {`${bill.name.charAt(0).toUpperCase()}${bill?.name.slice(1)}`}
                    </h2>}
            </div>
            <div className="inner-window">
                <div>Amount</div>
                <div>
                    <CheckMark2
                        size={'.9em'}
                        style={{
                            marginLeft: '.125em',
                            ...(!bill.is_paid && { opacity: .3 })
                        }}
                    />
                    <div>
                        {bill.lower_amount && <><DollarCents value={bill.lower_amount} /> <span>&nbsp;-&nbsp;</span></>}
                        {bill.upper_amount && <DollarCents value={bill.upper_amount} />}
                    </div>
                </div>
                <div>Schedule</div>
                <div>{getRepeatsDescription({
                    day: bill?.day,
                    week: bill?.week,
                    week_day: bill?.week_day,
                    month: bill?.month,
                    year: bill?.year
                })}</div>
                <div>Next</div>
                <div>
                    {bill?.is_paid
                        ? `${getNextBillDate({
                            day: bill?.day,
                            week: bill?.week,
                            week_day: bill?.week_day,
                            month: bill?.month,
                            year: bill?.year
                        })}`
                        : `${new Date(bill.date).toLocaleDateString(
                            'en-US',
                            { month: 'short', day: 'numeric', year: 'numeric' })}`
                    }
                </div>
                {bill?.expires &&
                    <><div>Expires</div>
                        <div>
                            {`${new Date(bill.expires).toLocaleDateString(
                                'en-US',
                                { month: 'short', day: 'numeric', year: 'numeric' })}`}
                        </div></>}
                <div>
                    Reminders
                </div>
                <div>
                    {bill.reminders && bill.reminders?.length > 0
                        ?
                        <>
                            {bill.reminders.map((reminder, i) => (
                                <span>
                                    {`${reminder.offset} `}
                                    {`${reminder.period}${reminder.offset > 1 ? 's' : ''} before`}
                                </span>
                            ))}
                        </>
                        : <BellOff size={'1.1em'} fill={'var(--btn-mid-gray-hover)'} />
                    }
                </div>

            </div>
        </div>
    )
}

const DeleteBill = ({ bill, onCancel, onDelete }: { bill: TransformedBill, onCancel: () => void, onDelete: () => void }) => {
    const [deleteBill, { isLoading: isDeleting, isSuccess: isDeleteSuccess }] = useDeleteBillMutation()
    const [value, setValue] = useState('all' as 'all' | 'single' | 'complement')

    const onSubmit = (e: any) => {
        e.preventDefault()
        deleteBill({
            billId: bill.id,
            data: { instances: value }
        })
    }

    useEffect(() => {
        if (isDeleteSuccess) {
            onDelete()
        }
    }, [isDeleteSuccess])

    return (
        <form id="delete-bill" onSubmit={onSubmit}>
            <RadioGroup id="radios" value={value} onChange={setValue}>
                <RadioGroup.Label className={bill.period}>
                    <h3>Delete {`${bill.name.charAt(0).toUpperCase()}${bill?.name.slice(1)}`} Bill</h3>
                </RadioGroup.Label>
                <RadioGroup.Option value="single" className="radio-option">
                    {({ checked }) => (
                        <>
                            <span className={`button ${checked ? 'checked' : ''}`} />
                            <span>Just this month's bill</span>
                        </>
                    )}
                </RadioGroup.Option>
                <RadioGroup.Option value="complement" className="radio-option">
                    {({ checked }) => (
                        <>
                            <span className={`button ${checked ? 'checked' : ''}`} />
                            <span>All future bills</span>
                        </>
                    )}
                </RadioGroup.Option>
                <RadioGroup.Option value="all" className="radio-option">
                    {({ checked }) => (
                        <>
                            <span className={`button ${checked ? 'checked' : ''}`} />
                            <span>All including this month</span>
                        </>
                    )}
                </RadioGroup.Option>
            </RadioGroup>
            <SubmitForm
                text="OK"
                submitting={isDeleting}
                success={isDeleteSuccess}
                onCancel={onCancel}
            />
        </form>
    )
}

const EditBill = ({ bill, onCancel, onUpdateSuccess }: { bill: TransformedBill, onCancel: () => void, onUpdateSuccess: () => void }) => {
    const [updateBill, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] = useUpdateBillsMutation()
    const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<z.infer<typeof billSchema>>({
        resolver: zodResolver(billSchema)
    })

    const [emoji, setEmoji] = useState<emoji>()
    const [reminders, setReminders] = useState<Reminder[]>()
    const [rangeMode, setRangeMode] = useState(Boolean(bill.lower_amount))

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // parse form data
        const reminders = extractReminders(e)

        handleSubmit((data) => {
            if (data.upper_amount || data.lower_amount) {
                updateBill({
                    id: bill?.id,
                    reminders: reminders,
                    ...data,
                })
            } else {
                const payload = { id: bill?.id } as any
                let k: keyof typeof data
                for (k in data)
                    if (data[k] !== bill?.[k])
                        payload[k] = data[k]
                updateBill(payload as UpdateBill)
            }
        })(e)
    }

    // Set values on load
    useEffect(() => {
        setValue('name', `${bill.name.charAt(0).toUpperCase()}${bill?.name.slice(1)}`)
        setEmoji(bill.emoji)
    }, [])

    // Update success
    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (isUpdateSuccess) {
            timeout = setTimeout(() => {
                onUpdateSuccess()
            }, 1000)
        }
        return () => clearTimeout(timeout)
    }, [isUpdateSuccess])

    return (
        <form onSubmit={submitForm}>
            <div id="bill-edit">
                <h3>Edit Bill</h3>
                <hr />
                <div>
                    <label htmlFor="schedule">Schedule</label>
                    <div>
                        <BillScheduler
                            defaultValue={{
                                day: bill.day,
                                week: bill.week,
                                weekDay: bill.week_day,
                                month: bill.month
                            }}
                            billPeriod={bill.period}
                            error={errors.day}
                            register={register}
                        />
                        <AddReminder
                            value={reminders}
                            onChange={setReminders}
                            defaultSelected={
                                bill.reminders && bill.reminders.map((reminder) => reminder.id)
                            }
                        />
                    </div>
                </div>
                <div>
                    <EmojiComboText
                        emoji={emoji}
                        setEmoji={setEmoji}
                        name="name"
                        placeholder="Name"
                        register={register}
                        error={errors.name}
                    />
                </div>
                <div>
                    <DollarRangeInput
                        defaultLowerValue={bill.lower_amount}
                        defaultUpperValue={bill.upper_amount}
                        rangeMode={rangeMode}
                        control={control}
                        errors={errors}
                    />
                    <Checkbox
                        label='Range'
                        id="range"
                        aria-label='Change bill amount to a range.'
                        checked={rangeMode}
                        setChecked={setRangeMode}
                    />
                </div>
                <div style={{ margin: '.375em 0' }}>
                    <Controller
                        name="expires"
                        control={control}
                        render={(props) => (
                            <>
                                <DatePicker
                                    placeholder="Expires"
                                    format="MM/DD/YYYY"
                                    aria-label='Expiration date'
                                    onChange={(e) => { props.field.onChange(e?.toISOString()) }}
                                    defaultValue={bill.expires ? dayjs(bill.expires) : undefined}
                                />
                            </>
                        )}
                    />
                </div>
            </div>
            <SubmitForm
                text="Save"
                submitting={isUpdating}
                success={isUpdateSuccess}
                onCancel={onCancel}
            />
        </form>
    )
}

const BillModal = withModal((props) => {
    const id = useId()
    const loaded = useLoaded(100)
    const location = useLocation()
    const [action, setAction] = useState<Action>('none')
    const [searchParams] = useSearchParams()
    const { data: bills } = useGetBillsQuery({
        month: searchParams.get('month') || undefined,
        year: searchParams.get('year') || undefined
    })
    const bill = bills?.find(bill => bill.id === location.state?.billId)

    return (
        <div id="bill-modal--content">
            <Actions setAction={setAction} />
            <AnimatePresence mode="wait">
                {action === 'none' &&
                    <SlideMotionDiv position={loaded ? 'first' : 'fixed'} key={id}>
                        <BillInfo bill={bill!} />
                    </SlideMotionDiv>}
                {action === 'edit' &&
                    <SlideMotionDiv position={'last'} key={`${id}1`}>
                        <EditBill
                            bill={bill!}
                            onCancel={() => { setAction('none') }}
                            onUpdateSuccess={() => { props.closeModal() }}
                        />
                    </SlideMotionDiv>
                }
                {action === 'delete' &&
                    <SlideMotionDiv position={'last'} key={`${id}2`}>
                        <DeleteBill
                            bill={bill!}
                            onCancel={() => { setAction('none') }}
                            onDelete={() => { props.closeModal() }}
                        />
                    </SlideMotionDiv>
                }
            </AnimatePresence>
        </div>
    )
})

export default function EnhancedBillModal() {
    const navigate = useNavigate()

    return (
        <BillModal
            maxWidth={'20rem'}
            onClose={() => navigate(-1)}
        />
    )
}
