import { useEffect, useRef, useState } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'
import { animated } from '@react-spring/web'

import './styles/Nav.scss'
import { CreditCard, Clock, TrendingUp } from '@geist-ui/icons'

import {
    usePillAnimation,
    useSchemeVar,
    useScreenContext,
    ExpandableContainer,
    CircleIconButton,
    FilterPillButton,
    RefreshButton,
    useColorScheme,
} from '@ledget/ui'
import { popToast } from '@features/toastSlice'
import { useAppDispatch } from '@hooks/store'
import { useGetAccountsQuery } from '@features/accountsSlice'
import { useTransactionsSyncMutation } from '@features/transactionsSlice'
import { DepositsIcon, CloseIcon, Filter2 } from '@ledget/media'
import { useAccountsContext } from './context'
import pathMappings from './path-mappings'
import { hasErrorCode } from '@ledget/helpers'


const _getNavIcon = (key = '', isCurrent: boolean) => {

    switch (key) {
        case 'deposits':
            return <DepositsIcon stroke={'currentColor'} />
        case 'credit':
            return <CreditCard stroke={'currentColor'} className='icon' />
        case 'investments':
            return <TrendingUp stroke={'currentColor'} className='icon' />
        case 'loans':
            return <Clock stroke={'currentColor'} className='icon' />
        default:
            return null
    }
}

const _getNavLabel = (key = '') => {
    switch (key) {
        case 'deposits':
            return 'Deposits'
        case 'credit':
            return 'Credit'
        case 'investments':
            return 'Investments'
        case 'loans':
            return 'Loans'
        default:
            return null
    }
}

const TabButtons = () => {
    const ref = useRef(null)
    const [windowWidth, setWindowWidth] = useState(0)

    const location = useLocation()
    const navigate = useNavigate()
    const currentPath = location.pathname.split('/')[2]
    const { screenSize } = useScreenContext()

    const [backgroundColor] = useSchemeVar(['--blue'])

    const [props] = usePillAnimation({
        ref: ref,
        update: [location.pathname, windowWidth],
        querySelectall: '[role=link]',
        find: (element) => element.getAttribute('aria-current') === 'true',
        styles: {
            backgroundColor: backgroundColor,
            borderRadius: 'var(--border-radius3)',
        }
    })

    // Resize observer to update nav pill when responsive layout changes
    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const newWidth = entry.contentRect.width
                setWindowWidth(newWidth)
            }
        })

        if (ref.current)
            observer.observe(ref.current)

        return () => {
            observer.disconnect()
        }
    }, [])

    return (
        <>
            <div className={`${screenSize}`}>
                <ul ref={ref}>
                    {['deposits', 'credit', 'loans', 'investments'].map((path) => (
                        <li
                            key={path}
                            role='link'
                            aria-current={currentPath === path}
                            tabIndex={0}
                            onClick={() => location.pathname !== `/accounts/${path}` && navigate(`/accounts/${path}`)}
                        >
                            {_getNavIcon(path, currentPath === path)}
                            {screenSize !== 'extra-small' && <span>{_getNavLabel(path)}</span>}
                        </li>
                    ))
                    }
                    <animated.span style={props} />
                </ul>
            </div>
        </>
    )
}

type SelectOption = { value: string, filterType: 'institution' | 'deposit-type' | 'meta', label: string }

const Filters = ({ visible = false, close }: { visible: boolean, close: () => void }) => {
    const { setAccounts } = useAccountsContext()
    const { data, error: getAccountsError } = useGetAccountsQuery();
    const [accountsFilter, setAccountsFilter] = useState<SelectOption['value']>()
    const [accountsFilterOptions, setAccountsFilterOptions] = useState<SelectOption[]>()
    const location = useLocation()
    const dispatch = useAppDispatch()
    const { screenSize } = useScreenContext()

    // Handle get accounts error
    useEffect(() => {
        if (hasErrorCode('ITEM_LOGIN_REQUIRED', getAccountsError)) {
            dispatch(popToast({
                type: 'error',
                message: 'Account connection broken',
                actionLink: '/settings/connections',
                actionMessage: 'reconnect',
                timer: 10000
            }))
        }
    }, [getAccountsError])

    // Set filter options
    useEffect(() => {
        if (data) {
            const totalOption = {
                value: 'all',
                filterType: 'meta',
                label: 'All Accounts'
            } as const

            const depositTypes = data.accounts
                .filter((account: any) => account.type === pathMappings.getAccountType(location))
                .map((account: any) => ({
                    value: account.subtype,
                    filterType: 'deposit-type' as const,
                    label: account.subtype.charAt(0).toUpperCase() + account.subtype.slice(1)
                }))
            const institutionOptions = data.institutions.map((institution: any) => ({
                value: institution.id,
                filterType: 'institution' as const,
                label: institution.name
            })).filter(i => data.accounts.find(a => a.institution_id === i.value))

            setAccountsFilterOptions(prev => [
                totalOption,
                ...(institutionOptions || []),
                ...(depositTypes.length > 1 ? depositTypes : [])
            ])
        }
    }, [location.pathname, data])

    // Filter accounts
    useEffect(() => {
        setAccounts(data?.accounts.filter((account) => {
            const filter = accountsFilterOptions?.find(f => f.value === accountsFilter)
            if (filter?.filterType === 'institution') {
                return account.institution_id === accountsFilter && account.type === pathMappings.getAccountType(location)
            } else if (filter?.filterType === 'deposit-type') {
                return account.subtype === accountsFilter && account.type === pathMappings.getAccountType(location)
            } else {
                return account.type === pathMappings.getAccountType(location)
            }
        }) || [])
    }, [accountsFilter])

    // Set filter to first option on mount if not already set
    useEffect(() => {
        if (accountsFilterOptions && !accountsFilter) {
            setAccountsFilter(accountsFilterOptions[0].value)
        }
    }, [accountsFilterOptions])

    return (
        <ExpandableContainer expanded={visible} id={'account-filters'} className={`${screenSize}`}>
            {accountsFilterOptions?.map((option, i) => (
                <>
                    <FilterPillButton
                        key={`fiter-button-${i}`}
                        selected={option.value === accountsFilter}
                        onClick={() => { setAccountsFilter(option.value) }}
                    >
                        {option.label}
                    </FilterPillButton>
                    {option.filterType !== accountsFilterOptions[i + 1]?.filterType
                        && i !== accountsFilterOptions.length - 1 && <span className={'account-filters-divider'} />}
                </>
            ))}
            <CircleIconButton onClick={() => close()} size='small'>
                <CloseIcon />
            </CircleIconButton>
        </ExpandableContainer>
    )
}

export const Nav = () => {
    const { isSuccess } = useAccountsContext()
    const [syncTransactions, {
        isSuccess: isTransactionsSyncSuccess,
        isError: isTransactionsSyncError,
        data: syncResult,
        isLoading: isSyncing
    }] = useTransactionsSyncMutation()
    const dispatch = useAppDispatch()
    const [showFilters, setShowFilters] = useState(false)
    const { isDark } = useColorScheme()

    // Dispatch synced toast
    useEffect(() => {
        if (isTransactionsSyncSuccess) {
            dispatch(popToast({
                type: 'success',
                message: `Synced${syncResult?.added ? `, ${syncResult?.added} new transactions` : ' successfully'}`,
            }))
        }
    }, [isTransactionsSyncSuccess])

    // Dispatch synced error toast
    useEffect(() => {
        if (isTransactionsSyncError) {
            dispatch(popToast({
                type: 'error',
                message: 'There was an error syncing your transactions',
            }))
        }
    }, [isTransactionsSyncError])

    return (
        <div id={'accounts-nav'}>
            <div className={`${isDark ? 'dark' : 'light'}`}>
                <TabButtons />
                <RefreshButton
                    stroke={'var(--m-text)'}
                    loading={isSyncing}
                    disabled={!isSuccess}
                    onClick={() => {
                        syncTransactions({})
                    }}
                />
                <CircleIconButton
                    onClick={() => setShowFilters(prev => !prev)}
                    aria-label='Filter Transactions'
                    aria-expanded={showFilters}
                    aria-controls='filter'
                    aria-haspopup='true'
                >
                    <Filter2 />
                </CircleIconButton>
            </div>
            <Filters visible={showFilters} close={() => setShowFilters(false)} />
        </div>
    )
}
