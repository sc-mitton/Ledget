import { Fragment } from 'react'

import { Tab } from '@headlessui/react'

import { MonthSummaryHeader, YearSummaryHeader, MonthlySummary, YearlySummary } from './Summary'
import BudgetItemRows from './BudgetItemRows'
import { useGetCategoriesQuery } from '@features/categorySlice'
import { useGetBillsQuery } from '@features/billSlice'


const TabView = () => {
    const { data: categories } = useGetCategoriesQuery()
    const { data: bills } = useGetBillsQuery()

    return (
        <Tab.Group as={Fragment}>
            <Tab.List id="tab-view--list">
                <Tab>
                    <MonthSummaryHeader />
                </Tab>
                <Tab>
                    <YearSummaryHeader />
                </Tab>
            </Tab.List>
            <Tab.Panels>
                <Tab.Panel >
                    <MonthlySummary />
                    <div className="budget--content">
                        <BudgetItemRows
                            period="month"
                            categories={categories}
                            bills={bills}
                        />
                    </div>
                </Tab.Panel>
                <Tab.Panel >
                    <YearlySummary />
                    <div className="budget--content">
                        <BudgetItemRows
                            period="year"
                            categories={categories}
                            bills={bills}
                        />
                    </div>
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    )
}

export default TabView
