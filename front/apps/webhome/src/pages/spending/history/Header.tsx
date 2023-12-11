import { useState } from 'react'

import { set, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { DatePicker } from "antd";
import {
    useTransition,
    animated,
    useSpring,
    useChain,
    useSpringRef
} from '@react-spring/web'
import { useGetAccountsQuery } from '@features/accountsSlice'
import { useGetMerchantsQuery } from '@features/transactionsSlice'

import './styles/Header.scss'
import { Funnel } from '@ledget/media'
import { FullSelectCategoryBill } from '@components/dropdowns'
import { LimitAmountInput } from '@components/inputs'
import {
    IconButton,
    Tooltip,
    BlueSlimButton2,
    InputButton,
    BakedListBox,
    BakedComboBox,
    SecondaryButtonSlim
} from '@ledget/ui'
import { useFilterFormContext } from '../context';


const { RangePicker } = DatePicker

const filterSchema = z.object({
    date_range: z.array(z.number()),
    limit_amount_lower: z.number(),
    limit_amount_upper: z.number(),
    item: z.array(z.string()),
    merchant: z.array(z.string()),
    account: z.array(z.string()),
})

const FilterWindow = () => {
    const { setShowFilterForm } = useFilterFormContext()
    const { data: accountsData } = useGetAccountsQuery()
    const { data: merchantsData } = useGetMerchantsQuery()

    const { handleSubmit, control } = useForm<z.infer<typeof filterSchema>>({
        resolver: zodResolver(filterSchema),
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    })

    return (
        <form onSubmit={handleSubmit((data) => {
            setShowFilterForm(false)
        })}>
            <fieldset>
                <Controller
                    name="date_range"
                    control={control}
                    rules={{ required: true }}
                    render={(props) => (
                        <>
                            <label htmlFor="date_range">Date</label>
                            <RangePicker
                                format="YYYY-MM-DD"
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
                        name="limit_amount_lower"
                        hasLabel={false}
                        withCents={false}
                        control={control}
                    />
                    <LimitAmountInput
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
                        placeholder="Category or Bill"
                        SelectorComponent={InputButton}
                        name="item"
                        control={control}
                        multiple={true}
                    />
                </div>
                <div>
                    <label htmlFor="merchant">Merchant</label>
                    <label htmlFor="account">Account</label>
                </div>
                <div>
                    <BakedComboBox
                        name="merchant"
                        control={control as any}
                        options={merchantsData}
                        placement={'left'}
                        placeholder={'Merchant'}
                        maxLength={24}
                        multiple={true}
                    />
                    <BakedListBox
                        name="account"
                        control={control as any}
                        options={accountsData?.accounts}
                        placement={'right'}
                        placeholder={'Account'}
                        multiple={true}
                        labelKey={'name'}
                        subLabelKey={'mask'}
                        subLabelPrefix={'••••'}
                        valueKey={'account_id'}
                        dividerKey={'institution_id'}
                    />
                </div>
            </fieldset>
            <div>
                <SecondaryButtonSlim
                    type="button"
                    onClick={() => { setShowFilterForm(false) }}
                >
                    Cancel
                </SecondaryButtonSlim>
                <BlueSlimButton2>
                    Apply
                </BlueSlimButton2>
            </div>
        </form>
    )
}

const HistoryHeader = () => {
    const {
        showFilterForm,
        setShowFilterForm,
        unconfirmedStackExpanded,
        setUnconfirmedStackExpanded
    } = useFilterFormContext()
    const windowApi = useSpringRef()
    const transitions = useTransition(showFilterForm, {
        from: {
            zIndex: 0,
            top: 0,
            right: 0,
            width: '0%',
            height: '0%',
            opacity: 0
        },
        enter: { width: '100%', height: '100%', opacity: 1 },
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
