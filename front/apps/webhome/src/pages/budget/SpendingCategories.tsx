import React, {
    FC,
    memo,
    Fragment,
    useMemo,
    useState,
    useRef,
    useEffect,
    createContext,
    useContext
} from 'react'

import Big from 'big.js'
import { Tab } from '@headlessui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ResponsiveLine } from '@nivo/line'
import type { Datum } from '@nivo/line'
import { Menu } from '@headlessui/react'
import dayjs from 'dayjs'
import { Plus, Edit2, Trash2 } from '@geist-ui/icons'

import { TransactionItem, DeleteCategoryModal } from '@modals/index'
import { Logo } from '@components/pieces'
import { useAppSelector } from '@hooks/store'
import './styles/SpendingCategories.scss'
import type { Category } from '@features/categorySlice'
import { useLazyGetTransactionsQuery, Transaction } from '@features/transactionsSlice'
import { EditCategory as EditCategoryModal } from '@modals/index'
import {
    useLazyGetCategoriesQuery,
    SelectCategoryBillMetaData,
    selectCategories,
    useGetCategorySpendingHistoryQuery,
} from '@features/categorySlice'
import {
    DollarCents,
    AnimatedDollarCents,
    StaticProgressCircle,
    BluePrimaryButton,
    ColoredShimmer,
    PillOptionButton,
    FadeInOutDiv,
    useLoaded,
    CloseButton,
    IconButton,
    IconButton3,
    ResponsiveLineContainer,
    formatCurrency,
    useNivoResponsiveBaseProps,
    useNivoResponsiveLineTheme,
    ChartTip,
    DropDownDiv,
    LoadingRing,
    ShimmerDiv,
    ShadowScrollDiv,
    BakedListBox,
    BillCatLabel,
    TabNavList,
    DropdownItem,
    useBillCatTabTheme
} from '@ledget/ui'
import { ArrowIcon, Ellipsis } from '@ledget/media'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'
import { useScreenContext } from '@context/context'

const categoryDetailContext = createContext<{
    detailedCategory?: Category,
    setDetailedCategory: React.Dispatch<React.SetStateAction<Category | undefined>>
} | undefined>(undefined)

const useCategoryDetailContext = () => {
    const context = useContext(categoryDetailContext)
    if (context === undefined) {
        throw new Error('useCategoryDetailContext must be used within a CategoryDetailProvider')
    }
    return context
}
const CategoryDetailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [detailedCategory, setDetailedCategory] = useState<Category>()

    return (
        <categoryDetailContext.Provider value={{ detailedCategory, setDetailedCategory }}>
            {children}
        </categoryDetailContext.Provider>
    )
}


const SpendingCategories = () => {
    const { screenSize } = useScreenContext()

    return (
        <div
            id="spending-categories-window"
            className={`${['small', 'extra-small'].includes(screenSize) ? 'tabbed' : ''}`}
        >

        </div>
    )
}

export default function () {
    return (
        <CategoryDetailProvider>
            <SpendingCategories />
        </CategoryDetailProvider>
    )
}
