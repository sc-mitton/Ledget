import React, { useState, Fragment } from 'react'

import { Menu } from '@headlessui/react'
import { Switch } from '@headlessui/react'

import './styles/header.scss'
import { LedgetLogoIcon2 } from '@ledget/media'
import { User, LifeBuoy, LogOut, Sun, Moon } from '@geist-ui/icons'
import { DropdownItem, DropDownDiv, useScreenContext, useColorScheme } from '@ledget/ui'
import { Logout, Help } from '@modals/index'
import { NotificationsDropdownMenu } from '@pages/activity'

type Modal = "help" | "logout"

const LightDarkSwitch = () => {
    const { isDark, setDarkMode } = useColorScheme()

    return (
        <Switch.Group id="light-dark-switch" as={'div'}>
            <Switch
                checked={isDark}
                onChange={setDarkMode}
                className={`switch-crib ${isDark ? 'enabled' : 'disabled'}`}
            >
                {({ checked: isChecked }) => (
                    <>
                        <div><Sun className='icon' /></div>
                        <div><Moon className='icon' /></div>
                        <span className={`switch-pill ${isChecked ? 'enabled' : 'disabled'}`} />
                    </>
                )}
            </Switch>
        </Switch.Group>
    )
}

const ProfileDropdownMenu = ({ setModal }:
    { setModal: React.Dispatch<React.SetStateAction<Modal | undefined>> }) => {

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
                        <User className='icon' stroke={'var(--white)'} />
                    </Menu.Button>
                    <DropDownDiv
                        placement='right'
                        arrow='right'
                        className='profile-dropdown'
                        visible={open}
                    >
                        <Menu.Items static>
                            <Wrapper onClick={() => setModal("help")}>
                                <LifeBuoy className='icon' />
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
    const { isDark, setDarkMode } = useColorScheme()

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
            <header className={`${screenSize} ${isDark ? 'dark-mode' : ''}`}>
                <div>
                    <div>
                        <LedgetLogoIcon2 />
                    </div>
                    <div>
                        <LightDarkSwitch />
                        <NotificationsDropdownMenu id='notifications' />
                        <ProfileDropdownMenu setModal={setModal} />
                    </div>
                </div>
            </header>
            <Modal selection={modal} />
        </>
    )
}


export default Header
