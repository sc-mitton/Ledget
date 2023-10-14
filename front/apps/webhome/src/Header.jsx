import React, { useState, useRef, useEffect } from 'react'

import { useNavigate, useLocation } from "react-router-dom"
import { Menu } from '@headlessui/react'
import { animated } from '@react-spring/web'

import './styles/header.css'
import { Logout, Help } from '@modals'
import {
    Profile1,
    Profile2,
    Settings as SettingsIcon,
    Help as HelpIcon,
    LogoutIcon,
    LedgetLogoIcon
} from '@ledget/assets'
import { DropAnimation } from '@ledget/ui'
import { usePillAnimation } from '@utils/hooks'


const Navigation = ({ isNarrow }) => {
    let tabs = [
        { name: "budget", path: "/budget" },
        { name: "accounts", path: "/accounts" }
    ]

    const location = useLocation()
    const navigate = useNavigate()
    const navListRef = useRef()
    const { props: tabsSpring } = usePillAnimation({
        ref: navListRef,
        update: [location.pathname],
        refresh: [isNarrow],
        querySelectall: '[role=link]',
        find: (element) => element.firstChild.name === location.pathname.split("/")[1],
        styles: { borderRadius: 'var(--border-radius3)' },
    })

    const [showPill, setShowPill] = useState()

    const handleTabClick = (e) => {
        e.preventDefault()
        navigate(`/${e.target.name || e.target.firstChild.name}`)
    }

    useEffect(() => {
        const rootPath = location.pathname.split("/")[1]
        if (!['budget', 'accounts', 'spending'].includes(rootPath)) {
            setShowPill(false)
        } else {
            setShowPill(true)
        }
    }, [location.pathname])

    return (
        <nav className="header-nav">
            <ul ref={navListRef} role="navigation">
                {tabs.map((tab) => (
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
                ))}
                {isNarrow &&
                    <li
                        className={`${location.pathname === "/spending" ? "current-" : ""}nav-item`}
                        role="link"
                        tabIndex={0}
                        onClick={handleTabClick}
                        onKeyDown={(e) => e.key === "Enter" && handleTabClick(e)}
                    >
                        <a
                            name='spending'
                            aria-current={location.pathname === "spending" ? "page" : undefined}
                        >
                            Spending
                        </a>
                    </li>
                }
                {showPill && <animated.span style={tabsSpring} />}
            </ul>
        </nav>
    )
}

const DropDownMenu = ({ isNarrow, setModal }) => {
    const navigate = useNavigate()
    const location = useLocation()

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
                <div style={{ position: 'relative' }}>
                    <Menu.Button className="profile-button">
                        <Profile1 />
                    </Menu.Button>
                    <DropAnimation
                        className={
                            `dropdown profile-dropdown
                            ${isNarrow || location.pathname === '/profile'
                                ? "narrow" : "wide"}`
                        }
                        visible={open}
                    >
                        <Menu.Items static>
                            <Wrapper onClick={() => navigate("/profile/details")}>
                                <Profile2 className="dropdown-icon" />
                                Profile
                            </Wrapper>
                            <Wrapper onClick={() => navigate('/profile/settings')}>
                                <SettingsIcon className="dropdown-icon" />
                                Settings
                            </Wrapper>
                            <Wrapper onClick={() => setModal("help")}>
                                <HelpIcon className="dropdown-icon" />
                                Help
                            </Wrapper>
                            <Wrapper onClick={() => setModal("logout")}>
                                <LogoutIcon className="dropdown-icon" id="logout-icon" />
                                Log out
                            </Wrapper>
                        </Menu.Items>
                    </DropAnimation>
                </div>
            )}
        </Menu >
    )
}

function Header({ isNarrow }) {
    const [modal, setModal] = useState('')

    const Modal = ({ selection }) => {
        switch (selection) {
            case "help":
                return (
                    <Help onClose={() => setModal('')} />
                )
            case "account":
                return (
                    <Account onClose={() => setModal('')} />
                )
            case "logout":
                return (
                    <Logout onClose={() => setModal('')} maxWidth={"300px"} hasExit={false} />
                )
            default:
                return null
        }
    }

    return (
        <>
            <header style={{ zIndex: 1000 }}>
                <div className={`header-container ${isNarrow ? 'narrow' : ''}`}>
                    <div className="header-logo"><LedgetLogoIcon /></div>
                    <div>
                        <Navigation isNarrow={isNarrow} />
                    </div>
                    <div className="header-right">
                        <DropDownMenu setModal={setModal} isNarrow={isNarrow} />
                    </div>
                </div>
            </header>
            <Modal selection={modal} />
        </>
    )
}


export default Header
