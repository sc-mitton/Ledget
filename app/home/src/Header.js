import React, { useState, useContext, useRef, useEffect } from 'react'

import { useNavigate, useLocation } from "react-router-dom"
import { Menu } from '@headlessui/react'
import { useSpring, animated } from '@react-spring/web'

import './style/header.css'
import logoIcon from './assets/svg/logoIcon.svg'
import Profile1 from './assets/svg/Profile1'
import Profile2 from './assets/svg/Profile2'
import SettingsIcon from './assets/svg/Settings'
import HelpIcon from './assets/svg/Help'
import LogoutIcon from './assets/svg/LogoutIcon'
import Help from './components/modals/Help'
import DropAnimation from './components/utils/DropAnimation'
import Logout from './components/modals/Logout'
import { UserContext } from './context/UserContext'


const Navigation = ({ isNarrow }) => {
    let tabs = [
        { name: "spending", path: "/spending" },
        { name: "accounts", path: "/accounts" },
        { name: "items", path: "/items" },
    ]

    const location = useLocation()
    const navListRef = useRef()
    const [selectedKey, setSelectedKey] = useState(
        tabs.find((tab) => tab.path === location.pathname)?.name
    )
    let [tabElements, setTabElements] = useState([]);
    const navigate = useNavigate()

    const tabsSpring = useSpring({
        position: "absolute",
        backgroundColor: "var(--button-hover-gray)",
        borderRadius: '12px',
        height: "100%",
        width: tabElements.find((tab) => tab.name === selectedKey)?.offsetWidth,
        left: tabElements.find((tab) => tab.name === selectedKey)?.offsetLeft,
        top: 0,
        config: { tension: 200, friction: 22 },
        zIndex: -1
    })

    useEffect(() => {
        let tabs = Array.from(navListRef.current.querySelectorAll("[role=link] a"))
        if (tabElements.length != tabs.length) {
            setTabElements(tabs)
        }
    }, [tabElements, isNarrow])

    useEffect(() => {
        setSelectedKey(
            tabs.find((tab) => tab.path === location.pathname)?.name
        )
    }, [location.pathname])

    const handleTabClick = (e) => {
        e.preventDefault()
        setSelectedKey(e.target.name)
        navigate(`/${e.target.name}`)
    }

    return (
        <nav id="header-nav">
            <ul ref={navListRef} role="navigation">
                {
                    tabs
                        .filter((tab) => tab.path !== "/items")
                        .map((tab) => (
                            <li
                                key={tab.name}
                                className={`${location.pathname === tab.path ? "current-" : ""}nav-item`}
                                role="link"
                                tabIndex={0}
                                onClick={handleTabClick}
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
                        className={`${location.pathname === "/items" ? "current-" : ""}nav-item`}
                        role="link"
                        tabIndex={0}
                    >
                        <a name='items' onClick={handleTabClick}>Items</a>
                    </li>
                }
                {tabs.some(tab => tab.path === location.pathname) &&
                    <animated.span style={tabsSpring} />
                }
            </ul>
        </nav>
    )
}

function Header({ isNarrow }) {
    const [modal, setModal] = useState('')
    const navigate = useNavigate()

    const DropDownMenu = () => {
        const { getLogoutFlow } = useContext(UserContext)

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
                            <Menu.Items
                                as="div"
                                className="dropdown profile-dropdown"
                                static
                            >
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
                                <Wrapper onClick={() => getLogoutFlow() && setModal("logout")}>
                                    <LogoutIcon className="dropdown-icon" />
                                    Logout
                                </Wrapper>
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
