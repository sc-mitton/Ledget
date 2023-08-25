import React, { useContext, useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { animated } from '@react-spring/web'
import { Tab } from '@headlessui/react'
import { useLocation } from 'react-router-dom'

import { ItemsContext } from './context'
import Arrow from '@assets/icons/Arrow'
import Checkmark from '@assets/icons/Checkmark'
import { usePillAnimation } from '@utils/hooks'


export const TabView = ({ children }) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [updatePill, setUpdatePill] = useState(false)
    const tabListRef = useRef(null)

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

    return (
        <div
            className={`btn-container ${expanded ? 'expanded' : ''}`}
        >
            <button
                className="btn-grn btn3"
                style={{ visibility: expanded ? 'visible' : 'hidden' }}
                disabled={!expanded}
                id="connect-account-btn"
                aria-label="Add Category"
                type="submit"
            >
                <span>Save</span>
                <Checkmark width={'.8em'} height={'.8em'} />
            </button>
            <button
                className="btn-chcl btn3"
                style={{ visibility: itemsEmpty ? 'hidden' : 'visible' }}
                id="connect-account-btn"
                aria-label="Next"
                onClick={() => navigate('/welcome/add-bills')}
                disabled={itemsEmpty}
            >
                {location.pathname === '/welcome/add-bills' ? 'Finish' : 'Next'}
                <Arrow
                    width={'.8em'}
                    height={'.8em'}
                    rotation={-90}
                    stroke={'var(--window)'}
                    onClick={() => navigate('/welcome/add-bills')}
                />
            </button>
        </div>
    )
}

