import React, { useState, useRef, useEffect, useContext } from 'react'

import { useNavigate, useLocation } from "react-router-dom"
import { Menu } from '@headlessui/react'

import logoIcon from './assets/svg/logoIcon.svg'
import Profile1 from './assets/svg/Profile1'
import Profile2 from './assets/svg/Profile2'
import SettingsIcon from './assets/svg/Settings'
import HelpIcon from './assets/svg/Help'
import LogoutIcon from './assets/svg/LogoutIcon'
import Help from './components/modals/Help'
import Account from './components/modals/Account'
import DropAnimation from './components/utils/DropAnimation'
import Logout from './components/modals/Logout'
import { UserContext } from './context/UserContext'
import './style/header.css'

function Header({ isNarrow }) {
    const [modal, setModal] = useState('')
    const navigate = useNavigate()

    const DropDownMenu = () => {
        const [open, setOpen] = useState(false)
        const [menuFocused, setMenuFocused] = useState(false)
        const menuRef = useRef()
        const buttonRef = useRef()
        const { getLogoutFlow } = useContext(UserContext)

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
                <Menu.Items ref={menuRef} static>
                    <DropAnimation visible={open} className="dropdown profile-dropdown">
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
                        <Menu.Item>
                            <button
                                className="dropdown-item"
                                onClick={() => getLogoutFlow() && setModal("logout")}
                            >
                                <LogoutIcon className="dropdown-icon" />
                                Logout
                            </button>
                        </Menu.Item>
                    </DropAnimation>
                </Menu.Items>
            </Menu >
        )
    }

    const Modal = ({ selection }) => {
        switch (selection) {
            case "help":
                return (
                    <Help cleanUp={() => setModal('')} />
                )
            case "account":
                return (
                    <Account cleanUp={() => setModal('')} />
                )
            case "logout":
                return (
                    <Logout
                        cleanUp={() => setModal('')}
                        maxWidth={"300px"}
                        hasExit={false}
                    />
                )
            default:
                return null
        }
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
            <Modal selection={modal} />
        </>
    )
}

export default Header
