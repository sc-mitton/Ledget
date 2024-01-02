import { useState, useEffect, Fragment } from 'react'

import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Big from 'big.js'
import { useNavigate, createSearchParams } from 'react-router-dom'
import { Menu } from '@headlessui/react'

import './styles/BudgetSummary.scss'
import {
    DollarCents,
    AnimatedDollarCents,
    StaticProgressCircle,
    IconButton,
    DropDownDiv,
    DropdownItem
} from '@ledget/ui'
import { ThumbUp, CheckMark2, Plus, Edit, Ellipsis } from '@ledget/media'
import { SelectCategoryBillMetaData, useLazyGetCategoriesQuery } from '@features/categorySlice'
import { selectBillMetaData, useLazyGetBillsQuery } from '@features/billSlice'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'

import MonthPicker from '@components/inputs/MonthPicker'

const SummaryStats = ({ showStats }: { showStats: 'month' | 'year' | undefined }) => {
    const [searchParams] = useSearchParams()
    const { start, end } = useGetStartEndQueryParams()

    const [getCategories, { isLoading: loadingCategories }] = useLazyGetCategoriesQuery()
    const [getBills, { isLoading: loadingBills }] = useLazyGetBillsQuery()
    const {
        monthly_spent,
        yearly_spent,
        total_monthly_spent,
        total_yearly_spent,
        limit_amount_monthly,
        limit_amount_yearly,
    } = useSelector(SelectCategoryBillMetaData)
    const {
        monthly_bills_paid,
        yearly_bills_paid,
        number_of_monthly_bills,
        number_of_yearly_bills,
        monthly_bills_amount_remaining,
        yearly_bills_amount_remaining,
        total_monthly_bills_amount,
        total_yearly_bills_amount
    } = useSelector(selectBillMetaData)

    useEffect(() => {
        if (start && end) {
            getCategories({ start, end })
            getBills({
                month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
                year: searchParams.get('year') || `${new Date().getFullYear()}`,
            })
        }
    }, [start, end])

    return (
        <>
            {/* Summary (they're transparent until use hovers over them) */}
            {Array.from(['month', 'year']).map((period, i) => {
                return (
                    <div
                        key={period}
                        className={`summary-stats
                        ${period}
                        ${period === 'year' && showStats === 'year' ? 'show' : ''}
                        ${period === 'month' && showStats === 'month' ? 'show' : ''}`}
                        aria-hidden={showStats ? false : true}
                        aria-label={`${period} stats`}
                    >
                        <div>
                            <div>
                                <div>
                                    <DollarCents value={
                                        period === 'month'
                                            ? total_monthly_spent || 0
                                            : total_yearly_spent || 0
                                    } />
                                </div>
                                <div>spent</div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>
                                    <DollarCents value={
                                        (loadingBills || loadingCategories) ? '0.00' : period === 'month'
                                            ? Big(limit_amount_monthly || 0)
                                                .minus(monthly_spent).toNumber() || 0
                                            : Big(limit_amount_yearly || 0)
                                                .minus(yearly_spent).toNumber() || 0
                                    } />
                                </div>
                                <div>spending left</div>
                            </div>
                            <StaticProgressCircle
                                value={
                                    (loadingBills || loadingCategories) ? 0 : period === 'month'
                                        ? Math.round((monthly_spent / limit_amount_monthly) * 100) / 100
                                        : Math.round((yearly_spent / limit_amount_yearly) * 100) / 100
                                }
                                size={'1.2em'}
                            />
                        </div>
                        <div>
                            <div>
                                <div><DollarCents value={
                                    period === 'month'
                                        ? monthly_bills_amount_remaining || 0
                                        : yearly_bills_amount_remaining || 0
                                } /></div>
                                <div> in bills left</div>
                            </div>
                            <StaticProgressCircle value={
                                period === 'year'
                                    ? Math.round(yearly_bills_amount_remaining! / (total_yearly_bills_amount!)) / 100 || 0
                                    : Math.round(monthly_bills_amount_remaining! / (total_monthly_bills_amount!)) / 100 || 0
                            } size={'1.2em'} />
                        </div>
                        <div>
                            <div>
                                <span>
                                    {period === 'month'
                                        ? `${monthly_bills_paid} of ${number_of_monthly_bills}`
                                        : `${yearly_bills_paid} of ${number_of_yearly_bills}`
                                    }
                                </span>
                                <div>bills paid</div>
                            </div>
                            <div style={{
                                opacity: period === 'month'
                                    ? (monthly_bills_paid === 0 ? .25 : 1)
                                    : (yearly_bills_paid === 0 ? .25 : 1)
                            }}
                            >
                                <CheckMark2 fill={'currentColor'} />
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}

const SummaryStatsTeaser = ({ setShowStats }: { setShowStats: React.Dispatch<React.SetStateAction<"month" | "year" | undefined>> }) => {
    const [searchParams] = useSearchParams()
    const { start, end } = useGetStartEndQueryParams()

    const [getCategories, { isLoading: loadingCategories }] = useLazyGetCategoriesQuery()
    const [getBills, { isLoading: loadingBills }] = useLazyGetBillsQuery()
    const {
        monthly_spent,
        yearly_spent,
        total_monthly_spent,
        total_yearly_spent,
        limit_amount_monthly,
        limit_amount_yearly,
    } = useSelector(SelectCategoryBillMetaData)

    useEffect(() => {
        if (start && end) {
            getCategories({ start, end })
            getBills({
                month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
                year: searchParams.get('year') || `${new Date().getFullYear()}`,
            })
        }
    }, [start, end])

    return (
        <>
            {/* Summary Teasers */}
            <div className='header'>
                <div><h4>Total</h4></div>
                <div>
                    <AnimatedDollarCents
                        value={loadingCategories || loadingBills
                            ? 0
                            : (total_yearly_spent + total_monthly_spent)}
                    />
                    <span>spent</span>
                </div>
            </div>
            {Array.from(['month', 'year'] as const).map((period, i) => {
                const amountLeft = (period === 'month')
                    ? Big(limit_amount_monthly || 0).minus(monthly_spent).toNumber()
                    : Big(limit_amount_yearly || 0).minus(yearly_spent).toNumber()
                return (
                    <div
                        className='header'
                        key={period}
                        tabIndex={0}
                        onFocus={() => setShowStats(period)}
                        onBlur={() => setShowStats(undefined)}
                        onMouseOver={() => setShowStats(period)}
                        onMouseOut={() => setShowStats(undefined)}
                    >
                        <div><h4>{period.charAt(0).toUpperCase() + period.slice(1)}</h4></div>
                        <div>
                            <AnimatedDollarCents value={Math.abs(amountLeft)} withCents={false} />
                            <div>
                                <span>{amountLeft >= 0 ? 'left' : 'over'}</span>
                                <div><ThumbUp
                                    className={`thumbs ${amountLeft >= 0 ? 'up' : 'down'}`}
                                    fill={'currentColor'}
                                /></div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}


const Wrapper = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => (
    <Menu.Item as={Fragment}>
        {({ active }) => (
            <DropdownItem
                active={active}
                onClick={() => onClick()}
            >
                {children}
            </DropdownItem>
        )}
    </Menu.Item>
)

const DropDown = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    return (
        <Menu as='div'>
            {({ open }) => (
                <>
                    <Menu.Button as={IconButton}><Ellipsis rotate={90} size={'1.25em'} /></Menu.Button>
                    <div style={{ position: 'relative' }}>
                        <DropDownDiv
                            placement='right'
                            visible={open}
                        >
                            <Menu.Items static>
                                <Wrapper
                                    onClick={() => navigate({
                                        pathname: '/budget/edit-categories',
                                        search: createSearchParams({
                                            month: searchParams.get('month') || '',
                                            year: searchParams.get('year') || ''
                                        }).toString()
                                    })}
                                >
                                    <Edit size={'.9em'} fill={'currentColor'} />
                                    Categories
                                </Wrapper>
                                <Wrapper
                                    onClick={() => navigate({
                                        pathname: `/budget/new-category`,
                                        search: createSearchParams({
                                            month: searchParams.get('month') || '',
                                            year: searchParams.get('year') || ''
                                        }).toString()
                                    })}
                                >
                                    <Plus size={'.9em'} stroke={'currentColor'} />
                                    New category
                                </Wrapper>
                                <Wrapper
                                    onClick={() => navigate({
                                        pathname: `/budget/new-bill`,
                                        search: createSearchParams({
                                            month: searchParams.get('month') || '',
                                            year: searchParams.get('year') || ''
                                        }).toString()
                                    })}
                                >
                                    <Plus size={'.9em'} stroke={'currentColor'} />
                                    New bill
                                </Wrapper>
                            </Menu.Items>
                        </DropDownDiv>
                    </div>
                </>
            )}
        </Menu >
    )
}

const BudgetSummary = () => {
    const [showStats, setShowStats] = useState<'month' | 'year'>()

    return (
        <div>
            <div>
                <div className="window-header">
                    <MonthPicker />
                    <DropDown />
                </div>
            </div>
            <div className={`budget-summary--container ${showStats ? 'expanded' : ''}`}>
                <SummaryStatsTeaser setShowStats={setShowStats} />
                <SummaryStats showStats={showStats} />
            </div>
        </div>
    )
}

export default BudgetSummary
