import { useState, useEffect } from 'react'

import { useLocation } from 'react-router-dom'
import { animated, useTransition, useSpringRef } from '@react-spring/web'
import Big from 'big.js'

import { CornerGripButton } from '@components/buttons'
import { Base64Image, DollarCents, ShimmerDiv, useSpringDrag } from '@ledget/ui'
import { useGetAccountsQuery, useGetAccountsQueryState, useUpdateAccountsMutation } from "@features/accountsSlice"
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
                <div className="account-wafer--container">
                    <ShimmerDiv
                        key={index}
                        className="shimmering-account-wafer"
                        shimmering={true}
                        background="var(--inner-window-solid)"
                    />
                </div>
            ))}
        </div>
    </div>
)

const Wafers = ({ onClick }: { onClick: (accountId: string) => void }) => {
    const { data, isSuccess } = useGetAccountsQueryState()
    const [currentAccount, setCurrentAccount] = useState<string | null>(null)
    const [updateAccounts] = useUpdateAccountsMutation()
    const location = useLocation()
    const [accounts, setAccounts] = useState<any[]>([])

    const waferApi = useSpringRef()
    const transitions = useTransition(
        data?.accounts.filter((account: any) => account.type === pathMappings.getAccountType(location)),
        {
            from: (item: any, index: number) => ({
                x: 30 * index ** 2,
                opacity: 0,
                boxShadow: 'var(--new-item-drop-shadow)',
                borderRadius: 'var(--border-radius4)'
            }),
            enter: (item: any, index: number) => ({
                x: 0,
                opacity: 1,
            }),
            update: (item: any, index: number) => ({
                x: 0,
                opacity: 1,
            }),
            ref: waferApi,
        })

    useEffect(() => {
        if (isSuccess) {
            waferApi.start()
        }
    }, [isSuccess])

    useEffect(() => {
        if (isSuccess && data?.accounts.length > 0) {
            setCurrentAccount(data?.accounts[0].account_id)
        }
    }, [isSuccess])

    // Set accounts on load
    useEffect(() => {
        if (isSuccess) {
            setAccounts(
                Array.from(data?.accounts.filter((account: any) =>
                    account.type === pathMappings.getAccountType(location)) || []
                ))
        }
    }, [isSuccess])

    const bind = useSpringDrag({
        items: accounts,
        indexCol: 'account_id',
        onRest: (newOrder) => {
        },
        style: { axis: 'x', size: 160, padding: 16 },
        api: waferApi
    })

    return (
        <>
            {transitions((style, account, index) => {
                const institution = data.institutions.find((item: any) => item.id === account.institution_id)
                const nameIsLong = account.official_name.length > 18
                return (
                    <animated.div
                        style={style}
                        className="account-wafer--container"
                        {...bind(index)}
                    >
                        <div
                            tabIndex={0}
                            key={account.account_id}
                            className={`account-wafer ${currentAccount === account.account_id ? 'active' : 'inactive'}`}
                        >
                            <CornerGripButton
                                id={`${account.account_id}`}
                                tabIndex={-1}
                            />
                            <Base64Image
                                data={institution.logo}
                                alt={institution.name.charAt(0).toUpperCase()}
                            />
                            <div
                                role="button"
                                tabIndex={-1}
                                onClick={() => {
                                    onClick(account.account_id)
                                    setCurrentAccount(account.account_id)
                                }}
                            >
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
                        </div>
                    </animated.div>
                )
            })}
        </>
    )
}

const WafersHeader = () => {
    const location = useLocation()
    const { data, isSuccess } = useGetAccountsQueryState()

    return (
        <div>
            <h3>{pathMappings.getWaferTitle(location)}</h3>
            <DollarCents
                value={
                    isSuccess
                        ? Big(data?.accounts
                            .filter((account: any) => account.type === pathMappings.getAccountType(location))
                            .reduce((acc: number, account: any) => acc + account.balances.current, 0))
                            .times(100)
                            .toNumber()
                        : '0.00'
                }
            />
        </div>
    )
}

export const AccountWafers = ({ onClick, hide = false }: { onClick: (val: string) => void, hide: boolean }) => {
    const { } = useGetAccountsQuery()

    return (
        <>
            {!hide &&
                <div className="account-wafers--container">
                    <WafersHeader />
                    <div className="account-wafers">
                        <Wafers onClick={onClick} />
                    </div>
                </div>
            }
        </>
    )
}
