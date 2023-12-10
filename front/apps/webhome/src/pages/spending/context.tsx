import { createContext, useContext } from 'react'

interface IFilterContext {
    showFilterForm: boolean;
    setShowFilterForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FilterContext = createContext<IFilterContext | null>(null)

export const useFilterFormContext = () => {
    const context = useContext(FilterContext)
    if (!context) {
        throw new Error('useFilterFormContext must be used within a Scheduler')
    }
    return context
}

export const FilterContextProvider = FilterContext.Provider
