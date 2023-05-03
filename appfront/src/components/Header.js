import React from 'react'
import { useState, useRef, useEffect } from 'react'

import logo from '../assets/images/logo.svg'
import Profile1 from '../assets/images/Profile1'
import Profile2 from '../assets/images/Profile2'
import settings from '../assets/images/settings.svg'
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

    const handleMenuClick = (e) => {
        e.preventDefault()
        setIsDropdownOpen(!isDropdownOpen)
        setModal(e.currentTarget.id)
    }

    const Menu = () => {
        return (
            <div className="dropdown-menu">
                <button
                    id="account"
                    className="dropdown-item"
                    onClick={handleMenuClick}
                    aria-label="Account menu item"
                >
                    <Profile2 className="dropdown-icon" />
                    Account
                </button>
                <button
                    id="settings"
                    className="dropdown-item"
                    onClick={handleMenuClick}
                    aria-label="Settings menu item"
                >
                    <img className="dropdown-icon" src={settings} alt="settings" />
                    Settings
                </button>
                <button
                    id="help"
                    className="dropdown-item"
                    onClick={handleMenuClick}
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
                    <div id="header-profile" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            aria-label="Open profile menu"
                            id="profile-button"
                        >
                            <Profile1 />
                        </button>
                        {isDropdownOpen && <Menu />}
                    </div>
                </div>
            </header>
            {modal === 'account' && <Account cleanUp={() => setModal('')} />}
            {modal === 'settings' && <Settings cleanUp={() => setModal('')} />}
            {modal === 'help' && <Help cleanUp={() => setModal('')} />}
        </>
    )
}

export default Header
