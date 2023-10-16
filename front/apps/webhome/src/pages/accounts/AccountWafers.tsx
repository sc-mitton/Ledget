import { useState, useEffect } from 'react'

import { useLocation } from 'react-router-dom'
import Big from 'big.js'

import { Base64Image, DollarCents, ShimmerDiv } from '@ledget/ui'
import { useGetAccountsQuery } from "@features/accountsSlice"
import pathMappings from './path-mappings'

export const SkeletonWafers = () => (
    <div className="account-wafers--container">
        <div>
            <span>Total Deposits</span>
            <span>
                <DollarCents value="0" />
            </span>
        </div>
        <div className="shimmering-account-wafers">
            {Array(4).fill(0).map((_, index) => (
                <ShimmerDiv
                    key={index}
                    className="shimmering-account-wafer"
                    shimmering={true}
                    background="var(--inner-window-solid)"
                />
            ))}
        </div>
    </div>
)

export const AccountWafers = ({ onClick }: { onClick: (val: string) => void }) => {
    const { data: accountsData, isSuccess } = useGetAccountsQuery()
    const [currentAccount, setCurrentAccount] = useState<string | null>(null)
    const location = useLocation()

    useEffect(() => {
        if (isSuccess) {
            setCurrentAccount(accountsData?.accounts[0].account_id)
        }
    }, [isSuccess])

    return (
        <div className="account-wafers--container">
            <div>
                <h3>{pathMappings.getWaferTitle(location)}</h3>
                <DollarCents
                    value={
                        isSuccess
                            ? Big(accountsData?.accounts
                                .filter((account: any) => account.type === pathMappings.getAccountType(location))
                                .reduce((acc: number, account: any) => acc + account.balances.current, 0))
                                .times(100)
                                .toNumber()
                            : '0.00'
                    }
                />
            </div>
            <div className="account-wafers">
                {accountsData?.accounts
                    .filter((account: any) => account.type === pathMappings.getAccountType(location))
                    .map((account: any, index: number) => {
                        const institution = accountsData.institutions.find((item: any) => item.id === account.institution_id)
                        const nameIsLong = account.official_name.length > 18

                        return (
                            <div
                                key={account.account_id}
                                className={`account-wafer ${currentAccount === account.account_id ? 'active' : 'inactive'}`}
                                style={{ '--wafer-index': index } as React.CSSProperties}
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                    onClick(account.account_id)
                                    setCurrentAccount(account.account_id)
                                }}
                            >
                                <Base64Image
                                    data={institution.logo}
                                    alt={institution.name.charAt(0).toUpperCase()}
                                />
                                <div className={`wafer-name--container ${nameIsLong ? 'masked' : ''}`}>
                                    <div className={`${nameIsLong ? 'scrolling-text' : ''}`}>
                                        {account.official_name}
                                    </div>
                                    {nameIsLong && <div className='scrolling-text'>{account.official_name}</div>}
                                    {nameIsLong && <div className='spacer'>spacer</div>}
                                </div>
                                <div className='wafer-meta--container'>
                                    {`${account.subtype} ${account.type === 'loan' ? 'loan' : ''}`}
                                    &nbsp;&bull;&nbsp;&bull;&nbsp;
                                    {account.mask}
                                </div>
                                <div className="wafer-balance--container">
                                    <DollarCents value={String(account.balances.current * 100)} />
                                </div>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}
