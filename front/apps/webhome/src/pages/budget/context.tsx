import { useContext, createContext, useState } from 'react'

export type BudgetItemSortOptions = 'alpha-asc' | 'alpha-des' | 'limit-asc' | 'limit-des' | 'amount-asc' | 'amount-des' | 'default'

interface TSortContext {
    categoriesSort?: BudgetItemSortOptions
    billsSort?: BudgetItemSortOptions
    setCategoriesSort: React.Dispatch<React.SetStateAction<BudgetItemSortOptions | undefined>>
    setBillsSort: React.Dispatch<React.SetStateAction<BudgetItemSortOptions | undefined>>
}

const SortContext = createContext<TSortContext | undefined>(undefined)

export const useSortContext = () => {
    const context = useContext(SortContext)
    if (context === undefined) {
        throw new Error('useSortContext must be used within a SortProvider')
    }
    return context
}

export const SortProvider = ({ children }: { children: React.ReactNode }) => {
    const [categoriesSort, setCategoriesSort] = useState<BudgetItemSortOptions>()
    const [billsSort, setBillsSort] = useState<BudgetItemSortOptions>()

    return (
        <SortContext.Provider value={{ categoriesSort, billsSort, setCategoriesSort, setBillsSort }}>
            {children}
        </SortContext.Provider>
    )
}
