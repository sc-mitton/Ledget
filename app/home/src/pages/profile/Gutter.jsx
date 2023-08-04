import React, { useEffect, useRef } from 'react'

import { animated } from '@react-spring/web'
import { useLocation, useNavigate } from 'react-router-dom'

import { usePillAnimation } from '@utils/hooks'

const Gutter = () => {
    const ref = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()

    const { props } = usePillAnimation({
        ref: ref,
        update: [location.pathname],
        refresh: [],
        querySelectall: '[role=link]',
        find: (el) => {
            const path = location.pathname.split("/")[2]
                || location.pathname.split("/")[1]
            return el.firstChild.name === path
        }
    })

    const handleClick = (e) => {
        const name = e.target.name || e.target.firstChild.name
        navigate(`/profile/${name}`)
    }

    return (
        <div id="gutter" >
            <div>
                <ul role="navigation" ref={ref}>
                    <li
                        key="Account"
                        role="link"
                        name="profile"
                        tabIndex={0}
                        onClick={() => navigate("/profile")}
                        onKeyDown={(e) => e.key === "Enter" && navigate("/profile")}
                        className={`${location.pathname === "/profile" && "active"}`}
                    >
                        <a name="profile">Account</a>
                    </li>
                    <li
                        key="settings"
                        role="link"
                        name="settings"
                        tabIndex={0}
                        onClick={handleClick}
                        onKeyDown={(e) => e.key === "Enter" && handleClick(e)}
                        className={`${location.pathname === "/profile/settings" && "active"}`}
                    >
                        <a name="settings">Settings</a>
                    </li>
                    <li
                        key="institutions"
                        role="link"
                        name="institutions"
                        tabIndex={0}
                        onClick={handleClick}
                        onKeyDown={(e) => e.key === "Enter" && handleClick(e)}
                        className={`${location.pathname === "/profile/institutions" && "active"}`}
                    >
                        <a name="institutions">Institutions</a>
                    </li>
                    <li
                        key="security"
                        role="link"
                        name="security"
                        tabIndex={0}
                        onClick={handleClick}
                        onKeyDown={(e) => e.key === "Enter" && handleClick(e)}
                        className={`${location.pathname === "/profile/security" && "active"}`}
                    >
                        <a name="security">Security</a>
                    </li>
                    <animated.span style={props} />
                </ul>
            </div>
        </div>
    )
}

export default Gutter
