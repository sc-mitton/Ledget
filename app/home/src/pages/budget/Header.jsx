import React from 'react'

import { Menu } from '@headlessui/react'

import CashFlow from '@assets/svg/CashFlow'
import Graph from '@assets/svg/Graph'
import Plus from '@assets/svg/Plus'
import Edit from '@assets/svg/Edit'
import Ellipsis2 from '@assets/svg/Ellipsis2'
import MonthPicker from '@components/inputs/MonthPicker'
import DropAnimation from '@utils/DropAnimation'

const Wrapper = ({ onClick, children }) => {

    return (
        <Menu.Item as={React.Fragment}>
            {({ active }) => (
                <button
                    className={`dropdown-item ${active && "active-dropdown-item"}`}
                    onClick={() => onClick()}
                >
                    {children}
                </button>
            )}
        </Menu.Item>
    )
}

const DropDown = () => {

    return (
        <Menu>
            {({ open }) => (
                <>
                    <Menu.Button className={'icon'}>
                        <Ellipsis2 />
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
                                <Wrapper>
                                    <Plus
                                        width={'1em'}
                                        height={'1em'}
                                        className="dropdown-icon"
                                    />
                                    New category
                                </Wrapper>
                                <Wrapper>
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
            <div className="window-header-buttons">
                <button
                    className="icon"
                    aria-label="Toggle cash flow view"
                >
                    <CashFlow />
                </button>
                <button
                    className="icon"
                    aria-label="Toggle graph view"
                    style={{
                        margin: "0 0.5em"
                    }}
                >
                    <Graph />
                </button>
                <DropDown />
            </div>
        </div>
    )
}

export default Header
