import React, { useState, useRef, useEffect } from 'react'

import { useNavigate, useLocation } from "react-router-dom"
import { Menu } from '@headlessui/react'
import { animated } from '@react-spring/web'

import './styles/header.scss'
import { Logout, Help } from '@modals/index'
import {
    Profile1,
    Profile2,
    Settings as SettingsIcon,
    Help as HelpIcon,
    LogoutIcon,
    LedgetLogoIcon
} from '@ledget/media'
import { DropAnimation, usePillAnimation } from '@ledget/ui'


const Navigation = ({ isNarrow }: { isNarrow: boolean }) => {
    const tabs = [
        { name: "budget", path: "budget" },
        { name: "accounts", path: "accounts/deposits" }
    ]

    const location = useLocation()
    const navigate = useNavigate()
    const navListRef = useRef<HTMLUListElement>(null)
    const { props: tabsSpring } = usePillAnimation({
        ref: navListRef,
        update: [location.pathname],
        refresh: [isNarrow],
        querySelectall: '[role=link]',
        find: (element) => {
            return (element.firstChild as any)?.getAttribute('aria-current') === 'page'
        },
        styles: {
            borderRadius: 'var(--border-radius3)',
            backgroundColor: 'var(--header-pill)'
        },
    })

    const [showPill, setShowPill] = useState<boolean>(false)

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
                        onClick={() => navigate(tab.path)}
                        onKeyDown={(e) => { if (e.key === "Enter") { navigate(tab.path) } }}
                    >
                        <a
                            onClick={(e) => {
                                e.preventDefault()
                                navigate(tab.path)
                            }}
                            aria-current={location.pathname.split('/')[1] === tab.name ? "page" : undefined}
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
                        onClick={() => navigate("/spending")}
                        onKeyDown={(e) => { if (e.key === "Enter") { navigate("/spending") } }}
                    >
                        <a
                            onClick={(e) => {
                                e.preventDefault()
                                navigate("/spending")
                            }}
                            aria-current={location.pathname.split('/')[1] === "spending" ? "page" : undefined}
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

type Modal = "help" | "logout"

const DropDownMenu = ({ isNarrow, setModal }:
    { isNarrow: boolean, setModal: React.Dispatch<React.SetStateAction<Modal | undefined>> }) => {
    const navigate = useNavigate()

    const Wrapper = ({ onClick, children }:
        { onClick: React.MouseEventHandler<HTMLButtonElement>, children: React.ReactNode }) => {

        return (
            <Menu.Item as={React.Fragment}>
                {({ active }) => (
                    <button
                        className={`dropdown-item ${active && "active-dropdown-item"}`}
                        onClick={(e) => onClick(e)}
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
                        <Profile1 fill={'var(--m-invert-text'} />
                    </Menu.Button>
                    <DropAnimation
                        placement='right'
                        className='dropdown profile-dropdown'
                        visible={open}
                        transformOrigin='center'
                    >
                        <Menu.Items static>
                            <Wrapper onClick={() => navigate("/profile/details")}>
                                <Profile2 fill={'var(--main-dark4'} />
                                Profile
                            </Wrapper>
                            <Wrapper onClick={() => navigate('/profile/settings')}>
                                <SettingsIcon fill={'var(--main-dark4'} />
                                Settings
                            </Wrapper>
                            <Wrapper onClick={() => setModal("help")}>
                                <HelpIcon fill={'var(--main-dark4'} />
                                Help
                            </Wrapper>
                            <Wrapper onClick={() => setModal("logout")}>
                                <LogoutIcon id="logout-icon" fill={'var(--main-dark4'} />
                                Log out
                            </Wrapper>
                        </Menu.Items>
                    </DropAnimation>
                </div>
            )}
        </Menu >
    )
}

function Header({ isNarrow }: { isNarrow: boolean }) {
    const [modal, setModal] = useState<Modal>()

    const Modal = ({ selection }: { selection?: Modal }) => {
        switch (selection) {
            case "help":
                return (
                    <Help onClose={() => setModal(undefined)} />
                )
            case "logout":
                return (
                    <Logout onClose={() => setModal(undefined)} maxWidth={"18.75rem"} hasExit={false} />
                )
            default:
                return null
        }
    }

    return (
        <>
            <header className={`${isNarrow ? 'narrow' : ''}`}>
                <div>
                    <div><LedgetLogoIcon /></div>
                    <div><Navigation isNarrow={isNarrow} /></div>
                    <DropDownMenu setModal={setModal} isNarrow={isNarrow} />
                </div>
            </header>
            <Modal selection={modal} />
        </>
    )
}


export default Header
