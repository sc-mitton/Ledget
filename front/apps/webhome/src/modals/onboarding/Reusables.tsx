import { useEffect, useState, Fragment } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'
import { Tab } from '@headlessui/react'

import { useItemsContext, ItemS, Item } from './ItemsContext'
import { Recommendations as RecommendationsIcon } from '@ledget/media'
import { useAddnewBillMutation, Bill } from '@features/billSlice'
import { useAddNewCategoryMutation, Category } from '@features/categorySlice'
import { useUpdateUserMutation, useGetMeQuery } from '@features/userSlice'
import { BlackCheckSubmitButton, BlackSubmitWithArrow, BlueSlimButton2, TabNavList, useBillCatTabTheme } from '@ledget/ui'

export const TabView = ({ children, item }: { children: React.ReactNode, item: ItemS }) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [updatePill, setUpdatePill] = useState(false)
    const { month: { items: monthItems }, year: { items: yearItems } } = useItemsContext(item)
    const tabTheme = useBillCatTabTheme()

    useEffect(() => {
        if (monthItems.length === 0) return
        setSelectedIndex(0)
    }, [monthItems])

    useEffect(() => {
        if (yearItems.length === 0) return
        setSelectedIndex(1)
    }, [yearItems])

    useEffect(() => {
        setUpdatePill(!updatePill)
    }, [selectedIndex])

    return (
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            {({ selectedIndex }) => (
                <>
                    <TabNavList
                        className="onboarding-tab-list"
                        selectedIndex={selectedIndex}
                        labels={['Monthly', 'Yearly']}
                        theme={tabTheme}
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
    const { refetch: refetchUser } = useGetMeQuery()
    const [updateUser, { isSuccess: patchedUserSuccess }] = useUpdateUserMutation()

    const { month: { items: monthItems }, year: { items: yearItems }, itemsEmpty } = useItemsContext(item)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        const newMonthItems = item === 'bill'
            ? (monthItems as Item<Bill, 'month'>[]).filter(item => !item.fetchedFromServer).map(item => {
                const { name, upper_amount, period, emoji } = item
                return { name, upper_amount, period, emoji }
            })
            : (monthItems as Item<Category, 'month'>[]).filter(item => !item.fetchedFromServer).map(item => {
                const { name, limit_amount, period, emoji } = item
                return { name, limit_amount, period, emoji }
            })

        const newYearItems = item === 'bill'
            ? (yearItems as Item<Bill, 'year'>[]).filter(item => !item.fetchedFromServer).map(item => {
                const { name, upper_amount, period, emoji } = item
                return { name, upper_amount, period, emoji }
            })
            : (yearItems as Item<Category, 'year'>[]).filter(item => !item.fetchedFromServer).map(item => {
                const { name, limit_amount, period, emoji } = item
                return { name, limit_amount, period, emoji }
            })

        if (newMonthItems.length === 0 && newYearItems.length === 0)
            navigate('/welcome/add-categories')

        switch (item) {
            case 'bill':
                addNewBill([...newMonthItems, ...newYearItems] as Bill[])
                break
            case 'category':
                addNewCategory([...newMonthItems, ...newYearItems] as Category[])
                break
            default:
                break
        }
    }

    useEffect(() => {
        if (isBillSuccess) {
            navigate({
                pathname: '/budget/welcome/add-categories',
                search: location.search,
            })
        }
    }, [isBillSuccess])

    // String of effects
    // 1) after categories added, patch user ->
    // 2) refetch user ->
    // 3) if user is onboarded, navigate to dashboard
    useEffect(() => {
        if (isCategorySuccess) {
            updateUser({ is_onboarded: true })
        }
    }, [isCategorySuccess])

    useEffect(() => {
        if (patchedUserSuccess) {
            refetchUser()
        }
    }, [patchedUserSuccess])

    // useEffect(() => {
    //     if (user?.is_onboarded)
    //         navigate('/budget')
    // }, [user])

    return (
        <div className="btn-container">
            {/* <BlackCheckSubmitButton
                aria-label="Add Category"
                type="submit"
            >
                Add
            </BlackCheckSubmitButton> */}
            <BlackSubmitWithArrow
                aria-label="Next"
                onClick={handleClick}
                disabled={itemsEmpty}
                submitting={isBillLoading || isCategoryLoading}
                type="button"
            >
                Next
            </BlackSubmitWithArrow>
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
                Recommendations <RecommendationsIcon fill={'currentColor'} />
            </BlueSlimButton2>
        </div>
    )
}
