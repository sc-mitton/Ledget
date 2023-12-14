import { Outlet } from 'react-router-dom'

import { TransactionsTable, Transactions } from './TransactionsTable'

const Deposits = () => (
    <>
        <TransactionsTable>
            <Transactions />
        </TransactionsTable>
        <Outlet />
    </>
)

export default Deposits
