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
    Note
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
import { set } from 'react-hook-form'


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
    const [addNote, {
        data: newNoteResponseData,
        isLoading: isAddingNote
    }] = useAddNoteMutation()
    const [updateDeleteNote] = useUpdateDeleteNoteMutation()

    const [focusedNoteId, setFocusedNoteId] = useState<string>()
    const [a11yNote, setA11yNote] = useState<number>()
    const [notes, setNotes] = useState(item.notes)
    const [notesToSend2Server, setNotesToSend2Server] = useState<Note[]>([])
    const [newNote, setNewNote] = useState<Note>()

    const notesContainerRef = useRef<HTMLDivElement>(null)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const dirtyFields = useRef<{ [key: string]: boolean }>({})

    // As responses come from the server, there may possibily by
    // new notes that are backed up in the notesToSend2Server state
    // which need to be posted to the server
    useEffect(() => {
        if (newNoteResponseData) {
            // Update the notes cached id
            setNotes(prev => prev.map(note => note.id.includes('new')
                ? { ...note, id: newNoteResponseData.id }
                : note))
        }
        // If there are any queued notes, we need to send them
        if (notesToSend2Server.length) {
            // Use timeout to make sure that it doesn't conflict with
            // the previous conditional statement where it updates
            // the notes state
            const timeout = setTimeout(() => {
                const note = notesToSend2Server[0]
                setNotes(prev => [...prev, note])
                setNotesToSend2Server(prev => prev.filter(n => n.id !== note.id))

                addNote({
                    transactionId: item.transaction_id,
                    text: note.text
                })
            }, 100)
            return () => clearTimeout(timeout)
        }
    }, [newNoteResponseData])

    const handleUpdateDeleteNote = (noteId: string, options?: { delete?: boolean }) => {
        if (!dirtyFields.current[noteId] && !options?.delete) return

        const text = notes.find(n => n.id === noteId)?.text
        updateDeleteNote({
            transactionId: item.transaction_id,
            noteId: noteId,
            ...(options?.delete ? {} : { text: text })
        })
        // If note is empty, remove it from state
        if (text === '' || options?.delete) {
            setNotes(prev => prev.filter(note => note.id !== noteId))
        }
        // Unset dirtiness
        dirtyFields.current[noteId] = false
    }

    // Handle navigating between notes
    const handleNoteAccessibleNav = (e: React.KeyboardEvent) => {
        document.activeElement === notesContainerRef.current && e.preventDefault()
        if (e.key === 'ArrowUp') {
            setA11yNote(a11yNote === undefined ? notes.length - 1 : a11yNote - 1)
        } else if (e.key === 'ArrowDown') {
            setA11yNote(a11yNote === undefined ? 0 : a11yNote + 1)
        } else if (e.key === 'Enter' && a11yNote !== undefined) {
            setFocusedNoteId(notes.concat(notesToSend2Server).find((_, index) => index === a11yNote)?.id)
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

    const handleTextAreaChange = (e: React.FormEvent<HTMLTextAreaElement>, noteId: string) => {
        // Set the dirty flag for the note
        dirtyFields.current[noteId] = true
        const text = (e.target as any).value

        // If the note is new, then we need to add it to the notes state
        if (noteId === 'new') {
            setNewNote(prev => (prev ?
                { ...prev, text: text } :
                {
                    id: `new-${Math.random().toString(36).substring(2, 10)}`,
                    text: text,
                    is_current_users: true,
                    datetime: new Date().toISOString()
                }
            ))
        }
        // Otherwise, then we need to update the note in the state
        else {
            if (notesToSend2Server.find(note => note.id === noteId)) {
                setNotesToSend2Server(prev => prev.map(note => note.id === noteId ? {
                    ...note,
                    text: text,
                    datetime: new Date().toISOString()
                } : note))
            } else {
                setNotes(prev => prev.map(note => note.id === noteId ? {
                    ...note,
                    text: text,
                    datetime: new Date().toISOString()
                } : note))
            }
        }
    }

    const handleTrashButtonClick = () => {
        if (notesToSend2Server.find(n => n.id === focusedNoteId)) {
            setNotesToSend2Server(prev => prev.filter(note => note.id !== focusedNoteId))
        } else if (focusedNoteId) {
            handleUpdateDeleteNote(focusedNoteId, { delete: true })
        }
        setFocusedNoteId(undefined)
    }

    const handleTextAreaBlur = (e?: React.FocusEvent<HTMLTextAreaElement>) => {
        if (notesContainerRef.current?.contains(e?.relatedTarget as Node))
            e?.preventDefault()
        else if (focusedNoteId === 'new' && newNote) {

            if (isAddingNote) {
                setNotesToSend2Server(prev => [newNote, ...prev])
            } else {
                setNotes(prev => [...prev, newNote])
                addNote({
                    transactionId: item.transaction_id,
                    text: newNote.text
                })
            }
            setNewNote(undefined)
            setFocusedNoteId(undefined)

        } else if (focusedNoteId) {
            if (!notesToSend2Server.find(n => n.id === focusedNoteId)) {
                handleUpdateDeleteNote(focusedNoteId)
            }
            setFocusedNoteId(undefined)
        }
    }

    return (
        <div className='modal-inner-window'>
            <h4>{`Note${notes.length > 0 ? 's' : ''}`}</h4>
            <div
                id="notes--container"
                className={`${focusedNoteId ? 'focused' : ''}`}
                tabIndex={0}
                ref={notesContainerRef}
                onKeyDown={handleNoteAccessibleNav}
                onBlur={() => setA11yNote(undefined)}
            >
                {focusedNoteId &&
                    <Tooltip msg={'Save'} ariaLabel={'save'}>
                        <CircleIconButton onClick={() => handleTextAreaBlur()}>
                            <CheckMark stroke={'currentColor'} size={'.8em'} />
                        </CircleIconButton>
                    </Tooltip>}
                {focusedNoteId && focusedNoteId !== 'new' &&
                    <>
                        <span className="last-changed">
                            Last changed&nbsp;
                            {dayjs(notes.find(n => n.id === focusedNoteId)?.datetime).format('h:mma M/DD/YY')}
                        </span>
                        <Tooltip msg={'Delete'} ariaLabel={'delete'}>
                            <CircleIconButton onClick={() => { handleTrashButtonClick() }}>
                                <TrashIcon fill={'currentColor'} size={'.9em'} />
                            </CircleIconButton>
                        </Tooltip></>}
                <div>
                    {focusedNoteId &&
                        <AutoResizeTextArea
                            ref={textAreaRef}
                            divProps={{ className: "note--container focused" }}
                            defaultValue={notes.concat(notesToSend2Server)
                                .find(note => note.id === focusedNoteId)?.text}
                            onChange={(e) => handleTextAreaChange(e, focusedNoteId)}
                            onBlur={handleTextAreaBlur}
                            placeholder='Add a note...'
                            tabIndex={-1}
                            autoFocus
                        />}
                    <AutoResizeTextArea
                        // Placeholder textarea to add a new note
                        // Also a tracker for the new note to keep the sizing right
                        divProps={{
                            className: `note--container ${a11yNote === 0 ? 'accessible-focused' : ''}`,
                            onClick: () => setFocusedNoteId('new')
                        }}
                        value={newNote?.text || ''}
                        onChange={() => { }}
                        placeholder='Add a note...'
                        tabIndex={-1}
                        readOnly
                    />
                    {notes.concat(notesToSend2Server)
                        .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
                        .map((note, index) => (
                            <div
                                className={`note--container
                                ${!note.is_current_users ? 'disabled' : ''}
                                ${a11yNote === index ? 'accessible-focused' : ''}`}
                                onClick={() =>
                                    note.is_current_users &&
                                    setFocusedNoteId(note.id)}
                                key={note.id}>
                                {note.text}
                            </div>
                        ))}
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
        <div className='modal-inner-window'>
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
        <div className='modal-inner-window' id="bills-and-categories">
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
