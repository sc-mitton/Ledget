import React from 'react'
import { useState, useRef, useEffect } from 'react'

import logo from '../assets/images/logo.svg'
import profile from '../assets/images/profile.svg'
import settings from '../assets/images/settings.svg'
import help from '../assets/images/help.svg'
import './header.css'

function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    function handleDropdownClick() {
        setIsDropdownOpen(!isDropdownOpen)
    }

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

    return (
        <header>
            <div id="header-container">
                <div id="header-logo">
                    <img src={logo} alt="Ledget Logo" />
                </div>
                <div id="header-profile" onClick={handleDropdownClick} ref={dropdownRef}>
                    <img id="profile-icon" src={profile} alt="Profile" />
                    {isDropdownOpen &&
                        <div className="dropdown-menu">
                            <div className="dropdown-item">
                                <img className="dropdown-icon" src={settings} alt="settings" />
                                Settings
                            </div>
                            <div className="dropdown-item">
                                <img className="dropdown-icon" src={help} alt="help" />
                                Help
                            </div>
                        </div>
                    }
                </div>
            </div>
        </header>
    )
}

export default Header
