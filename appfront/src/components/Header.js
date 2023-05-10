import React, { useEffect } from 'react'
import { useState, Fragment } from 'react'

import { Menu, Tab, Transition } from '@headlessui/react'

import logo from '../assets/svg/logo.svg'
import Profile1 from '../assets/svg/Profile1'
import Profile2 from '../assets/svg/Profile2'
import SettingsIcon from '../assets/svg/Settings'
import HelpIcon from '../assets/svg/Help'
import Help from './modals/Help'
import Settings from './modals/Settings'
import Account from './modals/Account'
import './header.css'


function Header() {
    const [modal, setModal] = useState('')

    const DropDownMenu = () => {
        return (
            <Menu>
                <Menu.Button id="profile-button" >
                    <Profile1 />
                </Menu.Button>
                <Menu.Items>
                    <div className="dropdown profile-dropdown">
                        <Menu.Item>
                            <button
                                className="dropdown-item"
                                onClick={() => setModal("account")}
                            >
                                <Profile2 className="dropdown-icon" />
                                Account
                            </button>
                        </Menu.Item>
                        <Menu.Item>
                            <button
                                className="dropdown-item"
                                onClick={() => setModal("settings")}
                            >
                                <SettingsIcon className="dropdown-icon" />
                                Settings
                            </button>
                        </Menu.Item>
                        <Menu.Item>
                            <button
                                className="dropdown-item"
                                onClick={() => setModal("help")}
                            >
                                <HelpIcon className="dropdown-icon" />
                                Help
                            </button>
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Menu >
        )
    }

    const Tabs = () => {
        return (
            <Tab.Group>
                <Tab.List>
                    <Tab>Tab 1</Tab>
                    <Tab>Tab 2</Tab>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>Tab 1</Tab.Panel>
                    <Tab.Panel>Tab 2</Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        )
    }

    return (
        <>
            <header>
                <div id="header-container">
                    <div id="header-logo">
                        <img src={logo} alt="Ledget Logo" />
                    </div>
                    <div id="header-profile">
                        <DropDownMenu />
                    </div>
                </div>
            </header>
            {modal === 'account' && <Account cleanUp={() => setModal('')} maxWidth={'340px'} />}
            {modal === 'settings' && <Settings cleanUp={() => setModal('')} />}
            {modal === 'help' && <Help cleanUp={() => setModal('')} />}
        </>
    )
}

export default Header
