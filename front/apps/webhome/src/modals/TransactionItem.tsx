import { useState, useEffect, useRef, useCallback } from 'react'

import Big from 'big.js'
import { Menu } from '@headlessui/react'
import { AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import { Check, Trash2, Edit2, ArrowLeft, ArrowRight } from '@geist-ui/icons'

import styles from './styles/transaction-item.module.scss'
import { Transaction } from '@features/transactionsSlice'
import { useGetAccountsQuery } from "@features/accountsSlice"
import { withModal, Base64Logo, DollarCents, BillCatLabel } from '@ledget/ui'
import { SelectCategoryBill } from '@components/inputs'
import {
    useConfirmTransactionsMutation,
    useAddNoteMutation,
    useUpdateDeleteNoteMutation,
    useUpdateTransactionMutation,
    Note
} from '@features/transactionsSlice'
import { Bill } from "@features/billSlice";
import { Category, isCategory } from "@features/categorySlice";
import { Ellipsis } from '@ledget/media'
import { SplitTransactionInput } from '@components/split'
import {
    DropdownDiv,
    useCloseDropdown,
    DropdownItem,
    SlideMotionDiv,
    useLoaded,
    CircleIconButton,
    Tooltip,
    IconButtonHalfGray,
    TextArea,
    NestedWindow2,
    WindowCorner
} from '@ledget/ui'

type Action = 'split'

const Actions = ({ setAction }: { setAction: React.Dispatch<React.SetStateAction<Action | undefined>> }) => {
    const [openEllipsis, setOpenEllipsis] = useState(false)

    return (
        <Menu as={WindowCorner}>
            {({ open }) => (
                <>
                    <Menu.Button as={IconButtonHalfGray} onClick={() => setOpenEllipsis(!openEllipsis)}>
                        <Ellipsis rotate={90} size={'1.375em'} />
                    </Menu.Button>
                    <DropdownDiv
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
                                        <div style={{ marginLeft: '-.25em' }}>
                                            <ArrowLeft size={'.8em'} strokeWidth={2} /><ArrowRight size={'.8em'} strokeWidth={2} />
                                        </div>
                                        <span>Split</span>
                                    </DropdownItem>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </DropdownDiv>
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

    const handler = useCallback((e: any) => {
        if (e.key === 'Escape') {
            e.stopPropagation()
            setFocusedNoteId(undefined)
            notesContainerRef.current?.blur()
            notesContainerRef.current?.querySelector<HTMLTextAreaElement>(
                `[data-focused='true']`)?.blur()
        } else if (e.key === 'Enter') {
            e.stopPropagation()
            if (a11yNote === undefined) {
                setFocusedNoteId('new')
            } else {
                setFocusedNoteId(notes.concat(notesToSend2Server).find((_, index) => index === a11yNote)?.id)
            }
            notesContainerRef.current?.querySelector<HTMLTextAreaElement>(
                `[data-accessible-focused='true']`)?.focus()
        } else if (e.key === 'ArrowUp') {
            e.stopPropagation()
            setA11yNote(prev => prev === 0
                ? undefined
                : prev === undefined ? undefined : Math.max(0, prev - 1))
        } else if (e.key === 'ArrowDown') {
            e.stopPropagation()
            if (a11yNote === undefined) {
                setA11yNote(0)
            } else {
                setA11yNote(prev => Math.min(notes.concat(notesToSend2Server).length - 1, prev! + 1))
            }
        } else {
            return
        }
    }, [a11yNote])

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

        <NestedWindow2 className={styles.notesContainer}>
            <h4>{`Note${notes.length > 0 ? 's' : ''}`}</h4>
            <div
                data-focused={Boolean(focusedNoteId)}
                tabIndex={0}
                onKeyDown={handler}
                ref={notesContainerRef}
            >
                {focusedNoteId &&
                    <Tooltip msg={'Save'} ariaLabel={'save'} className={styles.noteButton}>
                        <CircleIconButton onClick={() => handleTextAreaBlur()} darker={true}>
                            <Check size={'1.1em'} />
                        </CircleIconButton>
                    </Tooltip>}
                {focusedNoteId && focusedNoteId !== 'new' &&
                    <>
                        <span className={styles.lastChanged}>
                            Last changed&nbsp;
                            {dayjs(notes.find(n => n.id === focusedNoteId)?.datetime).format('h:mma M/DD/YY')}
                        </span>
                        <Tooltip msg={'Delete'} ariaLabel={'delete'} className={styles.noteButton}>
                            <CircleIconButton onClick={() => { handleTrashButtonClick() }} darker={true}>
                                <Trash2 size={'1.1em'} />
                            </CircleIconButton>
                        </Tooltip></>}
                <div>
                    {focusedNoteId &&
                        <TextArea>
                            <TextArea.Area className={styles.noteContainer} data-focused={'true'}>
                                <TextArea.Text
                                    ref={textAreaRef}
                                    defaultValue={notes.concat(notesToSend2Server)
                                        .find(note => note.id === focusedNoteId)?.text}
                                    onChange={(e) => handleTextAreaChange(e, focusedNoteId)}
                                    onBlur={handleTextAreaBlur}
                                    placeholder='Add a note...'
                                    tabIndex={-1}
                                    autoFocus
                                />
                            </TextArea.Area>
                        </TextArea>}
                    <TextArea>
                        <TextArea.Area
                            className={styles.noteContainer}
                            data-accessible-focused={a11yNote === undefined}
                            onClick={() => { setFocusedNoteId('new') }}
                        >
                            <TextArea.Text
                                value={newNote?.text || ''}
                                onChange={() => { }}
                                placeholder='Add a note...'
                                tabIndex={-1}
                                readOnly
                            />
                        </TextArea.Area>
                    </TextArea>
                    {notes.concat(notesToSend2Server)
                        .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
                        .map((note, index) => (
                            <div
                                className={styles.noteContainer}
                                data-disabled={!note.is_current_users}
                                data-accessible-focused={a11yNote === index}
                                onClick={() =>
                                    note.is_current_users &&
                                    setFocusedNoteId(note.id)}
                                key={note.id}>
                                {note.text}
                            </div>
                        ))}
                </div>
            </div>
        </NestedWindow2>
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
        <NestedWindow2 className={styles.transactionDetails}>
            <div>Account</div>
            <div className={styles.accountInfoCell}>
                <div>
                    <a href={institution?.url} target="_blank" rel="noreferrer">
                        <Base64Logo
                            data={institution?.logo}
                            alt={institution?.name?.charAt(0).toUpperCase()}
                        />
                    </a>
                    <span>{account?.official_name}</span>
                </div>
                <span>&nbsp;&bull;&nbsp;&bull;&nbsp;{account?.mask}</span>
            </div>
            {item?.merchant_name &&
                <>
                    <div>Merchant </div>
                    <div>
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
        </NestedWindow2>
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

    useCloseDropdown({
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
        <NestedWindow2 className={styles.billsAndCategories}>
            <div>{getBillCategoryLabel(item)}</div>
            {!itemIsSplit
                ?
                <div ref={buttonContainerRef} className={styles.billCatSelectorContainer}>
                    <BillCatLabel
                        as='button'
                        ref={buttonContainerRef}
                        color={billCat?.period === 'month' ? 'blue' : 'green'}
                        labelName={billCat?.name || ''}
                        emoji={billCat?.emoji}
                        slim={true}
                        onClick={() => { setShowBillCatSelect(!showBillCatSelect) }}
                    />
                    <DropdownDiv
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
                    </DropdownDiv>
                </div>
                : item.categories?.map((cat) => (
                    <div key={cat.id}>
                        <BillCatLabel
                            color={cat.period === 'month' ? 'blue' : 'green'}
                            labelName={cat.name}
                            emoji={cat.emoji}
                            slim={true}
                            hoverable={itemIsSplit}
                        />
                    </div>
                ))
            }
        </NestedWindow2>
    )
}

export const TransactionModalContent = (({ item, splitMode }: { item: Transaction, splitMode?: boolean }) => {
    const loaded = useLoaded(1000)
    const [action, setAction] = useState<Action | undefined>(splitMode ? 'split' : undefined)
    const [edit, setEdit] = useState(false)
    const [preferredName, setPreferredName] = useState<string | undefined>()
    const [updateTransaction] = useUpdateTransactionMutation()
    const [nameIsDirty, setNameIsDirty] = useState(false)

    return (
        <>
            <div className={styles.transactionInfoHeader}>
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
                        <Edit2 size={'1em'} />
                    </button>}
                {item.pending &&
                    <div className={styles.pending}>Pending</div>}
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
                        <div className={styles.transactionInfoContainer}>
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

const TransactionModal = withModal<{ item: Transaction, splitMode?: boolean }>(({ item, splitMode }) => {
    return <TransactionModalContent item={item} splitMode={splitMode} />
})

export default TransactionModal
