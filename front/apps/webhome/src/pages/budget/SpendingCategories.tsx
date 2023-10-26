import React, { FC, memo, Fragment, useState, useRef, useEffect } from 'react'

import { Tab } from '@headlessui/react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import Big from 'big.js'

import './styles/SpendingCategories.scss'
import type { Category } from '@features/categorySlice'
import { useGetCategoriesQuery } from '@features/categorySlice'
import { DollarCents, StaticProgressCircle, GrnPrimaryButton, BluePrimaryButton } from '@ledget/ui'
import { Plus } from '@ledget/media'


const NewCategoryButton: React.FC<{ period: 'month' | 'year' }> = ({ period }) => {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <>
            {period === 'year'
                ?
                <BluePrimaryButton
                    className={`add-new-category ${period}`}
                    onClick={() => {
                        navigate(
                            `${location.pathname}/new-category/${location.search}`,
                            { state: { period: period } }
                        )
                    }}
                >
                    <Plus stroke={'currentColor'} />
                </BluePrimaryButton>
                :
                <GrnPrimaryButton
                    className={`add-new-category ${period}`}
                    onClick={() => {
                        navigate(
                            `${location.pathname}/new-category/${location.search}`,
                            { state: { period: period } }
                        )
                    }}
                >
                    <Plus stroke={'currentColor'} />
                </GrnPrimaryButton>
            }
        </>
    )
}

const Column: FC<React.HTMLProps<HTMLDivElement>> = ({ children }) => {
    return (
        <div className="column">
            <div>{children}</div>
        </div>
    )
}

const Row = ({ category }: { category: Category }) => {
    return (
        <div className={`row ${category.period}`}>
            <div className="row-label">
                <span>{category.emoji}</span>
                <span>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</span>
            </div>
            {category.limit_amount ?
                <>
                    <div>
                        <DollarCents
                            value={category.amount_spent ? Big(category.amount_spent).toFixed(2) : '0.00'}
                            hasCents={false}
                        />
                    </div>
                    <div>/</div>
                    <div>
                        <DollarCents
                            value={category.limit_amount ? Big(category.limit_amount).div(100).toFixed(2) : '0.00'}
                            hasCents={false}
                        />
                    </div>
                    <div>
                        <StaticProgressCircle value={
                            Math.round(Big(category.amount_spent || 0).div(category.limit_amount).times(100).toNumber()) / 100 || 0
                        } />
                    </div>
                </>
                :
                <>
                    <div className="spanned">
                        <DollarCents
                            value={category.amount_spent ? Big(category.amount_spent).toFixed(2) : '0.00'}
                            hasCents={false}
                        />
                    </div>
                </>
            }
        </div>
    )
}

const Rows = memo(({ categories, period }: { categories: Category[], period: 'month' | 'year' }) => {

    return (
        <>
            {categories.length > 0
                ?
                <>
                    {categories.map(category => (
                        <Row key={category.id} category={category} />
                    ))}
                </>
                :
                <NewCategoryButton period={period} />
            }
        </>
    )
})

const RowHeader: FC<{ period: 'month' | 'year' }> = ({ period }) => {
    const [searchParams] = useSearchParams()
    const { data } = useGetCategoriesQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })

    const totalSpent = period === 'month' ? data?.monthly_spent : data?.yearly_spent
    const totalLimit = period === 'month' ? data?.limit_amount_monthly : data?.limit_amount_yearly

    return (
        <div className="row header">
            <div>
                <h4>
                    <span>{`${period.toUpperCase()}LY`} </span>
                    <span>SPENDING</span>
                </h4>
            </div>
            <div>
                <div>
                    <DollarCents value={totalSpent ? totalSpent : '0.00'} />
                </div>
            </div>
            <div>/</div>
            <div>
                <DollarCents value={totalLimit ? totalLimit : '0.00'} hasCents={false} />
            </div>
            <div>
                <StaticProgressCircle value={
                    totalLimit && totalSpent
                        ? Math.round(totalSpent / totalLimit * 100) / 100
                        : 0
                } />
            </div>
        </div>
    )
}

const ColumnView = () => {
    const [searchParams] = useSearchParams()
    const { data } = useGetCategoriesQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })

    return (
        <>
            <Column>
                <RowHeader period='month' />
                <Rows
                    categories={data?.categories.filter(category => category.period === 'month') || []}
                    period="month"
                />
            </Column>
            <Column>
                <RowHeader period='year' />
                <Rows
                    categories={data?.categories.filter(category => category.period === 'year') || []}
                    period="year"
                />
            </Column>
        </>
    )
}

const TabView = () => {
    const [searchParams] = useSearchParams()
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { data } = useGetCategoriesQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })

    const totalMonthlySpent = data?.monthly_spent
    const totalMonthlyLimit = data?.limit_amount_monthly
    const totalYearlySpent = data?.yearly_spent
    const totalYearlyLimit = data?.limit_amount_yearly

    return (
        <Tab.Group as={Column} selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List style={{ display: 'contents' }} className="row header">
                <div>
                    <Tab as={'span'}>
                        MONTHLY SPENDING
                    </Tab>
                    <Tab as={'span'}>
                        YEARLY SPENDING
                    </Tab>
                </div>
                <div>
                    <div>
                        <DollarCents
                            value={
                                selectedIndex === 0
                                    ? totalMonthlySpent ? totalMonthlySpent : '0.00'
                                    : totalYearlySpent ? totalYearlySpent : '0.00'
                            }
                        />
                    </div>
                </div>
                <div>/</div>
                <div>
                    <DollarCents
                        value={
                            selectedIndex === 0
                                ? totalMonthlyLimit ? totalMonthlyLimit : '0.00'
                                : totalYearlyLimit ? totalYearlyLimit : '0.00'
                        }
                        hasCents={false}
                    />
                </div>
                <div>
                    <StaticProgressCircle
                        value={
                            selectedIndex === 0
                                ? totalMonthlyLimit && totalMonthlySpent ? Math.round(totalMonthlySpent / totalMonthlyLimit * 100) / 100 : 0
                                : totalYearlyLimit && totalYearlySpent ? Math.round(totalYearlySpent / totalYearlyLimit * 100) / 100 : 0
                        }
                    />
                </div>
            </Tab.List>
            <Tab.Panels as={Fragment}>
                <Tab.Panel as={Fragment}>
                    <Rows
                        categories={data?.categories.filter(category => category.period === 'month') || []}
                        period="month"
                    />
                </Tab.Panel>
                <Tab.Panel as={Fragment}>
                    <Rows
                        categories={data?.categories.filter(category => category.period === 'year') || []}
                        period="year"
                    />
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    )
}

const SpendingCategories = () => {
    const [searchParams] = useSearchParams()
    const {
        isSuccess: categoriesSuccess,
        isLoading: categoriesIsLoading
    } = useGetCategoriesQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })
    const [isTabView, setIsTabView] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleResize = () => {
            setIsTabView(ref.current ? ref.current.offsetWidth < 600 : false)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [ref.current])

    return (
        <div id="spending-categories-window" ref={ref}>
            {categoriesSuccess &&
                <>
                    {isTabView ? <TabView /> : <ColumnView />}
                </>
            }
        </div>
    )
}

export default SpendingCategories
