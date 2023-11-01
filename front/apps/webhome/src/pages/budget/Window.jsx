import React, { useState, useEffect } from 'react'

import { Outlet } from 'react-router-dom'
import { Menu } from '@headlessui/react'
import { useNavigate, createSearchParams, useSearchParams } from 'react-router-dom'

import './styles/Window.scss'
import { Plus, Edit, Ellipsis2 } from '@ledget/media'
import { IconButton, DropAnimation } from '@ledget/ui'
import MonthPicker from '@components/inputs/MonthPicker'
import BudgetSummary from './BudgetSummary'
import SpendingCategories from './SpendingCategories'
import Bills from './Bills'


const Wrapper = ({ onClick, children }) => (
    <Menu.Item as={React.Fragment}>
        {({ active }) => (
            <button
                className={`dropdown-item
                        ${active && "active-dropdown-item"}`}
                onClick={() => onClick()}
            >
                {children}
            </button>
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
                    <Menu.Button as={React.Fragment}>
                        <IconButton><Ellipsis2 /></IconButton>
                    </Menu.Button>
                    <DropAnimation visible={open}>
                        <Menu.Items static as={React.static}>
                            <div className="dropdown dropdown-right">
                                <Wrapper>
                                    <Edit className="dropdown-icon" />
                                    Monthly budget
                                </Wrapper>
                                <Wrapper>
                                    <Edit className="dropdown-icon" />
                                    Yearly budget
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
                                    <Plus
                                        width={'1em'}
                                        height={'1em'}
                                        className="dropdown-icon"
                                    />
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
                                    <Plus
                                        width={'1em'}
                                        height={'1em'}
                                        className="dropdown-icon"
                                    />
                                    New bill
                                </Wrapper>
                            </div>
                        </Menu.Items>
                    </DropAnimation>
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

    useEffect(() => {
        // On mount set month and date to current date and month
        if (!searchParams.get('month') || !searchParams.get('year')) {
            searchParams.set('month', `${new Date().getMonth() + 1}`)
            searchParams.set('year', `${new Date().getFullYear()}`)
        }
        if (!searchParams.get('bill-sort')) {
            searchParams.set('bill-sort', 'date')
        }

        setSearchParams(searchParams)
    }, [])

    return (
        <>
            <div className="window" id="budget-window">
                <div className="window-header">
                    <MonthPicker />
                    <div className="header-btns">
                        <DropDown />
                    </div>
                </div>
                <BudgetSummary />
                <Spending />
                <Bills />
            </div>
            <Outlet />
        </>
    )
}

export default Window
