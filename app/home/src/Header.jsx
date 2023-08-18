import React, { useState, useRef, useEffect } from 'react'

import { useNavigate, useLocation } from "react-router-dom"
import { Menu } from '@headlessui/react'
import { animated } from '@react-spring/web'
import { useSearchParams } from 'react-router-dom'

import './styles/header.css'
import logoIcon from '@assets/icons/logoIcon.svg'
import Profile1 from '@assets/icons/Profile1'
import Profile2 from '@assets/icons/Profile2'
import SettingsIcon from '@assets/icons/Settings'
import HelpIcon from '@assets/icons/Help'
import LogoutIcon from '@assets/icons/LogoutIcon'
import DropAnimation from '@utils/DropAnimation'
import Logout from '@modals/Logout'
import Help from '@modals/Help'
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
        find: (element) => element.firstChild.name === location.pathname.split("/")[1]
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
        <nav id="header-nav">
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

function Header({ isNarrow }) {
    const [modal, setModal] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const [zIndex, setZindex] = useState(1000)

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

    useEffect(() => {
        if (searchParams.get('confirm') || location.pathname.includes('new')) {
            setZindex(0)
        } else {
            setZindex(1000)
        }
    }, [location.pathname, searchParams])

    return (
        <>
            <header
                style={{ zIndex: zIndex }}
            >
                <div id="header-container">
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
