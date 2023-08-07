import React, { useRef, useState } from 'react'

import { animated } from '@react-spring/web'
import { useLocation, useNavigate } from 'react-router-dom'

import Profile1 from '@assets/icons/Profile1'
import Shield from '@assets/icons/Shield'
import Settings from '@assets/icons/Settings'
import Link from '@assets/icons/Link'
import { usePillAnimation } from '@utils/hooks'

const NavList = () => {
    const tabs = ['settings', 'connections', 'security']
    const rootPath = useLocation().pathname.split("/")[2]
    const navigate = useNavigate()

    const Icon = (props) => {
        switch (props.name) {
            case "settings":
                return <Settings {...props} />
            case 'connections':
                return <Link {...props} />
            case "security":
                return <Shield {...props} />
            default:
                return null
        }
    }

    return (
        tabs.map((route) => (
            <li
                key={route}
                role="link"
                id={route}
                tabIndex={0}
                onClick={() => navigate(route)}
                onKeyDown={(e) => {
                    e.key === "Enter" && navigate(route)
                }}
                className={`slim side-nav-item${rootPath === route ? "-current" : ''}`}
            >
                <div>
                    <Icon name={route} />
                </div>
                <div>
                    {route.charAt(0).toUpperCase() + route.slice(1)}
                </div>
            </li>
        ))
    )
}

const Profile = () => {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <li
            key="Account"
            role="link"
            name="profile"
            tabIndex={0}
            onClick={() => navigate("/profile")}
            onKeyDown={(e) => e.key === "Enter" && navigate("/profile")}
            className={`side-nav-item${location.pathname === "/profile" ? "-current" : ''}`}
            id="profile"
        >
            <div>
                <Profile1 />
            </div>
            <div>
                <div>
                    <span>Spencer's Ledget</span>
                </div>
                <div>
                    <span style={{ opacity: '.5' }}>smitton.byu@gmail.com</span>
                </div>
            </div>
        </li>
    )
}

const Gutter = () => {
    const ref = useRef(null)
    const location = useLocation()

    const { props } = usePillAnimation({
        ref: ref,
        update: [location.pathname],
        refresh: [],
        querySelectall: '[role=link]',
        find: (el) => {
            const path = location.pathname.split("/")[2]
                || location.pathname.split("/")[1]
            return el.id === path
        },
        styles: {
            backgroundColor: 'var(--green-hlight)',
        }
    })

    return (
        <div id="gutter" >
            <div>
                <ul role="navigation" ref={ref}>
                    <Profile />
                    <NavList />
                    <animated.span style={props} />
                </ul>
            </div>
        </div>
    )
}

export default Gutter
