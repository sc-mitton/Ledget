import { useSearchParams } from "react-router-dom"
import Big from 'big.js'

import { InsitutionLogo } from '@components/pieces'
import { CornerGripButton } from '@components/buttons'
import { Account } from '@features/accountsSlice'
import { DollarCents } from '@ledget/ui'


const DepositAccountWafer = ({ account, onClick }: { account: Account, onClick: (arg: string) => void }) => {
    const nameIsLong = account.official_name?.length || 0 > 18
    const nameLength = account.official_name?.length || 0
    const [searchParams] = useSearchParams()

    return (
        <div
            tabIndex={0}
            className={`account-wafer ${searchParams.get('account') === account.account_id ? 'active' : 'inactive'}`}
        >
            <CornerGripButton
                id={`${account.account_id}`}
                tabIndex={-1}
            />
            <div
                role="button"
                tabIndex={-1}
                onClick={() => { onClick(account.account_id) }}
            >
                <InsitutionLogo accountId={account.account_id} />
                <div className={`wafer-name ${nameIsLong ? 'marquee' : ''}`}>
                    {nameIsLong && <div className='marquee--placeholder'>{account.official_name?.slice(0, 18)}...</div>}
                    <div className={`${nameIsLong ? 'marquee--leader' : ''}`} style={{ animationDuration: `${nameLength / 2}s` }}>
                        {account.official_name}
                    </div>
                    {nameIsLong && <div className="marquee--caboose" style={{ animationDuration: `${nameLength / 2}s` }}>{account.official_name}</div>}
                    {nameIsLong && <div className="marquee--spacer">{account.official_name}</div>}
                </div>
                <div className='wafer-meta'>
                    {`${account.subtype} ${account.type === 'loan' ? 'loan' : ''}`}
                    &nbsp;&bull;&nbsp;&bull;&nbsp;
                    {account.mask}
                </div>
                <div className="wafer-balance">
                    <div><DollarCents value={Big(account.balances.current).times(100).toNumber()} /></div>
                </div>
            </div>
        </div>
    )
}

export default DepositAccountWafer
