import React from 'react'
import { useState, useRef, useEffect } from 'react'

import logo from '../assets/images/logo.svg'
import profile from '../assets/images/profile.svg'
import settings from '../assets/images/settings.svg'
import Profile from '../assets/images/Profile'
import help from '../assets/images/help.svg'
import Help from './modals/Help'
import Settings from './modals/Settings'
import Account from './modals/Account'
import './header.css'


function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const [modal, setModal] = useState('')

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [dropdownRef])

    const Menu = () => {
        return (
            <div className="dropdown-menu">
                <button
                    className="dropdown-item"
                    onClick={() =>
                        setModal('account')}
                    aria-label="Account menu item"
                >
                    <Profile className="dropdown-icon" />
                    Account
                </button>
                <button
                    className="dropdown-item"
                    onClick={() => setModal('settings')}
                    aria-label="Settings menu item"
                >
                    <img className="dropdown-icon" src={settings} alt="settings" />
                    Settings
                </button>
                <button
                    className="dropdown-item"
                    onClick={() => setModal('help')}
                    aria-label="Help menu item"
                >
                    <img className="dropdown-icon" src={help} alt="help" />
                    Help
                </button>
            </div>
        )
    }

    return (
        <>
            <header>
                <div id="header-container">
                    <div id="header-logo">
                        <img src={logo} alt="Ledget Logo" />
                    </div>
                    <button
                        id="header-profile"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        ref={dropdownRef}
                        aria-label="Open profile menu"
                    >
                        <img id="profile-icon" src={profile} alt="Profile" />
                        {isDropdownOpen && <Menu />}
                    </button>
                </div>
            </header>
            {modal === 'settings' && <Settings cleanUp={() => setModal('')} />}
            {modal === 'help' && <Help cleanUp={() => setModal('')} />}
            {modal === 'account' && <Account cleanUp={() => setModal('')} />}
        </>
    )
}

export default Header
