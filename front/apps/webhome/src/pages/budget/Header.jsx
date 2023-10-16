import React from 'react'

import { Menu } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'

import { Graph, Plus, Edit, Ellipsis2 } from '@ledget/media'
import MonthPicker from '@components/inputs/MonthPicker'
import { IconButton, DropAnimation } from '@ledget/ui'

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
                                    onClick={() => navigate('/budget/new-category')}
                                >
                                    <Plus
                                        width={'1em'}
                                        height={'1em'}
                                        className="dropdown-icon"
                                    />
                                    New category
                                </Wrapper>
                                <Wrapper
                                    onClick={() => navigate('/budget/new-bill')}
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

export default Header
