import React, { useContext, useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { animated } from '@react-spring/web'
import { Tab } from '@headlessui/react'

import { ShadowedContainer } from '@components/pieces'
import { ItemsContext } from './context'
import Arrow from '@assets/icons/Arrow'
import Checkmark from '@assets/icons/Checkmark'
import { useItemsDrag } from './hooks'
import { usePillAnimation } from '@utils/hooks'
import Bell from '@assets/icons/Bell'
import BellOff from '@assets/icons/BellOff'
import Delete from '@assets/icons/Delete'
import Grip from '@assets/icons/Grip'


const ItemsColumn = ({ period }) => {
    let categories, setCategories, flexBasis, transitions, api, containerProps
    const context = useContext(ItemsContext)

    if (period === 'month') {
        categories = context.monthItems
        setCategories = context.setMonthItems
        flexBasis = context.monthFlexBasis
        transitions = context.monthTransitions
        api = context.monthApi
        containerProps = context.monthContainerProps
    } else {
        categories = context.yearItems
        setCategories = context.setYearItems
        flexBasis = context.yearFlexBasis
        transitions = context.yearTransitions
        api = context.yearApi
        containerProps = context.yearContainerProps
    }
    const bind = useItemsDrag(categories, setCategories, api)


    const handleDelete = (toDelete) => {
        setCategories(categories.filter((category) => category !== toDelete))
    }

    const formatName = (name) => (
        name.split(' ').map((word) => {
            name.charAt(0).toUpperCase() + name.slice(1)
            return word.charAt(0).toUpperCase() + word.slice(1)
        }).join(' ')
    )

    return (
        <ShadowedContainer style={{ height: 'auto' }}>
            <animated.div style={containerProps} >
                {transitions((style, item, index) =>
                    <animated.div
                        className="budget-item"
                        style={style}
                        {...bind(item)}
                    >
                        <div
                            className="budget-item-name--container"
                            style={{ flexBasis: flexBasis }}
                        >
                            <button
                                className="btn grip-btn"
                                aria-label="Move"
                                draggable-item="true"
                            >
                                <Grip />
                            </button>
                            <div className="budget-item-name">
                                <span>{item.emoji}</span>
                                <span>{formatName(item.name)}</span>
                            </div>
                        </div>
                        <div >
                            {`$${item.limit_amount / 100}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </div >
                        <div >
                            <div style={{ opacity: item.alerts.length > 0 ? '1' : '.5' }}>
                                {item.alerts.length > 0
                                    ? <Bell numberOfAlerts={item.alerts.length} />
                                    : <BellOff />}
                            </div>
                        </div>
                        <div>
                            <button
                                className={`btn delete-button-show`}
                                aria-label="Remove"
                                onClick={() => handleDelete(item)}
                            >
                                <Delete width={'1.1em'} height={'1.1em'} />
                            </button>
                        </div>
                    </animated.div>
                )}
            </animated.div>
        </ShadowedContainer>
    )
}

const TabView = () => {
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
                                            : 'var(--input-placeholder2)'
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
                <Tab.Panel>
                    <ItemsColumn period={'month'} />
                </Tab.Panel>
                <Tab.Panel>
                    <ItemsColumn period={'year'} />
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    )
}

const ColumnView = () => {

    return (
        <>
            <div>
                <h4 className="spaced-header2">Month</h4>
                <ItemsColumn period={'month'} />
            </div>
            <div>
                <h4 className="spaced-header2">Year</h4>
                <ItemsColumn period={'year'} />
            </div>
        </>
    )
}

export const ItemsList = () => {
    const [tabView, setTabView] = useState(true)
    const { itemsEmpty } = useContext(ItemsContext)

    const handleResize = () => {
        if (window.innerWidth < 768) {
            setTabView(true)
        } else {
            setTabView(false)
        }
    }

    // When window gets smaller than 768px, switch to tab view
    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div
            id="budget-items--container"
            className={`${itemsEmpty ? '' : 'expand'}`}
        >
            {!itemsEmpty &&
                <>
                    {tabView ? <TabView /> : <ColumnView />}
                </>
            }
        </div>
    )
}

export const BottomButtons = () => {
    const navigate = useNavigate()
    const { itemsEmpty } = useContext(ItemsContext)

    return (
        <div
            className='btn-container-enabled'
        >
            <button
                className="btn-grn btn3"
                id="connect-account-btn"
                aria-label="Add Category"
                type="submit"
            >
                <span>Save Category</span>
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
                Continue
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

