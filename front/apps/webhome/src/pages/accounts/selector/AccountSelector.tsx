import { useEffect, useState, Fragment, useRef } from "react"

import { useLocation, useSearchParams } from "react-router-dom"
import Big from "big.js"
import { Listbox } from '@headlessui/react'

import styles from './styles/account-selector.module.scss'
import { DollarCents, BlueWindow, useAccessEsc, } from "@ledget/ui"
import { InsitutionLogo } from '@components/pieces'
import { Account, } from "@features/accountsSlice"
import { useAccountsContext } from '../context'
import { ChevronDown } from "@geist-ui/icons"
import AccountBalanceTrend from '../Trend'
import pathMappings from "../path-mappings"
import Options from "./Options"

const HeaderWindow = () => {
    const location = useLocation()
    const { accounts } = useAccountsContext()

    return (
        <BlueWindow className={styles.smallScreenAccountsHeader}>
            <h4>{pathMappings.getWaferTitle(location)}</h4>
            <h1>
                <DollarCents value={accounts?.reduce((acc, account) =>
                    acc.plus(account.balances.current), Big(0)).times(100).toNumber() || 0} />
            </h1>
            {location.pathname.includes('deposits') && <AccountBalanceTrend />}
        </BlueWindow>
    )
}

const AccountSelector = () => {
    const { accounts } = useAccountsContext()
    const [searchParams, setSearchParams] = useSearchParams()
    const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(
        accounts?.find(account => account.account_id === searchParams.get('account')) || accounts?.[0])
    const [open, setOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [key, setKey] = useState(Math.random().toString().slice(3, 10))

    useEffect(() => {
        if (selectedAccount) {
            searchParams.set('account', selectedAccount.account_id)
            setSearchParams(searchParams)
        }
    }, [selectedAccount])

    useEffect(() => {
        setSelectedAccount(accounts?.find(account => account.account_id === searchParams.get('account')))
    }, [location.pathname, accounts])

    useAccessEsc({
        refs: [buttonRef, containerRef],
        visible: open,
        setVisible: setOpen
    })

    useEffect(() => {
        if (open) {
            const timeout = setTimeout(() => {
                setOpen(false)
            }, 200)
            return () => clearTimeout(timeout)
        }
    }, [selectedAccount])

    useEffect(() => {
        if (open) {
            setKey(Math.random().toString().slice(3, 10))
        } else {
            const timeout = setTimeout(() => {
                setKey(Math.random().toString().slice(3, 10))
            }, 1000)
            return () => clearTimeout(timeout)
        }
    }, [open])

    return (
        <div>
            <HeaderWindow />
            <Listbox
                value={selectedAccount}
                onChange={setSelectedAccount}
                as='div'
                className={styles.accountsSelector}
                ref={containerRef}
            >
                <Listbox.Button ref={buttonRef} onClick={() => setOpen(!open)}>
                    <div>
                        {selectedAccount && <InsitutionLogo accountId={selectedAccount.account_id} />}
                        <span>{`${selectedAccount?.name || ''}`}</span>
                        <ChevronDown className="icon" />
                    </div>
                    <div>
                        <DollarCents value={Big(selectedAccount?.balances.current || 0).times(100).toNumber()} />
                    </div>
                </Listbox.Button>
                <Listbox.Options static as={Fragment} key={key}>
                    <Options open={open} setOpen={setOpen} />
                </Listbox.Options>
            </Listbox>
        </div>
    )
}

export default AccountSelector
