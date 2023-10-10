import { useGetAccountsQuery } from "@features/accountsSlice"
import { ShadowedContainer, DollarCents } from '@components/pieces'

const Wafers = () => {
    const { data: accountsData } = useGetAccountsQuery()

    return (
        <div className="accounts-list--container">
            <div>
                <h2>Total Deposits</h2>
                <span>
                    <DollarCents value={
                        String(accountsData?.accounts.filter(account => account.type === 'depository')
                            .reduce((acc, account) => acc + account.balances.current, 0) * 100)
                    }
                    />
                </span>
            </div>
            <div className="account-wafers--container">
                {accountsData?.accounts.filter(account => account.type === 'depository').map(account => (
                    <div key={account.account_id} className="account-wafer">
                        <div className={`wafer-name--container ${account.official_name.length > 18 ? 'masked' : ''}`}>
                            <div className={`${account.official_name.length > 18 ? 'scrolling-text' : ''}`}>
                                {account.official_name}
                            </div>
                            {account.official_name.length > 18 &&
                                <div className='scrolling-text'>{account.official_name}</div>}
                            {account.official_name.length > 18 &&
                                <div className='spacer'>spacer</div>
                            }
                        </div>
                        <div className="wafer-meta--container">
                            <div>
                                {`${account.subtype} ${account.type === 'loan' ? 'loan' : ''}`}
                                &nbsp;&bull;&nbsp;&bull;&nbsp;
                                {account.mask}
                            </div>
                        </div>
                        <div className="wafer-balance--container">
                            <DollarCents value={String(account.balances.current * 100)} />
                        </div>
                    </div>
                ))}
                {accountsData?.accounts.filter(account => account.type === 'depository').map(account => (
                    <div key={account.account_id} className="account-wafer">
                        <div className={`wafer-name--container ${account.official_name.length > 18 ? 'masked' : ''}`}>
                            <div className={`${account.official_name.length > 18 ? 'scrolling-text' : ''}`}>
                                {account.official_name}
                            </div>
                            {account.official_name.length > 18 &&
                                <div className='scrolling-text'>{account.official_name}</div>}
                            {account.official_name.length > 18 &&
                                <div className='spacer'>spacer</div>
                            }
                        </div>
                        <div className="wafer-meta--container">
                            <div>
                                {`${account.subtype} ${account.type === 'loan' ? 'loan' : ''}`}
                                &nbsp;&bull;&nbsp;&bull;&nbsp;
                                {account.mask}
                            </div>
                        </div>
                        <div className="wafer-balance--container">
                            <DollarCents value={String(account.balances.current * 100)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const Deposits = () => (
    <div>
        {/* Account wafers */}
        <Wafers />
        {/* Transaction list for current Account */}
    </div>
)

export default Deposits
