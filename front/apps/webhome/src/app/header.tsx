import React, { useState, Fragment } from 'react'

import { Menu } from '@headlessui/react'
import { Switch } from '@headlessui/react'

import './styles/header.scss'
import { LedgetLogoIcon2 } from '@ledget/media'
import { setLogoutModal, setHelpModal } from '@features/modalSlice'
import { useAppDispatch } from '@hooks/store'
import { User, LifeBuoy, LogOut, Sun, Moon } from '@geist-ui/icons'
import { DropdownItem, DropDownDiv, useScreenContext, useColorScheme } from '@ledget/ui'
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

const ProfileDropdownMenu = () => {
    const dispatch = useAppDispatch()

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
                            <Wrapper onClick={() => dispatch(setHelpModal({ open: true }))}>
                                <LifeBuoy className='icon' />
                                Help
                            </Wrapper>
                            <Wrapper onClick={() => dispatch(setLogoutModal({ open: true }))}>
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
    const { screenSize } = useScreenContext()
    const { isDark } = useColorScheme()

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
                        <ProfileDropdownMenu />
                    </div>
                </div>
            </header>
        </>
    )
}


export default Header
