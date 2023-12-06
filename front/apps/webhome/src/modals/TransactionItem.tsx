import { useState, useEffect, useRef } from 'react'

import Big from 'big.js'
import { Menu } from '@headlessui/react'
import { AnimatePresence } from 'framer-motion'

import './styles/TransactionItem.scss'
import { Transaction } from '@features/transactionsSlice'
import { useGetAccountsQuery } from "@features/accountsSlice"
import { withModal, Base64Logo, DollarCents } from '@ledget/ui'
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
    DropAnimation,
    BillCatButton,
    useAccessEsc,
    IconButton,
    SlideMotionDiv,
    useLoaded
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
                        <DropAnimation
                            placement='right'
                            className='dropdown arrow-right right'
                            visible={open}
                        >
                            <Menu.Items static>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`dropdown-item ${active && "active-dropdown-item"}`}
                                            onClick={() => setAction('split')}
                                        >
                                            <Split />
                                            <span>Split</span>
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </DropAnimation>
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
        <div className='inner-window'>
            <div>{getBillCategoryLabel(item)}</div>
            {changeAble
                ?
                <div ref={buttonContainerRef}>
                    <BillCatButton
                        color={billCat?.period === 'month' ? 'blue' : 'green'}
                        slimLevel={2}
                        onClick={() => { setShowBillCatSelect(!showBillCatSelect) }}
                    >
                        <span>{billCat?.emoji}</span>
                        <span>{billCat?.name.charAt(0).toUpperCase()}{billCat?.name.slice(1)}</span>
                    </BillCatButton>
                    <DropAnimation
                        placement='left'
                        visible={showBillCatSelect}
                        className="dropdown"
                        ref={dropdownRef}
                    >
                        <SelectCategoryBill
                            includeBills={true}
                            value={billCat}
                            onChange={setBillCat}
                            month={new Date(item.datetime).getMonth() + 1}
                            year={new Date(item.datetime).getFullYear()}
                        />
                    </DropAnimation>
                </div>
                : item.categories?.map((cat) => (
                    <div key={cat.id}>
                        <BillCatButton
                            color={cat.period === 'month' ? 'blue' : 'green'}
                            slimLevel={2}
                        >
                            <span>{cat.emoji}</span>
                            <span>{cat.name.charAt(0).toUpperCase()}{cat.name.slice(1)}</span>
                        </BillCatButton>
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
                {new Date(item?.datetime).toLocaleDateString('en-US', { 'month': 'short', 'day': 'numeric', 'year': 'numeric' })}
            </div>
            {(item?.address || item?.city || item?.region) &&
                <>
                    <div>Location </div>
                    <div>
                        <span>{item?.address}</span>
                        <span>{`${item?.city}${item?.region ? ', ' + item.region : ''}`}</span>
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

const TransactionModal = withModal<{ item: Transaction }>(({ item }) => {
    const loaded = useLoaded(1000)
    const [action, setAction] = useState<Action>()
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
                            {(item.predicted_bill || item.predicted_category || item.bill || item.categories?.length)
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
