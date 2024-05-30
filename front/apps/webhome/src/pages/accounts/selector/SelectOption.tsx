import { Listbox } from '@headlessui/react'
import { Account } from '@features/accountsSlice'
import Big from 'big.js'

import styles from './styles/SelectOption.module.scss'
import { InsitutionLogo } from '@components/pieces'
import { DollarCents, GripButton } from '@ledget/ui'


const SelectOption = ({ account }: { account: Account }) => (
    <div className={styles.option} >
        <GripButton />
        <Listbox.Option key={account.account_id} value={account} as='div'>
            <InsitutionLogo accountId={account.account_id} />
            <div>
                <span>{account.name}</span>
                <span>&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;{account.mask}</span>
            </div>
            <div>
                <DollarCents value={Big(account.balances.current).times(100).toNumber()} />
            </div>
        </Listbox.Option>
    </div>
)

export default SelectOption
