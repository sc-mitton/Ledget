import { useEffect, Fragment } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'
import { Tab } from '@headlessui/react'

import { useItemsContext, ItemS } from './ItemsContext'
import { Recommendations as RecommendationsIcon } from '@ledget/media'
import { useAddnewBillMutation, NewBill } from '@features/billSlice'
import { useAddNewCategoryMutation, NewCategory } from '@features/categorySlice'
import { useUpdateUserMutation } from '@features/userSlice'
import { apiSlice } from '@api/apiSlice'
import { BlueSubmitWithArrow, BlueSlimButton2, TabNavList } from '@ledget/ui'

export const TabView = ({ children, item }: { children: React.ReactNode, item: ItemS }) => {
    const { periodTabIndex, setPeriodTabIndex } = useItemsContext(item)

    return (
        <Tab.Group selectedIndex={periodTabIndex} onChange={setPeriodTabIndex} as='div'>
            {({ selectedIndex }) => (
                <>
                    <TabNavList
                        className="onboarding-tab-list"
                        selectedIndex={selectedIndex}
                        labels={['Monthly', 'Yearly']}
                    />
                    <Tab.Panels as={Fragment}>
                        {children}
                    </Tab.Panels>
                </>
            )}
        </Tab.Group>
    )
}

export const BottomButtons = ({ item }: { item: ItemS }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [addNewBill, { isLoading: isBillLoading, isSuccess: isBillSuccess }] = useAddnewBillMutation()
    const [addNewCategory, { isLoading: isCategoryLoading, isSuccess: isCategorySuccess }] = useAddNewCategoryMutation()
    const [updateUser, { isSuccess: patchedUserSuccess }] = useUpdateUserMutation()

    const { month: { items: monthItems }, year: { items: yearItems } } = useItemsContext(item)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        if (location.pathname.includes('connect')) {
            navigate({
                pathname: '/welcome/add-bills',
                search: location.search,
            })
        } else if (location.pathname.includes('add-bills')) {
            if (monthItems.length === 0 && yearItems.length === 0) {
                navigate({
                    pathname: '/welcome/add-categories',
                    search: location.search,
                })
            } else {
                addNewBill([...monthItems, ...yearItems] as NewBill[])
            }
        } else if (location.pathname.includes('add-categories')) {
            if (monthItems.length === 0 && yearItems.length === 0) {
                updateUser({ is_onboarded: true })
            } else {
                addNewCategory([...monthItems, ...yearItems] as NewCategory[])
            }
        }
    }

    useEffect(() => {
        if (isBillSuccess) {
            navigate({
                pathname: '/welcome/add-categories',
                search: location.search,
            })
        }
    }, [isBillSuccess])

    // String of effects
    // 1) after categories added, patch user ->
    // 2) invalidate user cache ->
    // 3) if user is onboarded, navigate to dashboard
    useEffect(() => {
        if (isCategorySuccess) {
            updateUser({ is_onboarded: true })
        }
    }, [isCategorySuccess])

    useEffect(() => {
        if (patchedUserSuccess) {
            apiSlice.util.invalidateTags(['User'])
            navigate({ pathname: '/budget' })
        }
    }, [patchedUserSuccess])

    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (isCategorySuccess)
            timeout = setTimeout(() => {
                navigate('/budget')
            }, 1000)
        return () => clearTimeout(timeout)
    }, [isCategorySuccess])

    return (
        <div className="btn-container">
            <BlueSubmitWithArrow
                aria-label="Continue"
                onClick={handleClick}
                submitting={isBillLoading || isCategoryLoading}
                type="button"
            >
                Continue
            </BlueSubmitWithArrow>
        </div>
    )
}

export const RecommendationsButton = ({ item }: { item: ItemS }) => {
    const { setRecommendationsMode } = useItemsContext(item)

    return (
        <div>
            <BlueSlimButton2
                id="recommendations-btn"
                onClick={() => setRecommendationsMode(true)}
                aria-label="Recommendations"
            >
                Recommendations <RecommendationsIcon />
            </BlueSlimButton2>
        </div>
    )
}
