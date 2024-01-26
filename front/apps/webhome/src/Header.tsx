import React, { useState, useRef } from 'react'

import { useNavigate, useLocation } from "react-router-dom"
import { Menu } from '@headlessui/react'

import './styles/header.scss'
import { Logout, Help } from '@modals/index'
import { LedgetLogoIcon } from '@ledget/media'
import { DropDownDiv, DropdownItem } from '@ledget/ui'
import { useScreenContext } from './context'
import { HelpCircle, LogOut, User } from '@geist-ui/icons'
import { useColorScheme } from '@ledget/ui'

const Navigation = () => {
    const tabs = [
        { name: "budget", path: "budget" },
        { name: "accounts", path: "accounts/deposits" }
    ]
    const { screenSize } = useScreenContext()

    const location = useLocation()
    const navigate = useNavigate()
    const navListRef = useRef<HTMLUListElement>(null)

    return (
        <nav className="header-nav">
            <ul ref={navListRef} role="navigation">
                {tabs.map((tab) => (
                    <li
                        key={tab.name}
                        className={`${location.pathname.split('/')[1] === tab.name ? "current-" : ""}nav-item`}
                        role="link"
                        tabIndex={0}
                        onClick={() => location.pathname !== tab.path && navigate(tab.path)}
                        onKeyDown={(e) => { if (e.key === "Enter") { navigate(tab.path) } }}
                    >
                        <a
                            onClick={(e) => {
                                e.preventDefault()
                                location.pathname !== tab.path && navigate(tab.path)
                            }}
                            aria-current={location.pathname.split('/')[1] === tab.name ? "page" : undefined}
                        >
                            {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
                        </a>
                    </li>
                ))}
                {screenSize !== 'extra-large' &&
                    <li
                        className={`${location.pathname === "/spending" ? "current-" : ""}nav-item`}
                        role="link"
                        tabIndex={0}
                        onClick={() => location.pathname !== '/spending' && navigate("/spending")}
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
            </ul>
        </nav>
    )
}

type Modal = "help" | "logout"

const DropDownMenu = ({ setModal }:
    { setModal: React.Dispatch<React.SetStateAction<Modal | undefined>> }) => {
    const navigate = useNavigate()

    const Wrapper = ({ onClick, children }:
        { onClick: React.MouseEventHandler<HTMLButtonElement>, children: React.ReactNode }) => {

        return (
            <Menu.Item as={React.Fragment}>
                {({ active }) => (
                    <DropdownItem
                        as='button'
                        active={active}
                        onClick={onClick}
                    >
                        {children}
                    </DropdownItem>
                )}
            </Menu.Item>
        )
    }

    return (
        <Menu>
            {({ open }) => (
                <div style={{ position: 'relative' }}>
                    <Menu.Button className="profile-button">
                        <User className='icon' />
                    </Menu.Button>
                    <DropDownDiv
                        placement='right'
                        arrow='right'
                        className='profile-dropdown'
                        visible={open}
                        transformOrigin='center'
                    >
                        <Menu.Items static>
                            <Wrapper onClick={() => navigate("/profile/details")}>
                                <User className='icon' />
                                Profile
                            </Wrapper>
                            <Wrapper onClick={() => setModal("help")}>
                                <HelpCircle className='icon' />
                                Help
                            </Wrapper>
                            <Wrapper onClick={() => setModal("logout")}>
                                <LogOut className='icon' />
                                Log out
                            </Wrapper>
                        </Menu.Items>
                    </DropDownDiv>
                </div>
            )}
        </Menu >
    )
}

function Header() {
    const [modal, setModal] = useState<Modal>()
    const { screenSize } = useScreenContext()
    const { isDark } = useColorScheme()

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
            <header className={`${screenSize !== 'large' ? 'narrow' : ''} ${screenSize === 'extra-small' ? 'extra-small' : ''} ${isDark ? 'dark-mode' : ''}`}>
                <div>
                    <div><LedgetLogoIcon /></div>
                    <div><Navigation /></div>
                    <DropDownMenu setModal={setModal} />
                </div>
            </header>
            <Modal selection={modal} />
        </>
    )
}


export default Header
