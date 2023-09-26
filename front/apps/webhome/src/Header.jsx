import React, { useState, useRef, useEffect } from 'react'

import { useNavigate, useLocation } from "react-router-dom"
import { Menu } from '@headlessui/react'
import { animated } from '@react-spring/web'
import { useSearchParams } from 'react-router-dom'

import './styles/header.css'
import { Logout, Help } from '@modals'
import {
    Profile1,
    Profile2,
    Settings as SettingsIcon,
    Help as HelpIcon,
    LogoutIcon,
    LedgetLogoIcon
} from '@ledget/shared-assets'
import { DropAnimation } from '@ledget/shared-ui'
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
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const [zIndex, setZindex] = useState(1000)

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

    useEffect(() => {
        if (searchParams.get('confirm') ||
            ['new', 'create', 'edit', 'change', 'update', 'cancel', 'delete', 'add', 'authenticator-setup', 'recovery-codes'].some(
                (word) => location.pathname.includes(word)
            )
        ) {
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
                <div className="header-container">
                    <div className="header-logo"><LedgetLogoIcon /></div>
                    <div className="header-right">
                        <div>
                            <Navigation isNarrow={isNarrow} />
                        </div>
                        <DropDownMenu setModal={setModal} isNarrow={isNarrow} />
                    </div>
                </div>
            </header>
            <Modal selection={modal} />
        </>
    )
}


export default Header
