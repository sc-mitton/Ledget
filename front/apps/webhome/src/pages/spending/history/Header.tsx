import { useState, useRef } from 'react'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Combobox } from '@headlessui/react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { DatePicker } from "antd";
import { useTransition, animated, useSpring, useChain, useSpringRef } from '@react-spring/web'
import { useGetAccountsQuery } from '@features/accountsSlice'
import { useGetMerchantsQuery } from '@features/transactionsSlice'

import './styles/Header.scss'
import { Funnel } from '@ledget/media'
import { FullSelectCategoryBill } from '@components/dropdowns'
import { LimitAmountInput } from '@components/inputs'
import {
    IconButton,
    Tooltip,
    SlimInputButton,
    InputButton,
    BakedListBox,
} from '@ledget/ui'


const { RangePicker } = DatePicker

const filterSchema = z.object({
    date_range: z.array(z.number().nullable()),
    limit_amount_lower: z.number().nullable(),
    limit_amount_upper: z.number().nullable(),
})

const FilterWindow = ({ setShowFilter }:
    { setShowFilter: (show: boolean) => void }) => {

    const { data: accountsData } = useGetAccountsQuery()
    const { data: merchantsData } = useGetMerchantsQuery()

    const { handleSubmit, formState: { errors }, control } = useForm<z.infer<typeof filterSchema>>({
        resolver: zodResolver(filterSchema),
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    })

    return (
        <form>
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
                    <label htmlFor="merchant">Merchant</label>
                    <label htmlFor="account">Account</label>
                </div>
                <div>
                    <BakedListBox
                        options={merchantsData}
                        placement={'left'}
                        placeholder={'Merchant'}
                    />
                    <BakedListBox
                        options={accountsData?.accounts}
                        placement={'left'}
                        placeholder={'Account'}
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
                    />
                </div>
            </fieldset>
            <div>
                <SlimInputButton>
                    Apply
                </SlimInputButton>
            </div>
        </form>
    )
}

const HistoryHeader = () => {
    const [showFilter, setShowFilter] = useState<boolean>(false)

    const windowApi = useSpringRef()
    const transitions = useTransition(showFilter, {
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
    })

    const formApi = useSpringRef()
    const containerStyles = useSpring({
        opacity: showFilter ? 1 : 0,
        ref: formApi
    })

    useChain(showFilter ? [windowApi, formApi] : [formApi, windowApi], [0, .4])

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
                            onClick={() => setShowFilter(!showFilter)}
                        >
                            <Funnel />
                        </IconButton>
                    </Tooltip>
                </div>
                {transitions((styles, item) => item && (
                    <animated.div className="filter-window" style={styles}>
                        <animated.div style={containerStyles}>
                            <FilterWindow setShowFilter={setShowFilter} />
                        </animated.div>
                    </animated.div>
                ))}
            </div>
        </>
    )
}

export default HistoryHeader
