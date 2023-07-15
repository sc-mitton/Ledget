import React, { useState, useRef, useEffect } from 'react'

import { useNavigate, useLocation } from "react-router-dom"
import { Menu } from '@headlessui/react'

import logoIcon from './assets/svg/logoIcon.svg'
import Profile1 from './assets/svg/Profile1'
import Profile2 from './assets/svg/Profile2'
import SettingsIcon from './assets/svg/Settings'
import HelpIcon from './assets/svg/Help'
import Logout from './assets/svg/Logout'
import Help from './components/modals/Help'
import Account from './components/modals/Account'
import DropAnimation from './components/utils/DropAnimation'
import './style/header.css'

function Header({ isNarrow }) {
    const [modal, setModal] = useState('')
    const navigate = useNavigate()

    const DropDownMenu = () => {
        const [open, setOpen] = useState(false)
        const menuRef = useRef()
        const buttonRef = useRef()

        // Close dropdown when clicking outside
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (menuRef.current && !menuRef.current.contains(event.target)
                    && buttonRef.current && !buttonRef.current.contains(event.target)) {
                    setOpen(false)
                }
            }
            window.addEventListener("mousedown", handleClickOutside)
            return () => {
                window.removeEventListener("mousedown", handleClickOutside)
            }
        }, [open])

        return (
            <Menu>
                <Menu.Button
                    id="profile-button"
                    onClick={() => setOpen(!open)}
                    ref={buttonRef}
                >
                    <Profile1 />
                </Menu.Button>
                <Menu.Items static ref={menuRef}>
                    <DropAnimation visible={open} className="dropdown profile-dropdown">
                        <Menu.Item>
                            <button
                                className="dropdown-item"
                                onClick={() => setModal("account")}
                            >
                                <Profile2
                                    className="dropdown-icon"
                                    fill={'var(--main-text-gray)'}
                                    stroke={'var(--main-text-gray)'}
                                />
                                Account
                            </button>
                        </Menu.Item>
                        <Menu.Item>
                            <button
                                className="dropdown-item"
                                onClick={() => navigate("/settings")}
                            >
                                <SettingsIcon
                                    className="dropdown-icon"
                                    fill={'var(--main-text-gray)'}
                                    stroke={'var(--main-text-gray)'}
                                />
                                Settings
                            </button>
                        </Menu.Item>
                        <Menu.Item>
                            <button
                                className="dropdown-item"
                                onClick={() => setModal("help")}
                            >
                                <HelpIcon
                                    className="dropdown-icon"
                                    fill={'var(--main-text-gray)'}
                                    stroke={'var(--main-text-gray)'}
                                />
                                Help
                            </button>
                        </Menu.Item>
                        <Menu.Item>
                            <button
                                className="dropdown-item"
                                onClick={() => navigate("/logout")}
                            >
                                <Logout
                                    className="dropdown-icon"
                                    fill={'var(--main-text-gray)'}
                                    stroke={'var(--main-text-gray)'}
                                />
                                Logout
                            </button>
                        </Menu.Item>
                    </DropAnimation>
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
                        <img src={logoIcon} alt="Ledget Logo" />
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
