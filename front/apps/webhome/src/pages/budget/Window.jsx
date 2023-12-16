import React, { useState, useEffect } from 'react'

import { Outlet } from 'react-router-dom'
import { Menu } from '@headlessui/react'
import { useNavigate, createSearchParams, useSearchParams, useLocation } from 'react-router-dom'

import './styles/Window.scss'
import { Plus, Edit, Ellipsis } from '@ledget/media'
import { IconButton, DropAnimation } from '@ledget/ui'
import MonthPicker from '@components/inputs/MonthPicker'
import BudgetSummary from './BudgetSummary'
import SpendingCategories from './SpendingCategories'
import Bills from './Bills'


const Wrapper = ({ onClick, children }) => (
    <Menu.Item as={React.Fragment}>
        {({ active }) => (
            <DropdownItem
                active={active}
                onClick={() => onClick()}
            >
                {children}
            </DropdownItem>
        )}
    </Menu.Item>
)

const DropDown = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    return (
        <Menu>
            {({ open }) => (
                <>
                    <Menu.Button as={IconButton}><Ellipsis rotate={90} size={'1.25em'} /></Menu.Button>
                    <div style={{ position: 'relative' }}>
                        <DropAnimation
                            placement='right'
                            visible={open} className="dropdown arrow-right right2"
                        >
                            <Menu.Items static>
                                <Wrapper
                                    onClick={() => navigate({
                                        pathname: '/budget/edit-categories',
                                        search: createSearchParams({
                                            month: searchParams.get('month'),
                                            year: searchParams.get('year')
                                        }).toString()
                                    })}
                                >
                                    <Edit size={'.9em'} />
                                    Categories
                                </Wrapper>
                                <Wrapper
                                    onClick={() => navigate({
                                        pathname: `/budget/new-category`,
                                        search: createSearchParams({
                                            month: searchParams.get('month'),
                                            year: searchParams.get('year')
                                        }).toString()
                                    })}
                                >
                                    <Plus size={'.9em'} />
                                    New category
                                </Wrapper>
                                <Wrapper
                                    onClick={() => navigate({
                                        pathname: `/budget/new-bill`,
                                        search: createSearchParams({
                                            month: searchParams.get('month'),
                                            year: searchParams.get('year')
                                        }).toString()
                                    })}
                                >
                                    <Plus size={'.9em'} />
                                    New bill
                                </Wrapper>
                            </Menu.Items>
                        </DropAnimation>
                    </div>
                </>
            )}
        </Menu >
    )
}

const Spending = () => {
    const [tabView, setTabView] = useState(false)

    useEffect(() => {
        const updateViewMode = () => {
            if (window.innerWidth < 700)
                setTabView(true)
            else
                setTabView(false)
        }
        updateViewMode()
        window.addEventListener('resize', updateViewMode)
        return () => {
            window.removeEventListener('resize', updateViewMode)
        }
    }, [])

    return (
        <SpendingCategories tabView={tabView} />
    )
}

function Window() {
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()

    useEffect(() => {
        // On mount set month and date to current date and month
        if (!searchParams.get('month') || !searchParams.get('year')) {
            const year = sessionStorage.getItem(`${location.pathname}-year`) || new Date().getFullYear()
            const month = sessionStorage.getItem(`${location.pathname}-month`) || new Date().getMonth() + 1

            searchParams.set('month', `${month}`)
            searchParams.set('year', `${year}`)
        }

        setSearchParams(searchParams)
    }, [])

    // Update session store month and year when pathnames change
    useEffect(() => {
        const year = searchParams.get('year')
        const month = searchParams.get('month')
        sessionStorage.setItem(`${location.pathname}-month`, `${month}`)
        sessionStorage.setItem(`${location.pathname}-year`, `${year}`)
    }, [searchParams.get('year'), searchParams.get('month')])

    return (
        <>
            <div id="budget-window">
                <div>
                    <div className="window-header">
                        <MonthPicker />
                        <div className="header-btns">
                            <DropDown />
                        </div>
                    </div>
                    <BudgetSummary />
                </div>
                <Spending />
                <Bills />
            </div>
            <Outlet />
        </>
    )
}

export default Window
