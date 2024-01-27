import { useState, useEffect, useRef, ButtonHTMLAttributes } from 'react'

import { useLocation, Location, useSearchParams } from 'react-router-dom'
import { animated, useTransition, useSpringRef, useSpring, useChain } from '@react-spring/web'
import Big from 'big.js'
import { ChevronDown, Grid } from '@geist-ui/icons'

import { CornerGripButton } from '@components/buttons'
import { Base64Logo, DollarCents, ShimmerDiv, useSpringDrag, BakedListBox, IconButton3, ShimmerTextDiv, Tooltip, CloseButton } from '@ledget/ui'
import {
    useGetAccountsQuery,
    useUpdateAccountsMutation,
    Account,
    Institution
} from "@features/accountsSlice"
import pathMappings from './path-mappings'
import { useScreenContext } from '@context/context'

const waferWidth = 165
const waferPadding = 6

const _filterAccounts = (accounts: any[], location: Location) => {
    return accounts.filter((account: any) =>
        account.type === pathMappings.getAccountType(location)
    )
}

type SelectOption = { value: string, filterType: 'institution' | 'deposit-type' | 'meta', label: string }

const AccountWafer = ({ account, institution, onClick }: { account: Account, institution?: Institution, onClick: (arg: string) => void }) => {
    const nameIsLong = account.official_name.length > 18
    const [searchParams] = useSearchParams()

    return (
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
                onClick={() => { onClick(account.account_id) }}
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

const FilledLargScreenWafers = ({ accounts, institutions }: { accounts: Account[], institutions?: Institution[] }) => {
    const [updateOrder, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] = useUpdateAccountsMutation()
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
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

    // Start initial animation
    useEffect(() => {
        waferApi.start()
    }, [location.pathname, accounts])

    const order = useRef(_filterAccounts(accounts || [], location).map((item) => item.account_id))
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
                <animated.div
                    style={style}
                    className="account-wafer--container"
                    {...bind(account.account_id)}
                >
                    <AccountWafer
                        account={account}
                        institution={institutions?.find((item: any) => item.id === account.institution_id)}
                        onClick={handleClick}
                    />
                </animated.div>
            ))}
        </div>
    )
}

const MosaicWafers = ({ accounts, institutions, visible, onClose }: { accounts: Account[], institutions?: Institution[], visible: boolean, onClose: () => void }) => {

    const [searchParams, setSearchParams] = useSearchParams()

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

        }),
        enter: (item: any, index: number) => ({

        }),
        immediate: !visible,
        ref: waferApi
    })

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
        <animated.div id='mosaic-wafers--container' style={containerProps}>
            <CloseButton onClick={onClose} aria-label='Close accounts view' />
            {/* {waferTransitions((style, account) => (
                <animated.div style={style}>
                    <AccountWafer
                        account={account}
                        institution={institutions?.find((item: any) => item.id === account.institution_id)}
                        onClick={handleClick}
                    />
                </animated.div>
            ))} */}
        </animated.div>
    )
}

export function AccountWafers() {
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()

    const { data, isSuccess } = useGetAccountsQuery()
    const { screenSize } = useScreenContext()
    const [accounts, setAccounts] = useState<Account[]>()
    const [accountsFilter, setAccountsFilter] = useState<SelectOption['value']>()
    const [accountsFilterOptions, setAccountsFilterOptions] = useState<SelectOption[]>()
    const [institutionId, setInstitutionId] = useState<string>()
    const [mosaicView, setMosaicView] = useState(false)

    const listref = useRef<HTMLDivElement>(null)

    // Set filter options
    useEffect(() => {
        if (isSuccess) {
            const totalOption = {
                value: 'all',
                filterType: 'meta',
                label: pathMappings.getWaferTitle(location)
            } as const
            const institutions = data?.institutions.map((institution: any) => ({
                value: institution.id,
                filterType: 'institution' as const,
                label: institution.name
            })).filter(i => !accountsFilterOptions?.find(fo => fo.value === i.value))
            const depositTypes = data?.accounts
                .filter((account: any) => account.type === pathMappings.getAccountType(location))
                .map((account: any) => ({
                    value: account.subtype,
                    filterType: 'deposit-type' as const,
                    label: account.subtype.charAt(0).toUpperCase() + account.subtype.slice(1)
                }))
                .filter(dt => !accountsFilterOptions?.find(fo => fo.value === dt.value))
            setAccountsFilterOptions(prev => [
                totalOption,
                ...(institutions || []),
                ...(depositTypes.length > 1 ? depositTypes : [])
            ])
        }
    }, [location.pathname, isSuccess])

    // Set first account on get accounts success
    useEffect(() => {
        const account = accounts?.filter((account: any) =>
            account.type === pathMappings.getAccountType(location))[0]
        searchParams.set('account', account?.account_id || '')
        setSearchParams(searchParams)
        setInstitutionId(account?.institution_id)
    }, [location.pathname.split('/')[2], accounts])

    // Filter accounts
    useEffect(() => {
        if (isSuccess) {
            setAccounts(data?.accounts.filter((account: any) => {
                const filter = accountsFilterOptions?.find(f => f.value === accountsFilter)
                if (filter?.filterType === 'institution') {
                    return account.institution_id === accountsFilter && account.type === pathMappings.getAccountType(location)
                } else if (filter?.filterType === 'deposit-type') {
                    return account.subtype === accountsFilter && account.type === pathMappings.getAccountType(location)
                } else if (filter?.filterType === 'meta') {
                    return account.type === pathMappings.getAccountType(location)
                }
            }) || [])
        }
    }, [accountsFilter, isSuccess, location.pathname])

    const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button
            aria-haspopup="listbox"
            aria-label="Filter Accounts"
            {...props}
        >
            {accountsFilterOptions?.find(option => option.value === accountsFilter)?.label || ''}
            <ChevronDown className='icon' />
        </button>
    )

    return (
        <>
            <div className={`account-wafers--container window ${screenSize}`}>
                <div className="account-wafers--header">
                    <ShimmerTextDiv shimmering={Boolean(!accounts)} length={12} >
                        <BakedListBox
                            defaultValue={accountsFilterOptions?.[0].value}
                            options={accountsFilterOptions}
                            value={accountsFilter}
                            onChange={setAccountsFilter}
                            dividerKey='filterType'
                            placement='left'
                            dropdownStyle={{
                                minWidth: (listref.current?.offsetWidth || 100) * 1.5,
                                marginLeft: '-.75em'
                            }}
                            as={Button}
                        />
                    </ShimmerTextDiv>
                    <ShimmerTextDiv shimmering={Boolean(!accounts)} length={16} >
                        <DollarCents value={accounts?.reduce((acc, account) => acc.plus(account.balances.current), Big(0)).times(100).toNumber() || 0} />
                    </ShimmerTextDiv>
                </div>
                {screenSize !== 'extra-small'
                    && (accounts ? <FilledLargScreenWafers accounts={accounts} institutions={data?.institutions} /> : <SkeletonLargeScreenWafers />)}
            </div>
            {screenSize === 'extra-small' &&
                <ShimmerTextDiv shimmering={Boolean(!accounts)} length={12} className="single-account-header">
                    <div>
                        <Base64Logo
                            size='1.25em'
                            data={data?.institutions?.find(i => i.id === institutionId)?.logo}
                            alt={data?.institutions?.find(i => i.id === institutionId)?.name.charAt(0).toUpperCase() || 'A'}
                        />
                        <span>
                            {data?.accounts?.find(a => a.account_id === searchParams.get('account'))?.official_name || ''}
                        </span>
                        <div>
                            <DollarCents value={data?.accounts?.find(a => a.account_id === searchParams.get('account'))?.balances.current || ''} />
                        </div>
                    </div>
                    <Tooltip msg="Show accounts" type='left'>
                        <IconButton3 onClick={() => setMosaicView(!mosaicView)} aria-label='Show accounts'>
                            <Grid className='icon' />
                        </IconButton3>
                    </Tooltip>
                </ShimmerTextDiv>}
            {screenSize === 'extra-small' &&
                <MosaicWafers accounts={accounts || []} institutions={data?.institutions} visible={mosaicView} onClose={() => setMosaicView(false)} />}
        </>
    )
}
