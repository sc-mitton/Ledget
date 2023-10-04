import React, { useEffect, useState } from 'react'

import { useLocation } from 'react-router-dom'

import { useTransition, useSpring, useSpringRef, useChain } from '@react-spring/web'
import { itemHeight, itemPadding } from './constants'
import { useLazyGetBillsQuery } from '@features/billSlice'
import { useLazyGetCategoriesQuery } from '@features/categorySlice'

const transitionConfig = {
    from: () => ({ opacity: 0, zIndex: 0, fontWeight: 500 }),
    enter: (item, index) => ({ opacity: 1, y: index * (itemHeight + itemPadding) }),
    update: (item, index) => ({ y: index * (itemHeight + itemPadding) }),
    leave: () => ({ opacity: 0 }),
    config: { duration: 100 },
}

export const ItemsContext = React.createContext()

export const ItemsProvider = ({ children }) => {
    const [fetchBills, { data: fetchedBills, isSuccess: fetchedBillsSuccess }] = useLazyGetBillsQuery()
    const [fetchCategories, { data: fetchedCategories, isSuccess: fetchedCategoriesSuccess }] = useLazyGetCategoriesQuery()

    const [monthItems, setMonthItems] = useState([])
    const [yearItems, setYearItems] = useState([])
    const [itemsEmpty, setItemsEmpty] = useState(true)
    const [recommendationsMode, setRecommendationsMode] = useState(false)
    const [emptyYearItems, setEmptyYearItems] = useState(true)
    const [emptyMonthItems, setEmptyMonthItems] = useState(true)
    const [bufferItem, setBufferItem] = useState(undefined)

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
        height: (monthItems.length + 1) * (itemHeight + itemPadding),
        maxHeight: 6 * (itemHeight + itemPadding),
        ref: monthContainerApi,
        config: { duration: 100 },
        position: 'relative',
        overflowX: 'hidden',
        marginTop: '20px',
        overflowY: monthItems.length >= 6 ? 'scroll' : 'hidden',
    })
    const yearContainerProps = useSpring({
        height: (yearItems.length + 1) * (itemHeight + itemPadding),
        maxHeight: 6 * (itemHeight + itemPadding),
        ref: yearContainerApi,
        position: 'relative',
        overflowX: 'hidden',
        marginTop: '20px',
        overflowY: yearItems.length >= 6 ? 'scroll' : 'hidden',
        config: { duration: 100 },
    })

    useChain([monthApi, monthContainerApi], [0, 0])
    useChain([yearApi, yearContainerApi,], [0, 0])

    useEffect(() => {
        if (location.pathname === '/welcome/add-bills') {
            fetchBills()
        } else if (location.pathname === '/welcome/add-categories') {
            fetchCategories()
        }
    }, [location])

    useEffect(() => {
        if (fetchedBillsSuccess) {
            for (const bill of fetchedBills) {
                const { period, ...rest } = bill
                if (period === 'month' && monthItems.length === 0) {
                    setMonthItems((prev) => [...prev, { ...rest, fetchedFromServer: true }])
                } else if (period === 'year' && yearItems.length === 0) {
                    setYearItems((prev) => [...prev, { ...rest, fetchedFromServer: true }])
                }
            }
        }
    }, [fetchedBills])

    useEffect(() => {
        if (fetchedCategoriesSuccess) {
            for (const category of fetchedCategories) {
                const { period, ...rest } = category
                if (period === 'month' && monthItems.length === 0) {
                    setMonthItems((prev) => [...prev, { ...rest, fetchedFromServer: true }])
                } else if (period === 'year' && yearItems.length === 0) {
                    setYearItems((prev) => [...prev, { ...rest, fetchedFromServer: true }])
                }
            }
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
        <ItemsContext.Provider value={vals}>
            {children}
        </ItemsContext.Provider>
    )
}
