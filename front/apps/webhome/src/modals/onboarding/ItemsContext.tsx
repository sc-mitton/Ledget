import { useContext, createContext, useState, useEffect } from "react"
import {
    TransitionFn,
    SpringRef,
    SpringValue,
    useSpringRef,
    useSpring,
    useTransition,
    useChain
} from '@react-spring/web'
import { useLocation } from "react-router-dom"

import { FormBill, useLazyGetBillsQuery } from '@features/billSlice'
import { FormCategory, useLazyGetCategoriesQuery } from '@features/categorySlice'

const itemHeight = 25
const itemPadding = 8

type Period = 'month' | 'year'
export type ItemS = 'bill' | 'category'

type BillOrCatFromString<I extends ItemS> = I extends 'bill' ? FormBill : FormCategory

export type Item<I extends FormBill | FormCategory, P> = I extends FormBill
    ? Omit<FormBill, 'period'> & (P extends 'month' ? { period: 'month' } : { period: 'year' }) & { fetchedFromServer?: boolean }
    : Omit<FormCategory, 'period'> & (P extends 'month' ? { period: 'month' } : { period: 'year' }) & { fetchedFromServer?: boolean }

export type BillItem<P extends Period> = Item<FormBill, P>
export type CategoryItem<P extends Period> = Item<FormCategory, P>

interface MonthYearContext<BC extends FormBill | FormCategory, P extends Period> {
    items: Item<BC, P>[]
    setItems: React.Dispatch<React.SetStateAction<Item<BC, P>[]>>
    transitions: TransitionFn<Item<BC, P> | undefined, any>
    api: SpringRef<any>
    containerProps: { [key: string]: SpringValue<any> }
    containerApi: SpringRef<any>
    isEmpty: boolean
}

interface ItemsContextProps<BC extends FormBill | FormCategory> {
    itemsEmpty: boolean
    recommendationsMode: boolean
    setRecommendationsMode: React.Dispatch<React.SetStateAction<boolean>>
    bufferItem: BC | undefined
    setBufferItem: React.Dispatch<React.SetStateAction<BC | undefined>>
    month: MonthYearContext<BC, 'month'>
    year: MonthYearContext<BC, 'year'>
}

const BillsContext = createContext<ItemsContextProps<FormBill> | undefined>(undefined)
const CategoriesContext = createContext<ItemsContextProps<FormCategory> | undefined>(undefined)

export const useItemsContext = <T extends ItemS>(items: T):
    T extends 'bill' ? ItemsContextProps<FormBill> : ItemsContextProps<FormCategory> => {

    const context = items === 'bill' ? useContext(BillsContext) : useContext(CategoriesContext)

    if (context === undefined) {
        throw new Error('useBillsContext must be used within a BillsProvider')
    }

    return context as any
}

const transitionConfig = {
    from: () => ({ opacity: 0, zIndex: 0, scale: 1 }),
    enter: (item: any, index: number) => ({ opacity: 1, y: index * (itemHeight + itemPadding) }),
    update: (item: any, index: number) => ({ y: index * (itemHeight + itemPadding) }),
    leave: () => ({ opacity: 0 }),
    config: { duration: 100 },
}

export const ItemsProvider = ({ children, itemType }: { children: React.ReactNode, itemType: ItemS }) => {
    const [
        fetchBills,
        { data: fetchedBills, isSuccess: fetchedBillsSuccess }
    ] = useLazyGetBillsQuery()
    const [
        fetchCategories,
        { data: fetchedCategories, isSuccess: fetchedCategoriesSuccess }
    ] = useLazyGetCategoriesQuery()

    const [monthItems, setMonthItems] = useState<Item<BillOrCatFromString<typeof itemType>, 'month'>[]>([])
    const [yearItems, setYearItems] = useState<Item<BillOrCatFromString<typeof itemType>, 'year'>[]>([])
    const [itemsEmpty, setItemsEmpty] = useState(true)
    const [recommendationsMode, setRecommendationsMode] = useState(false)
    const [emptyYearItems, setEmptyYearItems] = useState(true)
    const [emptyMonthItems, setEmptyMonthItems] = useState(true)
    const [bufferItem, setBufferItem] = useState<BillOrCatFromString<typeof itemType> | undefined>(undefined)

    const monthApi = useSpringRef()
    const yearApi = useSpringRef()
    const monthContainerApi = useSpringRef()
    const yearContainerApi = useSpringRef()
    const location = useLocation()

    const monthTransitions = useTransition(
        monthItems,
        { ...transitionConfig, ref: monthApi }
    )
    const yearTransitions = useTransition(
        yearItems,
        { ...transitionConfig, ref: yearApi }
    )

    const monthContainerProps = useSpring({
        height: (monthItems.length) * (itemHeight + itemPadding),
        maxHeight: 6 * (itemHeight + itemPadding),
        ref: monthContainerApi,
        config: { duration: 100 },
        position: 'relative',
        overflowX: 'hidden',
        width: '100%',
        overflowY: monthItems.length >= 6 ? 'scroll' : 'hidden',
    })
    const yearContainerProps = useSpring({
        height: (yearItems.length) * (itemHeight + itemPadding),
        maxHeight: 6 * (itemHeight + itemPadding),
        ref: yearContainerApi,
        position: 'relative',
        overflowX: 'hidden',
        width: '100%',
        overflowY: yearItems.length >= 6 ? 'scroll' : 'hidden',
        config: { duration: 100 },
    })

    useChain([monthApi, monthContainerApi], [0, 0])
    useChain([yearApi, yearContainerApi,], [0, 0])

    useEffect(() => {
        if (location.pathname.includes('add-bills')) {
            fetchBills()
        } else if (location.pathname.includes('add-categories')) {
            fetchCategories()
        }
    }, [location])

    useEffect(() => {
        if (fetchedBillsSuccess && fetchedBills) {
            for (const bill of fetchedBills) {
                if (bill.period === 'month' && monthItems.length === 0) {
                    setMonthItems((prev) => [...prev, { ...bill, period: 'month', fetchedFromServer: true }])
                } else if (bill.period === 'year' && yearItems.length === 0) {
                    setYearItems((prev) => [...prev, { ...bill, period: 'year', fetchedFromServer: true }])
                }
            }
        }
    }, [fetchedBills])

    useEffect(() => {
        if (fetchedCategoriesSuccess && fetchedCategories) {
            fetchedCategories.filter(category => !category.is_default).forEach(category => {
                if (category.period === 'month' && monthItems.length === 0) {
                    setMonthItems((prev) => [...prev, { ...category, period: 'month', fetchedFromServer: true }])
                } else if (category.period === 'year' && yearItems.length === 0) {
                    setYearItems((prev) => [...prev, { ...category, period: 'year', fetchedFromServer: true }])
                }
            })
        }
    }, [fetchedCategories])

    useEffect(() => {
        monthApi.start()
        monthContainerApi.start()
        if (monthItems.length > 0) {
            setEmptyMonthItems(false)
        }
    }, [monthItems])

    useEffect(() => {
        yearApi.start()
        yearContainerApi.start()
        if (yearItems.length > 0) {
            setEmptyYearItems(false)
        }
    }, [yearItems])

    useEffect(() => {
        if (monthItems.length > 0 || yearItems.length > 0) {
            setItemsEmpty(false)
        } else {
            setItemsEmpty(true)
        }
    }, [monthItems, yearItems])

    const monthContext = {
        items: monthItems,
        setItems: setMonthItems,
        transitions: monthTransitions,
        api: monthApi,
        containerProps: monthContainerProps,
        containerApi: monthContainerApi,
        isEmpty: emptyMonthItems
    }

    const yearContext = {
        items: yearItems,
        setItems: setYearItems,
        transitions: yearTransitions,
        api: yearApi,
        containerProps: yearContainerProps,
        containerApi: yearContainerApi,
        isEmpty: emptyYearItems
    }

    const vals = {
        itemsEmpty,
        recommendationsMode: recommendationsMode,
        setRecommendationsMode: setRecommendationsMode,
        bufferItem,
        setBufferItem,
        month: monthContext,
        year: yearContext,
    }

    return (
        itemType === 'bill' ?
            <BillsContext.Provider value={vals as ItemsContextProps<FormBill>} >
                {children}
            </BillsContext.Provider>
            :
            <CategoriesContext.Provider value={vals as ItemsContextProps<FormCategory>}>
                {children}
            </CategoriesContext.Provider>
    )
}
