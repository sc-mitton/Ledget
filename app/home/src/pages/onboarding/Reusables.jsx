import React, { useContext, useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { animated } from '@react-spring/web'
import { Tab } from '@headlessui/react'
import { useLocation } from 'react-router-dom'

import { ItemsContext } from './ItemsContext'
import Arrow from '@assets/icons/Arrow'
import { SubmitButton } from '@components/buttons'
import Checkmark from '@assets/icons/Checkmark'
import { usePillAnimation } from '@utils/hooks'
import { useAddNewCategoryMutation, useAddnewBillMutation } from '@features/budgetSlice'


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

    const { month: { items: monthItems }, year: { items: yearItems } } = useContext(ItemsContext)

    const handleClick = () => {
        switch (location.pathname) {
            case '/welcome/add-bills':
                addNewBill([...monthItems, ...yearItems])
                break
            case '/welcome/add-categories':
                addNewCategory([...monthItems, ...yearItems])
                break
            case '/welcome/connect':
                navigate('/welcome/add-bills')
                break
            default:
                break
        }
    }

    useEffect(() => {
        isBillSuccess && navigate('/budget')
    }, [isBillSuccess])

    useEffect(() => {
        isCategorySuccess && navigate('/welcome/add-bills')
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
            >
                {location.pathname === '/welcome/add-bills' ? 'Finish' : 'Next'}
                <Arrow
                    width={'.8em'}
                    height={'.8em'}
                    rotation={-90}
                    stroke={'var(--window)'}
                    onClick={() => navigate('/welcome/add-bills')}
                />
            </SubmitButton>
        </div>
    )
}

