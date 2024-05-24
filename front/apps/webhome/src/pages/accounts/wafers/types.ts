import { Account } from '@features/accountsSlice'

export type WaferStyle = 'credit' | 'deposit'

export type WaferProps = { account: Account, onClick: (arg: string) => void, styling: WaferStyle }
