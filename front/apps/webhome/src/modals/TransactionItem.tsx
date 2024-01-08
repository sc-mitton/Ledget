import { useState, useEffect, useRef } from 'react'

import Big from 'big.js'
import { Menu } from '@headlessui/react'
import { AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import { useForm, useFieldArray, set } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import './styles/TransactionItem.scss'
import { Transaction } from '@features/transactionsSlice'
import { useGetAccountsQuery } from "@features/accountsSlice"
import { withModal, Base64Logo, DollarCents, BillCatLabel } from '@ledget/ui'
import { SelectCategoryBill } from '@components/dropdowns'
import {
    useConfirmTransactionsMutation,
    useAddNoteMutation,
    useUpdateDeleteNoteMutation,
    useUpdateTransactionMutation,
} from '@features/transactionsSlice'
import { Bill } from "@features/billSlice";
import { Category, isCategory } from "@features/categorySlice";
import { Split, Edit, CheckMark, TrashIcon, Ellipsis } from '@ledget/media'
import { SplitTransactionInput } from '@components/split'
import {
    DropDownDiv,
    useAccessEsc,
    DropdownItem,
    SlideMotionDiv,
    useLoaded,
    CircleIconButton,
    Tooltip,
    IconButton
} from '@ledget/ui'


type Action = 'split'

const Actions = ({ setAction }: { setAction: React.Dispatch<React.SetStateAction<Action | undefined>> }) => {
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
                                            onClick={() => setAction('split')}
                                        >
                                            <Split fill={'currentColor'} />
                                            <span>Split</span>
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

const getBillCategoryLabel = (item: Transaction) => {
    if (item?.categories?.length && item?.categories?.length > 1) {
        return 'Categories'
    } else if (item?.categories?.length && item?.categories?.length === 1) {
        return 'Category'
    } else if (item?.bill) {
        return 'Bill'
    } else if (item?.predicted_category) {
        return 'Category'
    } else if (item?.predicted_bill) {
        return 'Bill'
    } else {
        return ''
    }
}

const schema = z.object({ notes: z.array(z.object({ text: z.string(), noteId: z.string() })) })

const NoteInnerWindow = ({ item }: { item: Transaction }) => {
    const [addNote] = useAddNoteMutation()
    const [updateDeleteNote] = useUpdateDeleteNoteMutation()
    const { register, control, getFieldState } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            notes: [{ noteId: 'new', text: '' }]
                .concat([...item.notes].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
                    .map((note) => ({ noteId: note.id, text: note.text })))
        }
    })
    const { fields, prepend, remove } = useFieldArray({ control, name: 'notes' })
    const [focusedNoteIndex, setFocusedNoteIndex] = useState<number>()
    const notesContainerRef = useRef<HTMLDivElement>(null)
    const [addFillerRow, setAddFillerRow] = useState(false)

    const handleNoteAction = (index: number, deleteNote?: boolean) => {
        setFocusedNoteIndex(undefined)
        const state = getFieldState(`notes.${index}.text`)
        const field = fields.find((field, i) => i === index)
        if (deleteNote && field) {
            updateDeleteNote({
                transactionId: item.transaction_id,
                noteId: field.noteId,
            })
        } else if (state.isDirty) {
            if (field?.noteId === 'new') {
                addNote({
                    transactionId: item.transaction_id,
                    text: field.text
                })
                prepend({ text: '', noteId: 'new' })
            } else if (field) {
                remove(index)
                updateDeleteNote({
                    transactionId: item.transaction_id,
                    noteId: field.noteId,
                    text: field.text
                })
            }
        }
    }

    // When textarea is focused, add event listener to notesContainerRef
    // So that when it's clicked outside, the textarea is blurred. This
    // will make it so the trash and save buttons will work. Esc will also
    // blur things and
    useEffect(() => {
        if (focusedNoteIndex === undefined) { return }
        const handler = (e: MouseEvent) => {
            if (!notesContainerRef.current?.contains(e.target as Node)) {
                handleNoteAction(focusedNoteIndex)
            }
        }
        const escHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleNoteAction(focusedNoteIndex)
            }
        }
        document.addEventListener('keydown', escHandler)
        document.addEventListener('click', handler)
        return () => {
            document.removeEventListener('click', handler)
            document.removeEventListener('keydown', escHandler)
        }
    }, [focusedNoteIndex])

    return (
        <div className='inner-window'>
            <h4>{`Note${item.notes.length > 1 ? 's' : ''}`}</h4>
            <div id="notes--container" ref={notesContainerRef}>
                <div>
                    {fields.map((field, index) => (
                        <div className='note--container' key={`note${index}`}>
                            <textarea
                                key={`field${index}`}
                                {...register(`notes.${index}.text`)}
                                defaultValue={field.text}
                                disabled={!item.notes[index - 1]?.is_current_users && index !== 0}
                                onFocus={() => {
                                    setFocusedNoteIndex(index)
                                    setAddFillerRow(true)
                                }}
                                onBlur={() => {
                                    setAddFillerRow(false)
                                }}
                                rows={1}
                                placeholder='Add a note...'
                            />
                            {focusedNoteIndex === index &&
                                <span className="last-changed">
                                    Last changed&nbsp;
                                    {dayjs(item.notes[index - 1]?.datetime).format('HH:mm A M/DD/YY')}
                                </span>}
                        </div>
                    ))}
                    {addFillerRow &&
                        <div className='note--container'>
                            <textarea
                                placeholder='Just a filler so the container size does jump'
                                rows={1}
                                disabled
                            /></div>}
                    {focusedNoteIndex !== undefined &&
                        <>
                            {focusedNoteIndex !== 0 &&
                                <Tooltip msg={'Delete'} ariaLabel={'delete'}>
                                    <CircleIconButton onClick={(e) => {
                                        handleNoteAction(focusedNoteIndex, true)
                                    }}>
                                        <TrashIcon size={'.9em'} />
                                    </CircleIconButton>
                                </Tooltip>
                            }
                            <Tooltip msg={'Save'} ariaLabel={'save'}>
                                <CircleIconButton onClick={(e) => {
                                    handleNoteAction(focusedNoteIndex)
                                }}>
                                    <CheckMark size={'.8em'} />
                                </CircleIconButton>
                            </Tooltip>
                        </>}
                </div>
            </div>
        </div>
    )
}

const InfoTableInnerWindow = ({ item }: { item: Transaction }) => {
    const { data: accountsData, isSuccess: accountsFetched } = useGetAccountsQuery()
    const [institution, setInstitution] = useState<any>({})
    const [account, setAccount] = useState<any>({})

    useEffect(() => {
        if (accountsFetched) {
            const account = accountsData.accounts.find((acnt: any) => acnt.account_id === item?.account)
            setInstitution(
                accountsData.institutions.find((inst: any) => inst.id === account?.institution_id)
            )
            setAccount(account)
        }
    }, [accountsFetched])

    return (
        <div className='inner-window'>
            <div>Account</div>
            <div id="account-info-cell">
                <a href={institution?.url} target="_blank" rel="noreferrer">
                    <Base64Logo
                        data={institution?.logo}
                        alt={institution?.name?.charAt(0).toUpperCase()}
                    />
                </a>
                <span>{account?.official_name}</span>
                <span>&nbsp;&bull;&nbsp;&bull;&nbsp;{account?.mask}</span>
            </div>
            {item?.merchant_name &&
                <>
                    <div>Merchant </div>
                    <div className="merchant-cell">
                        {item?.merchant_name}
                    </div>
                </>}
            <div>Date </div>
            <div>
                {dayjs(item?.datetime || item?.date).format('MMM D, YYYY')}
            </div>
            {(item?.address || item?.city || item?.region) &&
                <>
                    <div>Location </div>
                    <div>
                        <span>{item?.address}</span>
                        <span>
                            {item.city && item.region
                                ? `${item.city}, ${item.region}`
                                : item.city ? `${item.city}` : `${item.region}`
                            }
                        </span>
                    </div>
                </>
            }
        </div>
    )
}

function CategoriesBillInnerWindow({ item, }: { item: Transaction }) {
    const [itemIsSplit, setItemIsSplit] = useState(false)
    const [billCat, setBillCat] = useState<Bill | Category | undefined>()
    const [showBillCatSelect, setShowBillCatSelect] = useState(false)
    const [confirmTransactions] = useConfirmTransactionsMutation()
    const buttonContainerRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // If the transaction has been set to be split between categories in the past,
    // then we don't want to have the dropdown available. The user will have to go the
    // split transaction view.
    useEffect(() => {
        if (item?.categories?.length && item?.categories?.length > 1) {
            setItemIsSplit(true)
        } else {
            setItemIsSplit(false)
            setBillCat(item?.categories?.length
                ? item.categories[0]
                : item.bill
                    ? item.bill
                    : item.predicted_category ? item.predicted_category : item.predicted_bill
            )
        }
    }, [item])

    useAccessEsc({
        refs: [buttonContainerRef, dropdownRef],
        visible: showBillCatSelect,
        setVisible: setShowBillCatSelect,
    })

    useEffect(() => {
        if (showBillCatSelect && billCat) {
            confirmTransactions([{
                transaction_id: item.transaction_id,
                ...(isCategory(billCat)
                    ? { splits: [{ category: billCat.id, fraction: 1 }] }
                    : { bill: billCat.id })
            }])
            setShowBillCatSelect(false)
        }
    }, [billCat])

    return (
        <div className='inner-window' id="bills-and-categories">
            <div>{getBillCategoryLabel(item)}</div>
            {!itemIsSplit
                ?
                <div ref={buttonContainerRef} id="bill-cat-selector--container">
                    <BillCatLabel
                        as='button'
                        ref={buttonContainerRef}
                        color={billCat?.period === 'month' ? 'blue' : 'green'}
                        name={billCat?.name || ''}
                        emoji={billCat?.emoji}
                        slim={true}
                        onClick={() => { setShowBillCatSelect(!showBillCatSelect) }}
                    />
                    <div>
                        <DropDownDiv
                            placement='left'
                            visible={showBillCatSelect}
                            ref={dropdownRef}
                        >
                            <SelectCategoryBill
                                includeBills={false}
                                value={billCat}
                                onChange={setBillCat}
                                month={dayjs(item.datetime || item.date).month() + 1}
                                year={dayjs(item.datetime || item.date).year()}
                            />
                        </DropDownDiv>
                    </div>
                </div>
                : item.categories?.map((cat) => (
                    <div key={cat.id}>
                        <BillCatLabel
                            color={cat.period === 'month' ? 'blue' : 'green'}
                            name={cat.name}
                            emoji={cat.emoji}
                            slim={true}
                            hoverable={itemIsSplit}
                            tint={true}
                        />
                    </div>
                ))
            }
        </div>
    )
}

const TransactionModal = withModal<{ item: Transaction, splitMode?: boolean }>(({ item, splitMode }) => {
    const loaded = useLoaded(1000)
    const [action, setAction] = useState<Action | undefined>()
    const [edit, setEdit] = useState(false)
    const [preferredName, setPreferredName] = useState<string | undefined>()
    const [updateTransaction] = useUpdateTransactionMutation()
    const [nameIsDirty, setNameIsDirty] = useState(false)

    return (
        <>
            <div className='transaction-info--header'>
                <div style={{ textAlign: 'center' }}>
                    <DollarCents value={item?.amount && new Big(item.amount).times(100).toNumber()} />
                </div>
                {edit
                    ? <div>
                        <input
                            autoFocus
                            defaultValue={item?.preferred_name || item?.name}
                            onChange={(e) => {
                                setNameIsDirty(true)
                                setPreferredName(e.target.value)
                            }}
                            onKeyDown={(e: any) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    e.target.blur()
                                }
                            }}
                            onBlur={(e) => {
                                nameIsDirty && updateTransaction({
                                    transactionId: item.transaction_id,
                                    data: { preferred_name: e.target.value }
                                })
                                setEdit(false)
                            }}
                        />
                    </div>
                    : <button onClick={() => setEdit(true)}>
                        {preferredName || item?.preferred_name || item?.name}
                        <Edit size={'.8em'} fill={'currentColor'} />
                    </button>}
                {item.pending &&
                    <div className='pending'>Pending</div>}
            </div>
            <AnimatePresence mode='wait'>
                {action === 'split' &&
                    <SlideMotionDiv key={'split-item'} position='last'>
                        <SplitTransactionInput
                            item={item}
                            onCancel={() => { setAction(undefined) }}
                        />
                    </SlideMotionDiv>
                }
                {action === undefined &&
                    <SlideMotionDiv key={'default-view'} position={loaded ? 'first' : 'fixed'}>
                        <Actions setAction={setAction} />
                        <div className='transaction-info--container'>
                            {(item.predicted_bill || item.predicted_category || item.bill || (item.categories?.length || 0) > 0)
                                && <CategoriesBillInnerWindow item={item} />}
                            <InfoTableInnerWindow item={item} />
                            <NoteInnerWindow item={item} />
                        </div>
                    </SlideMotionDiv>
                }
            </AnimatePresence>
        </>
    )
})

export default TransactionModal
