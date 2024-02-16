import { useState, useEffect, useRef } from 'react'

import { useLocation, Location, useSearchParams } from 'react-router-dom'
import { animated, useTransition, useSpringRef, useSpring, useChain } from '@react-spring/web'
import Big from 'big.js'
import { ChevronRight } from '@geist-ui/icons'

import { GripButton, CornerGripButton } from '@components/buttons'
import {
    DollarCents,
    ShimmerDiv,
    useSpringDrag,
    ShimmerTextDiv,
    CloseButton,
    useScreenContext
} from '@ledget/ui'
import { InsitutionLogo } from '@components/pieces'
import {
    useUpdateAccountsMutation,
    Account,
} from "@features/accountsSlice"
import pathMappings from './path-mappings'
import { useAccountsContext } from './context'

const waferWidth = 165
const waferPadding = 6

const _filterAccounts = (accounts: any[], location: Location) => {
    return accounts.filter((account: any) =>
        account.type === pathMappings.getAccountType(location)
    )
}

const AccountWafer = ({ account, onClick }: { account: Account, onClick: (arg: string) => void }) => {
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
                <div className={`wafer-name--container ${nameIsLong ? 'marquee' : ''}`}>
                    {nameIsLong && <div className='marquee--placeholder'>{account.official_name?.slice(0, 18)}...</div>}
                    <div className={`${nameIsLong ? 'marquee--leader' : ''}`} style={{ animationDuration: `${nameLength / 2}s` }}>
                        {account.official_name}
                    </div>
                    {nameIsLong && <div className="marquee--caboose" style={{ animationDuration: `${nameLength / 2}s` }}>{account.official_name}</div>}
                    {nameIsLong && <div className="marquee--spacer">{account.official_name}</div>}
                </div>
                <div className='wafer-meta--container'>
                    {`${account.subtype} ${account.type === 'loan' ? 'loan' : ''}`}
                    &nbsp;&bull;&nbsp;&bull;&nbsp;
                    {account.mask}
                </div>
                <div className="wafer-balance--container">
                    <div><DollarCents value={Big(account.balances.current).times(100).toNumber()} /></div>
                </div>
            </div>
        </div>
    )
}

const SkeletonLargeScreenWafers = () => (
    <div className="skeleton-wafers">
        {Array(4).fill(0).map((_, index) => (
            <div
                className="skeleton-account-wafer--container"
                style={{ width: `${waferWidth}px` }}
            >
                <ShimmerDiv
                    key={index}
                    className="skeleton-account-wafer"
                    shimmering={true}
                    style={{ position: 'absolute' }}
                />
            </div>
        ))}
    </div>
)

const HorizontalWafers = () => {
    const { accounts } = useAccountsContext()
    const [updateOrder, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] = useUpdateAccountsMutation()
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const [freezeWaferAnimation, setFreezeWaferAnimation] = useState(false)
    const order = useRef(_filterAccounts(accounts || [], location).map((item) => item.account_id))

    const waferApi = useSpringRef()
    const transitions = useTransition(accounts, {
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
        immediate: freezeWaferAnimation,
        ref: waferApi
    })

    // Freeze Wafer Animation when updating order
    useEffect(() => {
        if (isUpdating) {
            setFreezeWaferAnimation(true)
        }
        let timeout: NodeJS.Timeout
        if (isUpdateSuccess) {
            timeout = setTimeout(() => {
                setFreezeWaferAnimation(false)
            }, 2000)
        }
        return () => { clearTimeout(timeout) }
    }, [isUpdateSuccess, isUpdating])

    // Start initial animation
    useEffect(() => {
        waferApi.start()
    }, [location.pathname, accounts])

    useEffect(() => {
        order.current = _filterAccounts(accounts || [], location).map((item) => item.account_id)
    }, [accounts, location.pathname])

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
        <div className="account-wafers">
            {transitions((style, account) => (
                account &&
                <animated.div
                    style={style}
                    className="account-wafer--container"
                    {...bind(account.account_id)}
                >
                    <AccountWafer
                        account={account}
                        onClick={handleClick}
                    />
                </animated.div>
            ))}
        </div>
    )
}

const VerticalAccountList = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {

    const { accounts } = useAccountsContext()
    const [searchParams, setSearchParams] = useSearchParams()
    const containerRef = useRef<HTMLDivElement>(null)
    const waferHeight = 72
    const waferGap = 16
    const containerApi = useSpringRef()
    const containerProps = useSpring({
        top: '1em',
        right: 0,
        width: visible ? '100%' : '0%',
        height: visible ? '100%' : '0%',
        opacity: visible ? 1 : 0,
        ref: containerApi,
        config: { tension: 200, friction: 20 }
    })

    const waferApi = useSpringRef()
    const waferTransitions = useTransition(accounts, {
        from: (item: any, index: number) => ({
            y: index * (waferHeight + waferGap),
            zIndex: 0,
            opacity: 0,
        }),
        to: (item: any, index: number) => ({
            y: index * (waferHeight + waferGap),
            opacity: 1,
        }),
        update: { opacity: visible ? 1 : 0 },
        immediate: !visible,
        ref: waferApi
    })

    // const order = useRef(accounts?.map((item) => item.account_id))

    const order = useRef<string[]>([])

    // Update order on accounts change
    useEffect(() => {
        const newOrder = accounts?.map((item) => item.account_id)
        if (newOrder) {
            order.current = newOrder
        }
    }, [accounts])

    const bind = useSpringDrag({
        order: order,
        indexCol: 'account_id',
        style: { axis: 'y', size: 68, padding: 16 },
        api: waferApi
    })

    useChain([containerApi, waferApi], [0, 0])

    useEffect(() => {
        containerApi.start()
        waferApi.start()
    }, [visible])

    const handleClick = (id: string) => {
        searchParams.set('account', id)
        setSearchParams(searchParams)
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
        <animated.div
            id='verticle-wafers--container'
            style={containerProps}
            ref={containerRef}
        >
            <div>
                {waferTransitions((style, account) => (
                    <>
                        {visible && account &&
                            <animated.div
                                {...bind(account?.account_id)}
                                style={style}
                                className={`verticle-account-wafer--container ${searchParams.get('account') === account?.account_id ? 'active' : 'inactive'}`}
                            >
                                <div className="verticle-account-wafer" tabIndex={0} role='button' onClick={() => { handleClick(account?.account_id) }}>
                                    <div><GripButton /></div>
                                    <div>
                                        <InsitutionLogo accountId={account?.account_id} />
                                        <div>
                                            <span>{account?.official_name}</span>
                                            <span>
                                                <span>&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;</span>
                                                {account?.mask}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <DollarCents value={Big(account?.balances.current || 0).times(100).toNumber()} />
                                    </div>
                                </div>
                            </animated.div>}
                    </>
                ))}
            </div>
            <CloseButton onClick={onClose} aria-label='Close accounts view' />
        </animated.div>
    )
}

const SelectedAccount = ({ onClick }: { onClick: () => void }) => {
    const { accounts } = useAccountsContext()
    const [searchParams] = useSearchParams()

    return (
        <ShimmerTextDiv
            shimmering={Boolean(!accounts)}
            length={12}
            className="single-account-header"
            role='button'
            onClick={() => onClick()}
        >
            <div>
                <InsitutionLogo
                    size='1em'
                    accountId={searchParams.get('account') || undefined}
                />
                <div>
                    <span>
                        {accounts?.find(a => a.account_id === searchParams.get('account'))?.official_name || ''}
                    </span>
                    <div>
                        <DollarCents value={Big(accounts?.find(a => a.account_id === searchParams.get('account'))?.balances.current || 0).times(100).toNumber()} />
                    </div>
                </div>
            </div>
            <ChevronRight size={'1.375em'} />
        </ShimmerTextDiv>
    )
}

export function AccountWafers() {
    const [searchParams] = useSearchParams()

    const { screenSize } = useScreenContext()
    const [showAllAccounts, setShowAllAccounts] = useState(false)
    const { isLoading: isLoadingAccounts } = useAccountsContext()

    useEffect(() => {
        setShowAllAccounts(false)
    }, [searchParams.get('account')])

    return (
        <>
            <div className={`account-wafers--container ${screenSize}`}>
                {!['small', 'extra-small'].includes(screenSize) && (isLoadingAccounts
                    ? <SkeletonLargeScreenWafers />
                    : <HorizontalWafers />)}
            </div>
            {['small', 'extra-small'].includes(screenSize) &&
                <>
                    <SelectedAccount onClick={() => setShowAllAccounts(true)} />
                    <VerticalAccountList
                        visible={showAllAccounts}
                        onClose={() => setShowAllAccounts(false)} /></>}
        </>
    )
}
