import React, { useContext, useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { animated } from '@react-spring/web'
import { Tab } from '@headlessui/react'
import { useLocation } from 'react-router-dom'

import { ItemsContext } from './ItemsContext'
import Arrow from '@assets/icons/Arrow'
import { SubmitButton } from '@components/buttons'
import Checkmark from '@assets/icons/Checkmark'
import RecommendationsIcon from '@assets/icons/Recommendations'
import { usePillAnimation } from '@utils/hooks'
import { useAddnewBillMutation } from '@features/billSlice'
import { useAddNewCategoryMutation } from '@features/categorySlice'
import { useUpdateUserMutation } from '@features/userSlice'


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

export const BottomButtons = ({ expanded }) => {
    const navigate = useNavigate()
    const { itemsEmpty } = useContext(ItemsContext)
    const location = useLocation()
    const [addNewBill, { isLoading: isBillLoading, isSuccess: isBillSuccess }] = useAddnewBillMutation()
    const [addNewCategory, { isLoading: isCategoryLoading, isSuccess: isCategorySuccess }] = useAddNewCategoryMutation()
    const [updateUser] = useUpdateUserMutation()

    const { month: { items: monthItems }, year: { items: yearItems } } = useContext(ItemsContext)

    const handleClick = (e) => {
        e.preventDefault()
        switch (location.pathname) {
            case '/welcome/add-bills':
                addNewBill({
                    data: [...monthItems, ...yearItems]
                })
                break
            case '/welcome/add-categories':
                addNewCategory({
                    data: [...monthItems, ...yearItems]
                })
                break
            default:
                break
        }
    }

    useEffect(() => {
        if (isBillSuccess) {
            navigate('/budget')
        }
    }, [isBillSuccess])

    useEffect(() => {
        if (isCategorySuccess) {
            updateUser({ data: { is_onboarded: true } })
            navigate('/welcome/add-bills')
        }
    }, [isCategorySuccess])

    return (
        <div
            className={`btn-container ${expanded ? 'expanded' : ''}`}
        >
            <button
                className="btn-grn btn3 scale-icon-btn"
                style={{ visibility: expanded ? 'visible' : 'hidden' }}
                disabled={!expanded}
                aria-label="Add Category"
                type="submit"
            >
                <span>Save</span>
                <Checkmark width={'.8em'} height={'.8em'} />
            </button>
            <SubmitButton
                className={`btn-chcl btn3 scale-icon-btn
                ${isBillLoading || isCategoryLoading ? 'preoccupied' : ''}`}
                style={{
                    visibility: itemsEmpty ? 'hidden' : 'visible'
                }}
                aria-label="Next"
                onClick={handleClick}
                disabled={itemsEmpty}
                submitting={isBillLoading || isCategoryLoading}
                type="button"
            >
                {location.pathname === '/welcome/add-bills' ? 'Next' : 'Finish'}
                <Arrow
                    width={'.8em'}
                    height={'.8em'}
                    rotation={-90}
                    stroke={'var(--window)'}
                />
            </SubmitButton>
        </div>
    )
}

export const RecommendationsButton = () => {
    const { setRecommendationsMode } = useContext(ItemsContext)

    return (
        <div>
            <button
                className="btn-clr btn-2slim btn-icon-r"
                onClick={() => setRecommendationsMode(true)}
                aria-label="Recommendations"
            >
                Recommendations <RecommendationsIcon fill={'m-text-gray'} />
            </button>
        </div>
    )
}
