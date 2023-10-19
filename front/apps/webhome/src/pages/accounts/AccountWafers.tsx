import { useState, useEffect, useRef } from 'react'

import { useLocation, Location, useSearchParams } from 'react-router-dom'
import { animated, useTransition, useSpringRef } from '@react-spring/web'
import Big from 'big.js'

import { CornerGripButton } from '@components/buttons'
import { Base64Image, DollarCents, ShimmerDiv, useSpringDrag } from '@ledget/ui'
import { useGetAccountsQuery, useGetAccountsQueryState, useUpdateAccountsMutation } from "@features/accountsSlice"
import pathMappings from './path-mappings'

const waferWidth = 165
const waferPadding = 6

export const SkeletonWafers = () => (
    <div className="skeleton-account-wafers--container">
        <div>
            <span>Total Deposits</span>
            <span>
                <DollarCents value="0" />
            </span>
        </div>
        <div
            className="skeleton-wafers"
        >
            {Array(4).fill(0).map((_, index) => (
                <div
                    className="skeleton-account-wafer--container"
                    style={{ width: `${waferWidth}px` }}
                >
                    <ShimmerDiv
                        key={index}
                        className="skeleton-account-wafer"
                        shimmering={true}
                        background="var(--inner-window-solid)"
                        style={{ position: 'absolute' }}
                    />
                </div>
            ))}
        </div>
    </div>
)

const WafersHeader = () => {
    const location = useLocation()
    const { data, isSuccess } = useGetAccountsQueryState()

    return (
        <div>
            <h3>{pathMappings.getWaferTitle(location)}</h3>

            <DollarCents
                value={
                    isSuccess
                        ? data?.accounts.filter((account: any) => account.type === pathMappings.getAccountType(location))
                            .reduce((acc: number, account: any) => Big(acc).add(account.balances.current), 0)
                            .times(100)
                            .toNumber()
                        : '0.00'
                }
            />
        </div>
    )
}

const filterAccounts = (accounts: any[], location: Location) => {
    return accounts.filter((account: any) =>
        account.type === pathMappings.getAccountType(location)
    )
}

export const AccountWafers = ({ onClick }: { onClick: () => void }) => {
    const { } = useGetAccountsQuery()
    const { data, isSuccess } = useGetAccountsQueryState()
    const [updateOrder] = useUpdateAccountsMutation()

    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const [turnOffBottomMask, setTurnOffBottomMask] = useState(false)

    const waferApi = useSpringRef()
    const transitions = useTransition(
        data?.accounts.filter((account: any) => account.type === pathMappings.getAccountType(location)),
        {
            from: (item: any, index: number) => ({
                x: index * (waferWidth + waferPadding) + (15 * (index + 1) ** 2),
                scale: 1,
                zIndex: 0,
                width: waferWidth,
                opacity: 0,
            }),
            enter: (item: any, index: number) => ({
                x: index * (waferWidth + waferPadding),
                opacity: 1,
            }),
            update: (item: any, index: number) => ({
                x: index * (waferWidth + waferPadding),
                opacity: 1,
            }),
            ref: waferApi,
        })

    // Start initial animation
    useEffect(() => { isSuccess && waferApi.start() }, [isSuccess])

    // Set first account on get accounts success
    useEffect(() => {
        if (isSuccess && data?.accounts.length > 0) {
            searchParams.set('account', data?.accounts[0].account_id)
            setSearchParams(searchParams)
        }
    }, [isSuccess])

    const order = useRef(filterAccounts(data?.accounts || [], location).map((item) => item.account_id))
    const bind = useSpringDrag({
        order: order,
        indexCol: 'account_id',
        style: { axis: 'x', size: waferWidth, padding: waferPadding },
        onRest: (newOrder: string[]) => {
            if (order.current !== newOrder) {
                updateOrder(
                    newOrder.map((id, index) => ({
                        account: id,
                        order: index
                    }))
                )
            }
        },
        api: waferApi
    })

    const handleClick = (id: string) => {
        searchParams.set('account', id)
        setSearchParams(searchParams)
        onClick()
        waferApi.start((index: any, item: any) => {
            if (item._item.account_id === id) {
                return ({
                    to: async (next: any) => {
                        await next({ scale: .95 })
                        await next({ scale: 1 })
                    },
                    config: { duration: 100 }
                })
            }
        })
    }

    return (
        <div className="account-wafers--container">
            <WafersHeader />
            <div
                className="account-wafers"
                onScroll={(e) => {
                    const scrollContainer = e.target as HTMLDivElement
                    setTurnOffBottomMask(scrollContainer.scrollWidth - scrollContainer.scrollLeft <= scrollContainer.clientWidth)
                }}
                style={{
                    height: '16.5ch',
                    maskImage: `linear-gradient(to right, transparent, black 1%, black ${turnOffBottomMask ? 100 : 99}%, transparent)`
                }}
            >
                {transitions((style, account) => {
                    const institution = data.institutions.find((item: any) => item.id === account.institution_id)
                    const nameIsLong = account.official_name.length > 18
                    return (
                        <animated.div
                            style={style}
                            className="account-wafer--container"
                            {...bind(account.account_id)}
                        >
                            <div
                                tabIndex={0}
                                key={account.account_id}
                                className={`account-wafer ${searchParams.get('account') === account.account_id ? 'active' : 'inactive'}`}
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
                                    onClick={() => { handleClick(account.account_id) }}
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
            </div>
        </div>
    )
}
