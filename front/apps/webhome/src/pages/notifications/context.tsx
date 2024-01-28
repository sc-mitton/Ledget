import { createContext, useContext, useState, ReactNode } from 'react'

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

export const SpendingViewContextProvider = ({ children }: { children: ReactNode }) => {
    const [showFilterForm, setShowFilterForm] = useState(false)
    const [unconfirmedStackExpanded, setUnconfirmedStackExpanded] = useState(false)

    return (
        <SpendingViewContext.Provider
            value={{
                showFilterForm,
                setShowFilterForm,
                unconfirmedStackExpanded,
                setUnconfirmedStackExpanded
            }}
        >
            {children}
        </SpendingViewContext.Provider>
    )
}
