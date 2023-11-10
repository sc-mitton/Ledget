import { useNavigate, Outlet } from 'react-router-dom'

import { useGetAccountsQuery } from "@features/accountsSlice"
import { EdgeGlowPillButton } from '@ledget/ui'

import { AccountWafers, SkeletonWafers } from './AccountWafers'
import { TransactionsTable, Transactions } from './TransactionsTable'

const Deposits = () => {
    const navigate = useNavigate()

    const {
        data: accountsData,
        isFetching: isFetchingAccounts,
        isError: isErrorLoadingAccounts,
    } = useGetAccountsQuery()

    return (
        <>
            {(isFetchingAccounts || isErrorLoadingAccounts)
                ? <SkeletonWafers />
                : <AccountWafers />
            }
            <TransactionsTable>
                <Transactions />
            </TransactionsTable>
            <Outlet />
            {accountsData?.accounts.length === 0 &&
                <div className="add-accounts-btn--container" >
                    <h2>No Accounts Added Yet</h2>
                    <EdgeGlowPillButton onClick={() => { navigate('/profile/connections') }} >
                        Add account
                    </EdgeGlowPillButton>
                </div>
            }
        </>
    )
}

export default Deposits
