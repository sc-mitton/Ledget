import { useState, useEffect, useRef, ButtonHTMLAttributes } from 'react'

import { useLocation, Location, useSearchParams } from 'react-router-dom'
import { animated, useTransition, useSpringRef } from '@react-spring/web'
import Big from 'big.js'

import { CornerGripButton } from '@components/buttons'
import { Base64Logo, DollarCents, ShimmerDiv, useSpringDrag, BakedListBox } from '@ledget/ui'
import {
    useGetAccountsQuery,
    useUpdateAccountsMutation,
    Account
} from "@features/accountsSlice"
import pathMappings from './path-mappings'
import { ArrowIcon } from '@ledget/media'
import { set } from 'react-hook-form'

const waferWidth = 165
const waferPadding = 6

const _filterAccounts = (accounts: any[], location: Location) => {
    return accounts.filter((account: any) =>
        account.type === pathMappings.getAccountType(location)
    )
}


export const SkeletonWafers = () => (
    <div className="skeleton-account-wafers--container window">
        <div>
            <span>Total Deposits</span>
            <div><DollarCents value="0" /></div>
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
                        background="var(--inner-window)"
                        style={{ position: 'absolute' }}
                    />
                </div>
            ))}
        </div>
    </div>
)

type SelectOption = { value: string, filterType: 'institution' | 'deposit-type' | 'meta', label: string }

const WafersHeader = ({ accounts, setAccounts }: { accounts: Account[], setAccounts: React.Dispatch<React.SetStateAction<Account[]>> }) => {
    const location = useLocation()
    const { data, isSuccess } = useGetAccountsQuery()
    const [accountsFilter, setAccountsFilter] = useState<SelectOption['value']>()
    const [accountsFilterOptions, setAccountsFilterOptions] = useState<SelectOption[]>([{
        value: 'all',
        filterType: 'meta',
        label: pathMappings.getWaferTitle(location)
    }])
    const headerRef = useRef<HTMLDivElement>(null)

    // Set filter options
    useEffect(() => {
        if (isSuccess) {
            const institutions = data?.institutions.map((institution: any) => ({
                value: institution.id,
                filterType: 'institution',
                label: institution.name,
            } as const))
            const depositTypes = data?.accounts
                .filter((account: any) => account.type === pathMappings.getAccountType(location))
                .map((account: any) => ({
                    value: account.subtype,
                    filterType: 'deposit-type',
                    label: account.subtype.charAt(0).toUpperCase() + account.subtype.slice(1),
                } as const))
            setAccountsFilterOptions([
                ...accountsFilterOptions,
                ...(institutions || []),
                ...(depositTypes.length > 1 ? depositTypes : [])
            ])
        }
    }, [isSuccess, location.pathname])

    // Filter accounts
    useEffect(() => {
        if (isSuccess) {
            const filteredAccounts = data?.accounts.filter((account: any) => {
                const filter = accountsFilterOptions.find(f => f.value === accountsFilter)
                if (filter?.filterType === 'institution') {
                    return account.institution_id === accountsFilter && account.type === pathMappings.getAccountType(location)
                } else if (filter?.filterType === 'deposit-type') {
                    return account.subtype === accountsFilter && account.type === pathMappings.getAccountType(location)
                } else if (filter?.filterType === 'meta') {
                    return account.type === pathMappings.getAccountType(location)
                }
            })
            setAccounts(filteredAccounts || [])
        }
    }, [accountsFilter, isSuccess, location.pathname])

    const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button
            aria-haspopup="listbox"
            aria-label="Filter Accounts"
            {...props}
        >
            {accountsFilterOptions.find(option => option.value === accountsFilter)?.label || ''}
            <ArrowIcon size={'.8em'} />
        </button>
    )

    return (
        <div className="account-wafers--header" ref={headerRef}>
            <BakedListBox
                defaultValue={accountsFilterOptions[0].value}
                options={accountsFilterOptions}
                value={accountsFilter}
                onChange={setAccountsFilter}
                dividerKey='filterType'
                placement='left'
                dropdownStyle={{
                    minWidth: (headerRef.current?.offsetWidth || 100) * 1.75,
                    marginLeft: '-.75em'
                }}
                as={Button}
            />
            <div>
                <DollarCents value={accounts.filter(account => account.type === pathMappings.getAccountType(location))
                    .reduce((acc, account) => acc.plus(account.balances.current), Big(0))
                    .times(100).toNumber()}
                />
            </div>
        </div>
    )
}

export const FilledWafers = () => {
    const [updateOrder, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] = useUpdateAccountsMutation()
    const { data, isSuccess: isSuccessLoadingAccounts } = useGetAccountsQuery()
    const [accounts, setAccounts] = useState<Account[]>(data?.accounts || [])

    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const [turnOffBottomMask, setTurnOffBottomMask] = useState(false)
    const [freezeWaferAnimation, setFreezeWaferAnimation] = useState(false)

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

    // Set first account on get accounts success
    useEffect(() => {
        if (data?.accounts && data?.accounts.length > 0) {
            const account = data?.accounts.filter((account: any) =>
                account.type === pathMappings.getAccountType(location))[0]
            searchParams.set('account', account?.account_id)
            setSearchParams(searchParams)
        }
    }, [isSuccessLoadingAccounts, location.pathname.split('/')[2]])

    // Start initial animation
    useEffect(() => {
        isSuccessLoadingAccounts && waferApi.start()
    }, [location.pathname, isSuccessLoadingAccounts, data, accounts])

    const order = useRef(_filterAccounts(data?.accounts || [], location).map((item) => item.account_id))
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
        <div className="account-wafers--container window">
            {['deposits', 'credit'].includes(location.pathname.split('/')[2])
                && <WafersHeader setAccounts={setAccounts} accounts={accounts} />}
            <div
                className="account-wafers"
                onScroll={(e) => {
                    const scrollContainer = e.target as HTMLDivElement
                    setTurnOffBottomMask(scrollContainer.scrollWidth - scrollContainer.scrollLeft <= scrollContainer.clientWidth)
                }}
                style={{
                    maskImage: `linear-gradient(to right, transparent, black 1%, black ${turnOffBottomMask ? 100 : 99}%, transparent)`
                }}
            >
                {transitions((style, account) => {
                    const institution = data?.institutions.find((item: any) => item.id === account.institution_id)
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
                                <div
                                    role="button"
                                    tabIndex={-1}
                                    onClick={() => { handleClick(account.account_id) }}
                                >
                                    <Base64Logo
                                        className="wafer-institution-logo"
                                        styled={false}
                                        data={institution?.logo}
                                        alt={institution?.name.charAt(0).toUpperCase() || 'A'}
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
                                        <div><DollarCents value={Big(account.balances.current).times(100).toNumber()} /></div>
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

export function AccountWafers() {
    const { isLoading } = useGetAccountsQuery()

    return (
        <>
            {(isLoading)
                ? <SkeletonWafers />
                : <FilledWafers />
            }
        </>
    )
}
