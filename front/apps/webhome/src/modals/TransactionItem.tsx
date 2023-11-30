import { useState, useEffect, useRef } from 'react'

import Big from 'big.js'

import './styles/TransactionItem.scss'
import { Transaction } from '@features/transactionsSlice'
import { useGetAccountsQuery } from "@features/accountsSlice"
import { withModal, Base64Logo, DollarCents } from '@ledget/ui'
import { SelectCategoryBill } from '@components/dropdowns'
import { useUpdateTransactionsMutation } from '@features/transactionsSlice'
import { Bill } from "@features/billSlice";
import { Category, isCategory } from "@features/categorySlice";
import { DropAnimation, BillCatButton, useAccessEsc } from '@ledget/ui'

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


const TransactionModal = withModal<{ item: Transaction }>(({ item }) => {

    const [institution, setInstitution] = useState<any>({})
    const [account, setAccount] = useState<any>({})

    const { data: accountsData, isSuccess: accountsFetched } = useGetAccountsQuery()

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
        <>
            <div className='transaction-info--header'>
                <div style={{ textAlign: 'center' }}>
                    <DollarCents value={item?.amount && new Big(item.amount).times(100).toNumber()} />
                </div>
                <div>{item?.preferred_name || item?.name}</div>
            </div>
            <div className='transaction-info--container'>
                <div className='inner-window'>
                    <div >
                        <a href={institution?.url} target="_blank" rel="noreferrer">
                            <Base64Logo
                                data={institution?.logo}
                                alt={institution?.name?.charAt(0).toUpperCase()}
                            />
                        </a>
                    </div>
                    <div>
                        <span>{account?.official_name}</span>
                        <span>&nbsp;&bull;&nbsp;&bull;&nbsp;{account?.mask}</span>
                    </div>
                </div>
                <CategoriesBillInnerWindow item={item} />
                <div className='inner-window'>
                    {item?.merchant_name &&
                        <>
                            <div className="merchant-cell">
                                <h4>{item?.merchant_name}</h4>
                            </div>
                        </>}
                    <div>
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
                </div>
            </div>
        </>
    )
})

export default TransactionModal
