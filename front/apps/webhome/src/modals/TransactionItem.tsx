import { useState, useEffect, useRef } from 'react'

import Big from 'big.js'
import { Menu } from '@headlessui/react'

import './styles/TransactionItem.scss'
import { Transaction } from '@features/transactionsSlice'
import { useGetAccountsQuery } from "@features/accountsSlice"
import { withModal, Base64Logo, DollarCents } from '@ledget/ui'
import { SelectCategoryBill } from '@components/dropdowns'
import {
    useUpdateTransactionsMutation,
    useAddNoteMutation,
    useUpdateDeleteNoteMutation
} from '@features/transactionsSlice'
import { Bill } from "@features/billSlice";
import { Category, isCategory } from "@features/categorySlice";
import { Ellipsis, Split } from '@ledget/media'
import {
    DropAnimation,
    BillCatButton,
    useAccessEsc,
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
    const [updateTransactions] = useUpdateTransactionsMutation()
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
            updateTransactions([{
                transaction: item,
                ...(isCategory(billCat) ? { categories: [{ ...billCat, fraction: 1 }] } : { bill: billCat.id })
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
                        />
                    </DropAnimation>
                </div>
                : item.categories?.map((cat) => (
                    <div key={cat.id}>
                    </div>
                ))
            }
        </div>
    )
}

const InfoTableInnerWindow = ({ item }: { item: Transaction }) => (
    <div className='inner-window'>
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

const InstitutionInfoInnerWindow = ({ item }: { item: Transaction }) => {
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
        </div>
    )
}

const NoteInnerWindow = ({ item }: { item: Transaction }) => {
    const [addNote] = useAddNoteMutation()
    const [updateDeleteNote] = useUpdateDeleteNoteMutation()

    return (
        <div className='inner-window'>
            {item.notes.map((note) => (
                <input
                    type="text"
                    key={note.id}
                    defaultValue={note.text}
                    onBlur={(e) => {
                        if (e.target.value) {
                            updateDeleteNote({
                                transactionId: item.transaction_id,
                                noteId: note.id,
                                note: e.target.value
                            })
                        }
                    }}
                />
            ))}
            <input
                onBlur={(e) => {
                    if (e.target.value) {
                        addNote({
                            transactionId: item.transaction_id,
                            note: e.target.value
                        })
                    }
                }}
                type="text"
                placeholder="Add a note..."
            />
        </div>
    )
}

const TransactionModal = withModal<{ item: Transaction }>(({ item }) => {
    const [action, setAction] = useState<Action>()

    return (
        <>
            <Actions setAction={setAction} />
            <div className='transaction-info--header'>
                <div style={{ textAlign: 'center' }}>
                    <DollarCents value={item?.amount && new Big(item.amount).times(100).toNumber()} />
                </div>
                <div>{item?.preferred_name || item?.name}</div>
            </div>
            <div className='transaction-info--container'>
                <CategoriesBillInnerWindow item={item} />
                <InstitutionInfoInnerWindow item={item} />
                <InfoTableInnerWindow item={item} />
                <NoteInnerWindow item={item} />
            </div>
        </>
    )
})

export default TransactionModal
