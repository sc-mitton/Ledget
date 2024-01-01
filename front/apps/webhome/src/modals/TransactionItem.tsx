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
import { Ellipsis, Split, Edit } from '@ledget/media'
import { SplitTransactionInput } from '@components/split'
import {
    DropDownDiv,
    useAccessEsc,
    IconButton,
    SlideMotionDiv,
    useLoaded,
    DropdownItem
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

function CategoriesBillInnerWindow({ item }: { item: Transaction }) {
    const [changeAble, setChangeAble] = useState(false)
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
            setChangeAble(false)
        } else {
            setChangeAble(true)
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
            {changeAble
                ?
                <div ref={buttonContainerRef}>
                    <BillCatLabel
                        color={billCat?.period === 'month' ? 'blue' : 'green'}
                        name={billCat?.name || ''}
                        emoji={billCat?.emoji}
                        slim={true}
                        hoverable={changeAble}
                        onClick={() => { setShowBillCatSelect(!showBillCatSelect) }}
                    />
                    <DropDownDiv
                        placement='left'
                        visible={showBillCatSelect}
                        ref={dropdownRef}
                    >
                        <SelectCategoryBill
                            includeBills={true}
                            value={billCat}
                            onChange={setBillCat}
                            month={dayjs(item.datetime || item.date).month() + 1}
                            year={dayjs(item.datetime || item.date).year()}
                        />
                    </DropDownDiv>
                </div>
                : item.categories?.map((cat) => (
                    <div key={cat.id}>
                        <BillCatLabel
                            color={cat.period === 'month' ? 'blue' : 'green'}
                            name={cat.name}
                            emoji={cat.emoji}
                            slim={true}
                            hoverable={changeAble}
                            tint={true}
                        />
                    </div>
                ))
            }
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

const NoteInnerWindow = ({ item }: { item: Transaction }) => {
    const [addNote] = useAddNoteMutation()
    const [updateDeleteNote] = useUpdateDeleteNoteMutation()
    const [showHeader, setShowHeader] = useState(false)
    const [isDirty, setIsDirty] = useState(false)

    const handleAddSubmit = (text: string) => {
        if (text) {
            setShowHeader(true)
            addNote({ transactionId: item.transaction_id, text })
        }

    }

    const handleModifySubmit = (note: Note, text: string) => {
        if (text) {
            isDirty && updateDeleteNote({
                transactionId: item.transaction_id,
                noteId: note.id,
                text
            })
        }
    }

    return (
        <div className='inner-window'>
            {(item.notes.length > 0 || showHeader) &&
                <h4>{`Note${item.notes.length > 1 ? 's' : ''}`}</h4>}
            {item.notes.filter(note => !note.is_current_users).map((note) => (
                <div key={note.id}>
                    <span>{'avatar'}</span>
                    <span>{note.text}</span>
                </div>
            ))}
            {item.notes.filter(note => note.is_current_users).length > 0
                ?
                <div>
                    {item.notes.filter(note => !note.is_current_users).length > 0 &&
                        <span>{'avatar'}</span>}
                    {item.notes.filter(note => note.is_current_users).map((note) => (
                        <input
                            onChange={() => setIsDirty(true)}
                            type="text"
                            key={note.id}
                            defaultValue={note.text}
                            onBlur={(e) => handleModifySubmit(note, e.target.value)}
                        />
                    ))}
                </div>
                :
                <div>
                    <input
                        onBlur={(e) => handleAddSubmit(e.target.value)}
                        type="text"
                        placeholder="Add a note..."
                    />
                </div>
            }
        </div>
    )
}

const TransactionModal = withModal<{ item: Transaction, action?: Action }>(({ item, action: propsAction }) => {
    const loaded = useLoaded(1000)
    const [action, setAction] = useState<Action | undefined>(propsAction)
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
