import React, { useContext, useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { animated } from '@react-spring/web'
import { Tab } from '@headlessui/react'
import { useLocation } from 'react-router-dom'

import { ItemsContext } from './ItemsContext'
import { Recommendations as RecommendationsIcon } from '@ledget/shared-assets'
import { usePillAnimation } from '@utils/hooks'
import { useAddnewBillMutation } from '@features/billSlice'
import { useAddNewCategoryMutation } from '@features/categorySlice'
import { useUpdateUserMutation, useGetMeQuery } from '@features/userSlice'
import { GreenCheckSubmitButton, BlackSubmitWithArrow, BlackSlimButton2 } from '@ledget/shared-ui'


export const TabView = ({ children }) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [updatePill, setUpdatePill] = useState(false)
    const tabListRef = useRef(null)
    const { month: { items: monthItems }, year: { items: yearItems } } = useContext(ItemsContext)

    useEffect(() => {
        if (monthItems.length === 0) return
        setSelectedIndex(0)
    }, [monthItems])

    useEffect(() => {
        if (yearItems.length === 0) return
        setSelectedIndex(1)
    }, [yearItems])

    const { props } = usePillAnimation({
        ref: tabListRef,
        update: [updatePill],
        refresh: [],
        querySelectall: '[role=tab]',
        styles: { backgroundColor: 'var(--green-hlight)' },
        find: (element) => {
            return element.getAttribute('data-headlessui-state') === 'selected'
        }
    })

    useEffect(() => {
        setUpdatePill(!updatePill)
    }, [selectedIndex])

    return (
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="tab-list--container" ref={tabListRef}>
                <div className="tab-list">
                    {['Month', 'Year'].map((tab, i) => (
                        <Tab key={i} as={React.Fragment}>
                            {({ selected }) => (
                                <button
                                    className="btn-2slim"
                                    style={{
                                        color: selected
                                            ? 'var(--m-text-gray)'
                                            : 'var(--input-placeholder)'
                                    }}
                                >
                                    {tab}
                                </button>
                            )}
                        </Tab>
                    ))}
                    <animated.span style={props} className="tab-list--pill" />
                </div>
            </Tab.List>
            <Tab.Panels>
                {children}
            </Tab.Panels>
        </Tab.Group>
    )
}

export const BottomButtons = () => {
    const navigate = useNavigate()
    const { itemsEmpty } = useContext(ItemsContext)
    const location = useLocation()
    const [addNewBill, { isLoading: isBillLoading, isSuccess: isBillSuccess }] = useAddnewBillMutation()
    const [addNewCategory, { isLoading: isCategoryLoading, isSuccess: isCategorySuccess }] = useAddNewCategoryMutation()
    const { data: user, refetch: refetchUser } = useGetMeQuery()
    const [updateUser, { isSuccess: patchedUserSuccess }] = useUpdateUserMutation()

    const { month: { items: monthItems }, year: { items: yearItems } } = useContext(ItemsContext)

    const handleClick = (e) => {
        e.preventDefault()
        const newMonthItems = monthItems.filter(item => !item.fetchedFromServer)
        const newYearItems = yearItems.filter(item => !item.fetchedFromServer)

        switch (location.pathname) {
            case '/welcome/add-bills':
                addNewBill({
                    data: [...newMonthItems, ...newYearItems]
                })
                break
            case '/welcome/add-categories':
                addNewCategory({
                    data: [...newMonthItems, ...newYearItems]
                })
                break
            default:
                break
        }
    }

    useEffect(() => {
        if (isBillSuccess) {
            navigate('/welcome/add-categories')
        }
    }, [isBillSuccess])

    // String of effects
    // 1) after categories added, patch user ->
    // 2) refetch user ->
    // 3) if user is onboarded, navigate to dashboard
    useEffect(() => {
        if (isCategorySuccess) {
            updateUser({
                data: { is_onboarded: true }
            })
        }
    }, [isCategorySuccess])

    useEffect(() => {
        if (patchedUserSuccess) {
            refetchUser()
        }
    }, [patchedUserSuccess])

    useEffect(() => {
        if (user?.is_onboarded) {
            navigate('/budget')
        }
    }, [user])

    return (
        <div
            className="btn-container"
        >
            <GreenCheckSubmitButton
                aria-label="Add Category"
                type="submit"
            >
                Save
            </GreenCheckSubmitButton>
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

export const RecommendationsButton = () => {
    const { setRecommendationsMode } = useContext(ItemsContext)

    return (
        <div>
            <BlackSlimButton2
                className="btn-icon-r"
                onClick={() => setRecommendationsMode(true)}
                aria-label="Recommendations"
            >
                Recommendations <RecommendationsIcon fill={'currentColor'} />
            </BlackSlimButton2>
        </div>
    )
}
