import { useSearchParams } from "react-router-dom"
import Big from 'big.js'

import styles from './styles/wafer.module.scss'
import { InsitutionLogo } from '@components/pieces'
import { DollarCents, CornerGripButton } from '@ledget/ui'
import { WaferProps } from "./types"

const Wafer = ({ account, onClick, styling }: WaferProps) => {
    const nameIsLong = account.official_name?.length || 0 > 18
    const nameLength = account.official_name?.length || 0
    const [searchParams] = useSearchParams()

    const active = searchParams.get('account') === account.id

    return (
        <div
            tabIndex={0}
            className={styles.accountWafer}
            data-styling={styling}
            data-active={active}
        >
            <CornerGripButton
                id={`${account.id}`}
                tabIndex={-1}
            />
            <div
                role="button"
                tabIndex={-1}
                onClick={() => { onClick(account.id) }}
            >
                <InsitutionLogo accountId={account.id} />
                {/* <div className={`wafer-name ${nameIsLong ? 'marquee' : ''}`}> */}
                <div className={[styles.name, nameIsLong ? styles.marquee : ''].join(' ')}>
                    {nameIsLong && <div>{account.official_name?.slice(0, 18)}...</div>}
                    <div style={{ animationDuration: `${nameLength / 2}s` }}>
                        {account.official_name}
                    </div>
                    {nameIsLong && <div style={{ animationDuration: `${nameLength / 2}s` }}>{account.official_name}</div>}
                    {nameIsLong && <div>{account.official_name}</div>}
                </div>
                <div className={styles.meta}>
                    {`${account.subtype} ${account.type === 'loan' ? 'loan' : ''}`}
                    &nbsp;&bull;&nbsp;&bull;&nbsp;
                    {account.mask}
                </div>
                <div className={styles.balance}>
                    <div><DollarCents value={Big(account.balances.current).times(100).toNumber()} /></div>
                </div>
            </div>
        </div>
    )
}

export default Wafer
