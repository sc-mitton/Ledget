import { createContext, useContext } from 'react'

interface IFilterContext {
    showFilterForm: boolean
    setShowFilterForm: React.Dispatch<React.SetStateAction<boolean>>
    unconfirmedStackExpanded: boolean
    setUnconfirmedStackExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

export const SpendingViewContext = createContext<IFilterContext | null>(null)

export const useFilterFormContext = () => {
    const context = useContext(SpendingViewContext)
    if (!context) {
        throw new Error('useFilterFormContext must be used within a Scheduler')
    }
    return context
}

export const SpendingViewContextProvider = SpendingViewContext.Provider
