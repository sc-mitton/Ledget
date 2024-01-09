import { useState, useEffect, useRef } from 'react'

import Big from 'big.js'
import { Menu } from '@headlessui/react'
import { AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'

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
    IconButton,
    AutoResizeTextArea
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

const NoteInnerWindow = ({ item }: { item: Transaction }) => {
    // Redux hooks
    const [addNote] = useAddNoteMutation()
    const [updateDeleteNote] = useUpdateDeleteNoteMutation()

    const [focusedNoteId, setFocusedNoteId] = useState<string>()
    const [a11yNote, setA11yNote] = useState<number>()
    const [notes, setNotes] = useState([...item.notes].sort((a, b) =>
        new Date(a.datetime).getTime() > new Date(b.datetime).getTime() ? -1 : 1))

    const notesContainerRef = useRef<HTMLDivElement>(null)
    const dirtyFields = useRef<{ [key: string]: boolean }>(
        { new: false, ...Object.fromEntries(item.notes.map((note) => [note.id, false])) })

    const handleNoteSaveUpdate = (noteId?: string) => {
        const inputElement = notesContainerRef.current?.querySelector<HTMLTextAreaElement>(
            '[data-focused="true"]')

        // If the note is new, and it has text, then add it to the notes state
        // and add another inputRef
        if (noteId === 'new' && inputElement?.value) {
            const newNote = {
                id: `${Math.random().toString(36).substring(2, 8)}${notes.length}`,
                text: inputElement?.value || '',
                is_current_users: true,
                datetime: dayjs().toISOString()
            }
            setNotes(prev => [newNote, ...prev])
            inputElement.value = ''
        }
        // If the note is dirty, then update the note in the state
        else if (noteId && dirtyFields.current[noteId]) {
            // Update the cached note
            setNotes(prev => prev.map(note => note.id === noteId ? {
                ...note,
                text: inputElement?.value || '',
                datetime: new Date().toISOString()
            } : note))
        }
        setFocusedNoteId(undefined)
    }

    const textAreaBlurHandler = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        if (notesContainerRef.current?.contains(e.relatedTarget as Node)) {
            e.preventDefault()
        } else {
            handleNoteSaveUpdate(e.currentTarget.dataset.focused)
        }
    }

    // On unmount, send the updates, deletes, and creates to the server
    useEffect(() => {
        return () => {
            console.log('unmount actions')
            item.notes.forEach((note) => {
                // If the note is not in the notes state, then it was deleted
                if (!notes.find(n => n.id === note.id)) {
                    updateDeleteNote({
                        transactionId: item.transaction_id,
                        noteId: note.id,
                    })
                } else if (dirtyFields.current[note.id]) {
                    // If the note is dirty, and it's text doesn't
                    // match what's in the item.notes, then it was updated
                    const text = notes.find(n => n.id === note.id)?.text
                    if (text !== note.text) {
                        updateDeleteNote({
                            transactionId: item.transaction_id,
                            noteId: note.id,
                            text: text
                        })
                    }
                }
            })
            notes.forEach((note) => {
                // If the note is not in the item.notes, then it was created
                if (!item.notes.find(n => n.id === note.id)) {
                    addNote({
                        transactionId: item.transaction_id,
                        text: note.text
                    })
                }
            })
        }
    }, [])

    // Handle navigating between notes
    const handleNoteAccessibleNav = (e: React.KeyboardEvent) => {
        document.activeElement === notesContainerRef.current && e.preventDefault()
        if (e.key === 'ArrowUp') {
            setA11yNote(a11yNote === undefined ? notes.length - 1 : a11yNote - 1)
        } else if (e.key === 'ArrowDown') {
            setA11yNote(a11yNote === undefined ? 0 : a11yNote + 1)
        } else if (e.key === 'Enter' && a11yNote !== undefined) {
            setFocusedNoteId(notes.find((_, index) => index === a11yNote)?.id)
            notesContainerRef.current?.querySelector<HTMLTextAreaElement>(
                `[data-accessible-focused='true']`)?.focus()
        } else if (e.key === 'Escape') {
            e.stopPropagation()
            setFocusedNoteId(undefined)
            notesContainerRef.current?.blur()
            notesContainerRef.current?.querySelector<HTMLTextAreaElement>(
                `[data-focused='true']`)?.blur()
        }
    }

    return (
        <div className='inner-window'>
            <h4>{`Note${item.notes.length > 1 ? 's' : ''}`}</h4>
            <div
                id="notes--container"
                tabIndex={0}
                ref={notesContainerRef}
                onKeyDown={handleNoteAccessibleNav}
                onBlur={() => setA11yNote(undefined)}
            >
                <div>
                    <AutoResizeTextArea
                        divProps={{
                            className: `note--container
                            ${focusedNoteId === 'new' ? 'focused' : ''}
                            ${a11yNote === 0 ? 'accessible-focused' : ''}`
                        }}
                        data-accessible-focused={a11yNote === 0}
                        data-focused={focusedNoteId === 'new'}
                        defaultValue={''}
                        onChange={(e) => { dirtyFields.current['new'] = true }}
                        onFocus={() => { setFocusedNoteId('new') }}
                        onBlur={textAreaBlurHandler}
                        placeholder='Add a note...'
                        tabIndex={-1}
                    />
                    {notes.map((note, index) => (
                        <>
                            <AutoResizeTextArea
                                divProps={{
                                    className: `note--container
                                        ${focusedNoteId === note.id ? 'focused' : ''}
                                        ${a11yNote === index + 1 ? 'accessible-focused' : ''}`,
                                    key: `note${index}`
                                }}
                                date-text={note.text}
                                data-accessible-focused={a11yNote === index + 1}
                                data-focused={focusedNoteId === note.id}
                                key={`field${note.id}`}
                                defaultValue={note.text}
                                disabled={!notes[index]?.is_current_users}
                                onChange={(e) => { dirtyFields.current[note.id] = true }}
                                onFocus={() => setFocusedNoteId(note.id)}
                                onBlur={textAreaBlurHandler}
                                tabIndex={-1}
                            />
                            {focusedNoteId === note.id &&
                                <span className="last-changed">
                                    Last changed&nbsp;
                                    {dayjs(notes[index].datetime).format('h:mma M/DD/YY')}
                                </span>}
                        </>
                    ))}
                    {focusedNoteId && focusedNoteId !== 'new' &&
                        <Tooltip msg={'Delete'} ariaLabel={'delete'}>
                            <CircleIconButton onClick={(e) => {
                                setNotes(prev => prev.filter(note => note.id !== focusedNoteId))
                                setFocusedNoteId(undefined)
                            }}>
                                <TrashIcon size={'.9em'} />
                            </CircleIconButton>
                        </Tooltip>}
                    {focusedNoteId &&
                        <Tooltip msg={'Save'} ariaLabel={'save'}>
                            <CircleIconButton onClick={() => handleNoteSaveUpdate(focusedNoteId)}>
                                <CheckMark size={'.8em'} />
                            </CircleIconButton>
                        </Tooltip>}
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
