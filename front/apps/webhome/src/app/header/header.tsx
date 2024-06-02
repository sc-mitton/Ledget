import React, { useState, Fragment } from 'react'

import { Menu } from '@headlessui/react'
import { Switch } from '@headlessui/react'

import './styles/header.scss'
import { LedgetLogoIcon2 } from '@ledget/media'
import { setLogoutModal, setModal } from '@features/modalSlice'
import { useAppDispatch } from '@hooks/store'
import { User, LifeBuoy, LogOut, Sun, Moon } from '@geist-ui/icons'
import { DropdownItem, DropdownDiv, useScreenContext, useColorScheme } from '@ledget/ui'
import { ActivityDropdown } from '../header'

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
                <div className='profile-dropdown'>
                    <Menu.Button className="profile-button">
                        <User className='icon' stroke={'var(--white)'} />
                    </Menu.Button>
                    <DropdownDiv
                        placement='right'
                        arrow='right'
                        visible={open}
                    >
                        <Menu.Items static>
                            <Wrapper onClick={() => dispatch(setModal('help'))}>
                                <LifeBuoy className='icon' />
                                Help
                            </Wrapper>
                            <Wrapper onClick={() => dispatch(setLogoutModal({ open: true }))}>
                                <LogOut className='icon' />
                                Log out
                            </Wrapper>
                        </Menu.Items>
                    </DropdownDiv>
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
                        <ActivityDropdown id='notifications' />
                        <ProfileDropdownMenu />
                    </div>
                </div>
            </header>
        </>
    )
}


export default Header
