import React, { useEffect, useState } from 'react'

import { useTransition, useSpring, useSpringRef, useChain } from '@react-spring/web'
import { itemHeight, itemPadding } from './constants'

const transitionConfig = {
    from: () => ({ opacity: 0, zIndex: 0, fontWeight: 500 }),
    enter: (item, index) => ({ opacity: 1, y: index * (itemHeight + itemPadding) }),
    update: (item, index) => ({ y: index * (itemHeight + itemPadding) }),
    leave: () => ({ opacity: 0 }),
    config: { duration: 100 },
}

export const ItemsContext = React.createContext()

export const ItemsProvider = ({ children }) => {
    const [monthItems, setMonthItems] = useState([])
    const [yearItems, setYearItems] = useState([])
    const [yearFlexBasis, setYearFlexBasis] = useState(0)
    const [monthFlexBasis, setMonthFlexBasis] = useState(0)
    const [itemsEmpty, setItemsEmpty] = useState(true)
    const monthApi = useSpringRef()
    const yearApi = useSpringRef()
    const monthContainerApi = useSpringRef()
    const yearContainerApi = useSpringRef()

    const getFlexBasis = (categories) => {
        const val = categories.reduce((acc, curr) => {
            if (curr.name.length > acc) {
                return curr.name.length
            } else {
                return acc
            }
        }, 0)
        return val
    }

    const updateFlexiBasis = (period) => {
        if (period === 'month') {
            const monthFlexBasis = getFlexBasis(monthItems)
            setMonthFlexBasis(`${monthFlexBasis}ch`)
        } else {
            const yearFlexBasis = getFlexBasis(yearItems)
            setYearFlexBasis(`${yearFlexBasis}ch`)
        }
    }

    const monthTransitions = useTransition(
        monthItems,
        { ...transitionConfig, ref: monthApi }
    )
    const yearTransitions = useTransition(
        yearItems,
        { ...transitionConfig, ref: yearApi }
    )
    const monthContainerProps = useSpring({
        height: monthItems.length * (itemHeight + itemPadding),
        maxHeight: 6 * (itemHeight + itemPadding),
        ref: monthContainerApi,
        config: { duration: 100 },
        position: 'relative',
        overflowX: 'hidden',
        marginTop: '20px',
        overflowY: monthItems.length >= 6 ? 'scroll' : 'hidden',
    })
    const yearContainerProps = useSpring({
        height: yearItems.length * (itemHeight + itemPadding),
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
        monthApi.start()
        updateFlexiBasis('month')
        monthContainerApi.start()
    }, [monthItems])

    useEffect(() => {
        yearApi.start()
        updateFlexiBasis('year')
        yearContainerApi.start()
    }, [yearItems])

    useEffect(() => {
        if (monthItems.length > 0 || yearItems.length > 0) {
            setItemsEmpty(false)
        } else {
            setItemsEmpty(true)
        }
    }, [monthItems, yearItems])

    const vals = {
        monthItems,
        setMonthItems,
        yearItems,
        setYearItems,
        itemsEmpty,
        yearFlexBasis,
        monthFlexBasis,
        yearTransitions,
        yearApi,
        monthTransitions,
        monthApi,
        yearContainerApi,
        yearContainerProps,
        monthContainerApi,
        monthContainerProps
    }

    return (
        <ItemsContext.Provider value={vals}>
            {children}
        </ItemsContext.Provider>
    )
}
