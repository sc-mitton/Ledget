import React, { useState, useContext, useRef, useEffect } from 'react'

import { useNavigate, useLocation } from "react-router-dom"
import { Menu } from '@headlessui/react'
import { useSpring, animated } from '@react-spring/web'

import './styles/header.css'
import logoIcon from '../assets/svg/logoIcon.svg'
import Profile1 from '../assets/svg/Profile1'
import Profile2 from '../assets/svg/Profile2'
import SettingsIcon from '../assets/svg/Settings'
import HelpIcon from '../assets/svg/Help'
import LogoutIcon from '../assets/svg/LogoutIcon'
import Help from '../components/modals/Help'
import DropAnimation from '../components/utils/DropAnimation'
import Logout from '../components/modals/Logout'
import { UserContext } from '../context/UserContext'


const useAnimation = (update) => {
    const [tabElements, setTabElements] = useState([])
    const [tabElement, setTabElement] = useState()
    const navListRef = useRef()

    const tabsSpring = useSpring({
        position: "absolute",
        backgroundColor: "var(--button-hover-gray)",
        borderRadius: '12px',
        height: "100%",
        width: tabElement?.offsetWidth || 0,
        left: tabElement?.offsetLeft,
        top: 0,
        zIndex: -1,
        config: { tension: 200, friction: 22 },
    })

    useEffect(() => {
        if (tabElements.length > 0) {
            const element = tabElements.find(
                (element) => element.firstChild.name === location.pathname.split("/")[1]
            )
            setTabElement(element)
        }
    }, [tabElements, location.pathname])

    useEffect(() => {
        setTimeout(() => {
            const elements = Array.from(
                navListRef.current.querySelectorAll("[role=link]")
            )
            setTabElements(elements)
        }, 0)
    }, [update])

    return {
        tabsSpring,
        navListRef,
    }
}


const Navigation = ({ isNarrow }) => {
    let tabs = [
        { name: "spending", path: "/spending" },
        { name: "accounts", path: "/accounts" },
        { name: "items", path: "/items" },
    ]

    const location = useLocation()
    const navigate = useNavigate()
    const { tabsSpring, navListRef } = useAnimation(isNarrow)

    const handleTabClick = (e) => {
        e.preventDefault()
        navigate(`/${e.target.name || e.target.firstChild.name}`)
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
                        className={`${location.pathname === "/items" ? "current-" : ""}nav-item`}
                        role="link"
                        tabIndex={0}
                        onClick={handleTabClick}
                        onKeyDown={(e) => e.key === "Enter" && handleTabClick(e)}
                    >
                        <a name='items'>Items</a>
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
