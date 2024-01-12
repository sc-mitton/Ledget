import { useEffect, useState } from 'react'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useWatch, useForm } from 'react-hook-form'
import { useSearchParams, useLocation } from 'react-router-dom'
import { DatePicker } from "antd"
import {
    useTransition,
    animated,
    useSpring,
    useChain,
    useSpringRef
} from '@react-spring/web'
import dayjs from 'dayjs'

import './styles/Header.scss'
import { useGetAccountsQuery } from '@features/accountsSlice'
import {
    useGetMerchantsQuery,
    useLazyGetTransactionsQuery,
    selectConfirmedTransactionFilter,
    setConfirmedTransactionFilter,
    clearConfirmedTransactionFilter
} from '@features/transactionsSlice'
import { useLazyGetCategoriesQuery } from '@features/categorySlice'
import { Funnel } from '@ledget/media'
import { FullSelectCategoryBill } from '@components/dropdowns'
import { LimitAmountInput } from '@components/inputs'
import {
    IconButton,
    Tooltip,
    BlueSlimButton2,
    SlimInputButton,
    BakedListBox,
    BakedComboBox,
    SecondaryButtonSlim,
    DeleteButton,
    useColorScheme
} from '@ledget/ui'
import { useFilterFormContext } from '../context';
import { useGetStartEndQueryParams } from '@hooks/utilHooks';
import { useAppDispatch, useAppSelector } from '@hooks/store';


const { RangePicker } = DatePicker

const filterSchema = z.object({
    date_range: z.array(z.number()).optional(),
    limit_amount_lower: z.number().optional(),
    limit_amount_upper: z.number().optional(),
    items: z.array(z.string()).optional(),
    merchants: z.array(z.string()).optional(),
    accounts: z.array(z.string()).optional(),
})

export type TransactionFilterSchema = z.infer<typeof filterSchema>

const FilterWindow = () => {
    const { setShowFilterForm } = useFilterFormContext()
    const { data: accountsData } = useGetAccountsQuery()
    const { data: merchantsData } = useGetMerchantsQuery()
    const [getLazyTransactions] = useLazyGetTransactionsQuery()
    const { start, end } = useGetStartEndQueryParams()
    const filter = useAppSelector(selectConfirmedTransactionFilter)
    const dispatch = useAppDispatch()
    const [getCategories, { data: categoryData }] = useLazyGetCategoriesQuery()
    const { isDark } = useColorScheme()

    const { handleSubmit, control, reset, resetField } = useForm<TransactionFilterSchema>({
        resolver: zodResolver(filterSchema),
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
        defaultValues: filter
    })

    const merchantsFieldValue = useWatch({ control, name: 'merchants' })
    const accountsFieldValue = useWatch({ control, name: 'accounts' })
    const dateRangeFieldValue = useWatch({ control, name: 'date_range' })
    const [resetKey, setResetKey] = useState(Math.random().toString(36).slice(2, 9))
    const [resetAccountMerchantKeys, setResetAccountMerchantKeys] =
        useState([Math.random().toString(36).slice(2, 9), Math.random().toString(36).slice(2, 9)])

    useEffect(() => {
        const s = dateRangeFieldValue?.[0]
        const e = dateRangeFieldValue?.[1]
        getCategories({ start: s, end: e, spending: false }, true)
    }, [dateRangeFieldValue])

    return (
        <form
            className={`${isDark ? 'dark' : ''}`}
            key={resetKey}
            onSubmit={handleSubmit((data) => {
                const { date_range, ...rest } = data
                dispatch(setConfirmedTransactionFilter(data))
                const newData = {
                    ...rest,
                    start: date_range?.[0],
                    end: date_range?.[1],
                    confirmed: true
                }
                getLazyTransactions(newData)
                setShowFilterForm(false)
            })}
        >
            <fieldset>
                <Controller
                    name="date_range"
                    control={control}
                    rules={{ required: true }}
                    render={(props) => (
                        <>
                            <label htmlFor="date_range">Date</label>
                            <RangePicker
                                defaultValue={
                                    filter?.date_range
                                        ? [
                                            dayjs.unix(filter.date_range[0]),
                                            dayjs.unix(filter.date_range[1])
                                        ]
                                        : [dayjs.unix(start), dayjs.unix(end)]
                                }
                                format="MM/DD/YYYY"
                                className='ledget-range-picker'
                                aria-label='Date Range'
                                {...props}
                                onChange={(e) => {
                                    props.field.onChange([
                                        e?.[0]?.unix(),
                                        e?.[1]?.unix()
                                    ])
                                }}
                            />
                        </>
                    )}
                />
                <label htmlFor='limit_amount'>Amount</label>
                <div className='amounts'>
                    <LimitAmountInput
                        defaultValue={Number(filter?.limit_amount_lower)}
                        slim={true}
                        name="limit_amount_lower"
                        hasLabel={false}
                        withCents={false}
                        control={control}
                    />
                    <LimitAmountInput
                        defaultValue={Number(filter?.limit_amount_upper)}
                        slim={true}
                        name="limit_amount_upper"
                        hasLabel={false}
                        withCents={false}
                        control={control}
                    />
                </div>
                <div>
                    <label htmlFor="category">Category or Bill</label>
                </div>
                <div>
                    <FullSelectCategoryBill
                        defaultValue={categoryData?.filter(cat => filter?.items?.includes(cat.id))}
                        month={new Date(dateRangeFieldValue?.[1] || new Date().getTime()).getMonth() + 1}
                        year={new Date(dateRangeFieldValue?.[1] || new Date().getTime()).getFullYear()}
                        placeholder="Select"
                        SelectorComponent={SlimInputButton}
                        name="items"
                        control={control}
                        multiple={true}
                    />
                </div>
                <div>
                    <label htmlFor="merchant">Merchant</label>
                    <label htmlFor="account">Account</label>
                </div>
                <div>
                    <div key={resetAccountMerchantKeys[0]}>
                        <BakedComboBox
                            options={merchantsData}
                            multiple={true}
                            slim={true}
                            name="merchants"
                            control={control as any}
                            defaultValue={filter?.merchants}
                            placement={'left'}
                            placeholder={'Select'}
                            maxLength={24}
                            style={{ marginTop: '.375em' }}
                        />
                    </div>
                    <div key={resetAccountMerchantKeys[1]}>
                        <BakedListBox
                            defaultValue={accountsData?.accounts.filter(acc => accountsFieldValue?.includes(acc.account_id))}
                            as={SlimInputButton}
                            name="accounts"
                            control={control as any}
                            options={accountsData?.accounts}
                            placement={'right'}
                            placeholder={'Select'}
                            multiple={true}
                            labelKey={'name'}
                            subLabelKey={'mask'}
                            subLabelPrefix={'••••'}
                            valueKey={'account_id'}
                            dividerKey={'institution_id'}
                            style={{ marginTop: '.25em' }}
                            showLabel={false}
                        />
                    </div>
                </div>
                <div>
                    {merchantsFieldValue?.map((merchant, index) => (
                        <span>{`${merchant}${index !== merchantsFieldValue?.length - 1 ? ', ' : ''}`}</span>
                    ))}
                    {merchantsFieldValue &&
                        <DeleteButton
                            show={true}
                            drawable={false}
                            onClick={() => {
                                setResetAccountMerchantKeys(prev => [
                                    Math.random().toString(36).slice(2, 9),
                                    prev[1]
                                ])
                                resetField('merchants')
                            }}
                        />}
                </div>
                <div>
                    {accountsFieldValue?.map((account, index) => (
                        <span>
                            {accountsData?.accounts?.find((acc) => acc.account_id === account)?.name}
                            {index !== accountsFieldValue?.length - 1 ? ', ' : ''}
                        </span>
                    ))}
                    {(accountsFieldValue?.length as any > 0) &&
                        <DeleteButton
                            show={true}
                            drawable={false}
                            onClick={() => {
                                setResetAccountMerchantKeys(prev => [
                                    prev[0],
                                    Math.random().toString(36).slice(2, 9)
                                ])
                                resetField('accounts')
                            }}
                        />}
                </div>
            </fieldset>
            <div>
                <SecondaryButtonSlim
                    type="button"
                    onClick={() => {
                        reset()
                        setResetKey(Math.random().toString(36).slice(2, 9))
                        dispatch(clearConfirmedTransactionFilter())
                    }}
                >
                    Clear
                </SecondaryButtonSlim>
                <div>
                    <SecondaryButtonSlim
                        type="button"
                        onClick={() => { setShowFilterForm(false) }}
                    >
                        Cancel
                    </SecondaryButtonSlim>
                    <BlueSlimButton2>
                        Filter
                    </BlueSlimButton2>
                </div>
            </div>
        </form>
    )
}

const HistoryHeader = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()
    const {
        showFilterForm,
        setShowFilterForm,
        unconfirmedStackExpanded,
        setUnconfirmedStackExpanded
    } = useFilterFormContext()
    const windowApi = useSpringRef()
    const transitions = useTransition(showFilterForm, {
        from: {
            zIndex: 1,
            top: '4em',
            right: 0,
            width: '0%',
            height: '0%',
            opacity: 0
        },
        enter: { width: '100%', height: 'calc(100% - 4em)', opacity: 1 },
        leave: { width: '0%', height: '0%', opacity: 0 },
        ref: windowApi,
        config: { tension: 400, friction: 40 },
    })

    const formApi = useSpringRef()
    const containerStyles = useSpring({
        opacity: showFilterForm ? 1 : 0,
        ref: formApi,
        config: { tension: 400, friction: 40 },
    })

    useChain(showFilterForm ? [windowApi, formApi] : [formApi, windowApi], [0, .4])

    // On mount set month and date query params to current date and month
    // if we're on the spending page (otherwise the spending is located on the side
    // of the budget page)
    useEffect(() => {
        if (!location.pathname.includes('spending')) return

        if (!searchParams.get('month') || !searchParams.get('year')) {
            const year = sessionStorage.getItem(`budget-year`) || new Date().getFullYear()
            const month = sessionStorage.getItem(`budget-month`) || new Date().getMonth() + 1

            searchParams.set('month', `${month}`)
            searchParams.set('year', `${year}`)
        }
        setSearchParams(searchParams)
    }, [])

    return (
        <>
            <div className="window-header" id="history-header">
                <div><h2>History</h2></div>
                <div className="header-btns">
                    <Tooltip
                        msg="Filter"
                        ariaLabel="Filter"
                        type="left"
                    >
                        <IconButton
                            id="funnel-icon"
                            aria-label="Filter"
                            onClick={() => {
                                if (unconfirmedStackExpanded) {
                                    setTimeout(() => {
                                        setShowFilterForm(true)
                                    }, 200)
                                } else {
                                    setShowFilterForm(!showFilterForm)
                                }
                                setUnconfirmedStackExpanded(false)
                            }}
                        >
                            <Funnel />
                        </IconButton>
                    </Tooltip>
                </div>
                {transitions((styles, item) => item && (
                    <animated.div className="filter-window" style={styles}>
                        <animated.div style={containerStyles}>
                            <FilterWindow />
                        </animated.div>
                    </animated.div>
                ))}
            </div>
        </>
    )
}

export default HistoryHeader
