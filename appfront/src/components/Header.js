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
                <div
                    className="dropdown-item"
                    onClick={() =>
                        setModal('account')}
                >
                    <Profile className="dropdown-icon" />
                    Account
                </div>
                <div
                    className="dropdown-item"
                    onClick={() => setModal('settings')}
                >
                    <img className="dropdown-icon" src={settings} alt="settings" />
                    Settings
                </div>
                <div
                    className="dropdown-item"
                    onClick={() => setModal('help')}
                >
                    <img className="dropdown-icon" src={help} alt="help" />
                    Help
                </div>
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
                    <div
                        id="header-profile"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        ref={dropdownRef}
                    >
                        <img id="profile-icon" src={profile} alt="Profile" />
                        {isDropdownOpen && <Menu />}
                    </div>
                </div>
            </header>
            {modal === 'settings' && <Settings cleanUp={() => setModal('')} />}
            {modal === 'help' && <Help cleanUp={() => setModal('')} />}
            {modal === 'account' && <Account cleanUp={() => setModal('')} />}
        </>
    )
}

export default Header
