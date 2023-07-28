import React, { useState, useRef } from 'react'

import { useNavigate, useLocation } from "react-router-dom"
import { Menu } from '@headlessui/react'
import { animated } from '@react-spring/web'

import './styles/header.css'
import logoIcon from '@assets/icons/logoIcon.svg'
import Profile1 from '@assets/icons/Profile1'
import Profile2 from '@assets/icons/Profile2'
import SettingsIcon from '@assets/icons/Settings'
import HelpIcon from '@assets/icons/Help'
import LogoutIcon from '@assets/icons/LogoutIcon'
import Help from '@components/modals/Help'
import DropAnimation from '@utils/DropAnimation'
import Logout from '@components/modals/Logout'
import { usePillAnimation } from '@utils/hooks'


const Navigation = ({ isNarrow }) => {
    let tabs = [
        { name: "budget", path: "/budget" },
        { name: "accounts", path: "/accounts" },
        { name: "spending", path: "/spending" },
    ]

    const location = useLocation()
    const navigate = useNavigate()
    const navListRef = useRef()
    const tabsSpring = usePillAnimation({
        ref: navListRef,
        update: [isNarrow],
        role: 'link'
    })

    const handleTabClick = (e) => {
        e.preventDefault()
        navigate(`/${e.target.name || e.target.firstChild.name}`)
    }

    return (
        <nav id="header-nav">
            <ul ref={navListRef} role="navigation">
                {
                    tabs
                        .filter((tab) => tab.path !== "/spending")
                        .map((tab) => (
                            <li
                                key={tab.name}
                                className={`${location.pathname.split('/')[1] === tab.name ? "current-" : ""}nav-item`}
                                role="link"
                                tabIndex={0}
                                onClick={handleTabClick}
                                onKeyDown={(e) => e.key === "Enter" && handleTabClick(e)}
                            >
                                <a
                                    name={tab.name}
                                    aria-current={location.pathname === tab.path ? "page" : undefined}
                                >
                                    {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
                                </a>
                            </li>
                        ))
                }
                {isNarrow &&
                    <li
                        className={`${location.pathname === "/spending" ? "current-" : ""}nav-item`}
                        role="link"
                        tabIndex={0}
                        onClick={handleTabClick}
                        onKeyDown={(e) => e.key === "Enter" && handleTabClick(e)}
                    >
                        <a name='spending'>Spending</a>
                    </li>
                }
                {tabs.some(tab => tab.name === location.pathname.split('/')[1]) &&
                    <animated.span style={tabsSpring} />
                }
            </ul>
        </nav>
    )
}

function Header({ isNarrow }) {
    const [modal, setModal] = useState('')
    const navigate = useNavigate()
    const location = useLocation()

    const DropDownMenu = () => {

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

        return (
            <Menu>
                {({ open }) => (
                    <>
                        <Menu.Button id="profile-button">
                            <Profile1 />
                        </Menu.Button>
                        <DropAnimation visible={open}>
                            <Menu.Items static >
                                <div className="dropdown profile-dropdown">
                                    <Wrapper onClick={() => navigate("/profile")}>
                                        <Profile2 className="dropdown-icon" />
                                        Profile
                                    </Wrapper>
                                    <Wrapper onClick={() => navigate('/profile')}>
                                        <SettingsIcon className="dropdown-icon" />
                                        Settings
                                    </Wrapper>
                                    <Wrapper onClick={() => setModal("help")}>
                                        <HelpIcon className="dropdown-icon" />
                                        Help
                                    </Wrapper>
                                    <Wrapper onClick={() => setModal("logout")}>
                                        <LogoutIcon className="dropdown-icon" />
                                        Log out
                                    </Wrapper>
                                </div>
                            </Menu.Items>
                        </DropAnimation>
                    </>
                )}
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

    return (
        <>
            <header>
                <div
                    id="header-container"
                    style={{
                        zIndex: location.pathname.split('/').length <= 2 ? 1 : 0
                    }}
                >
                    <div id="header-logo">
                        <img src={logoIcon} alt="Ledget Logo" />
                    </div>
                    <div id="header-right">
                        <div>
                            <Navigation isNarrow={isNarrow} />
                        </div>
                        <div className={
                            `${isNarrow || location.pathname === '/profile'
                                ? "profile-dropdown-narrow"
                                : "profile-dropdown-wide"}`}
                        >
                            <DropDownMenu />
                        </div>
                    </div>
                </div>
            </header>
            <Modal selection={modal} />
        </>
    )
}

export default Header
