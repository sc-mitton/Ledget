import React, { useState, useEffect } from 'react'

import { Outlet } from 'react-router-dom'
import { Menu } from '@headlessui/react'
import { useNavigate, useLocation, createSearchParams, useSearchParams } from 'react-router-dom'

import './styles/Window.css'
import './styles/Budget.scss'
import { Graph, Plus, Edit, Ellipsis2 } from '@ledget/media'
import { IconButton, DropAnimation } from '@ledget/ui'
import MonthPicker from '@components/inputs/MonthPicker'
import { ShadowedContainer } from '@components/pieces'
import TabView from './TabView'
import ColumnarView from './ColumnarView'


const Wrapper = ({ onClick, children }) => {

    return (
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
}

const DropDown = () => {
    const navigate = useNavigate()
    const location = useLocation()
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

const Header = () => {

    return (
        <div className="window-header">
            <MonthPicker />
            <div className="header-btns">
                <IconButton
                    aria-label="Toggle graph view"
                    style={{
                        margin: "0 0.5em"
                    }}
                >
                    <Graph />
                </IconButton>
                <DropDown />
            </div>
        </div>
    )
}


const Budget = () => {
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
        <ShadowedContainer style={{ display: 'flex' }}>
            <div id="budget--container" >
                {tabView ? <TabView /> : <ColumnarView />}
            </div>
        </ShadowedContainer>
    )
}

function Window() {
    return (
        <>
            <div className="window" id="budget-window">
                <Header />
                <Budget />
            </div>
            <Outlet />
        </>
    )
}

export default Window
