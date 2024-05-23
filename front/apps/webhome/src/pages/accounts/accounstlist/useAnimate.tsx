import { useEffect, useRef, useState } from 'react'

import { Location, useLocation } from 'react-router-dom'
import { useSpringRef, useTransition } from '@react-spring/web'
import { useUpdateAccountsMutation } from '@features/accountsSlice'
import { useSpringDrag } from '@ledget/ui'
import pathMappings from '../path-mappings'

const _filterAccounts = (accounts: any[], location: Location) => {
    return accounts.filter((account: any) =>
        account.type === pathMappings.getAccountType(location)
    )
}

function useAnimate<A>({ accounts, waferWidth, waferPadding }: { accounts?: A[], waferWidth: number, waferPadding: number }) {
    const [updateOrder, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] = useUpdateAccountsMutation()
    const [freezeWaferAnimation, setFreezeWaferAnimation] = useState(false)
    const location = useLocation()

    const order = useRef(_filterAccounts(accounts || [], location).map((item) => item.account_id))

    useEffect(() => {
        order.current = _filterAccounts(accounts || [], location).map((item) => item.account_id)
    }, [accounts, location.pathname])

    // Start initial animation
    useEffect(() => {
        waferApi.start()
    }, [location.pathname, accounts])

    // Freeze Wafer Animation when updating order
    useEffect(() => {
        if (isUpdating) {
            setFreezeWaferAnimation(true)
        }
        let timeout: NodeJS.Timeout
        if (isUpdateSuccess) {
            timeout = setTimeout(() => {
                setFreezeWaferAnimation(false)
            }, 2000)
        }
        return () => { clearTimeout(timeout) }
    }, [isUpdateSuccess, isUpdating])

    const waferApi = useSpringRef()
    const transitions = useTransition(accounts, {
        from: (item: any, index: number) => ({
            x: index * (waferWidth + waferPadding) + (15 * (index + 1) ** 2),
            scale: 1,
            zIndex: 0,
            width: waferWidth,
            opacity: 0,
        }),
        enter: (item: any, index: number) => ({
            x: index * (waferWidth + waferPadding),
            opacity: 1,
        }),
        immediate: freezeWaferAnimation,
        ref: waferApi
    })

    const bind = useSpringDrag({
        order: order,
        indexCol: 'account_id',
        style: { axis: 'x', size: waferWidth, padding: waferPadding },
        onRest: (newOrder: string[]) => {
            if (order.current !== newOrder) {
                updateOrder(
                    newOrder.map((id, index) => ({
                        account: id,
                        order: index
                    }))
                )
            }
        },
        api: waferApi
    })

    return { transitions, bind, waferApi }
}

export default useAnimate
