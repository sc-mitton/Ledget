import React from 'react'
import { useState } from 'react'

import { useNavigate, useLocation } from "react-router-dom"
import { Menu } from '@headlessui/react'

import logo from './assets/svg/logo.svg'
import Profile1 from './assets/svg/Profile1'
import Profile2 from './assets/svg/Profile2'
import SettingsIcon from './assets/svg/Settings'
import HelpIcon from './assets/svg/Help'
import Help from './components/modals/Help'
import Account from './components/modals/Account'
import './style/header.css'


function Header({ isNarrow }) {
    const [modal, setModal] = useState('')
    const navigate = useNavigate()

    const DropDownMenu = () => {
        return (
            <Menu>
                <Menu.Button id="profile-button" >
                    <Profile1 />
                </Menu.Button>
                <Menu.Items>
                    <div className="dropdown profile-dropdown">
                        <Menu.Item>
                            <button
                                className="dropdown-item"
                                onClick={() => setModal("account")}
                            >
                                <Profile2 className="dropdown-icon" />
                                Account
                            </button>
                        </Menu.Item>
                        <Menu.Item>
                            <button
                                className="dropdown-item"
                                onClick={() => navigate("/settings")}
                            >
                                <SettingsIcon className="dropdown-icon" />
                                Settings
                            </button>
                        </Menu.Item>
                        <Menu.Item>
                            <button
                                className="dropdown-item"
                                onClick={() => setModal("help")}
                            >
                                <HelpIcon className="dropdown-icon" />
                                Help
                            </button>
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Menu >
        )
    }

    const Navigation = () => {
        const location = useLocation()

        return (
            <nav>
                <ul className="navigation">
                    <li className={`${location.pathname === "/spending" ? "current-" : ""}nav-item`}>
                        <button
                            onClick={() => navigate("/spending")}
                        >
                            Spending
                        </button>
                    </li>
                    <li className={`${location.pathname === "/accounts" ? "current-" : ""}nav-item`}>
                        <button
                            onClick={() => navigate("/accounts")}
                        >
                            Accounts
                        </button>
                    </li>
                    {isNarrow && <li className={`${location.pathname === "/items" ? "current-" : ""}nav-item`}>
                        <button
                            onClick={() => navigate("/items")}
                        >
                            Items
                        </button>
                    </li>
                    }
                </ul>
            </nav>
        )
    }

    return (
        <>
            <header>
                <div id="header-container">
                    <div id="header-logo">
                        <img src={logo} alt="Ledget Logo" />
                    </div>
                    <div id="header-profile">
                        <Navigation />
                        <DropDownMenu />
                    </div>
                </div>
            </header>
            {modal === 'account' && <Account cleanUp={() => setModal('')} maxWidth={'340px'} />}
            {modal === 'help' && <Help cleanUp={() => setModal('')} />}
        </>
    )
}

export default Header
