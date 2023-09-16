import React, { useRef, useState } from 'react'

import { animated } from '@react-spring/web'
import { useLocation, useNavigate } from 'react-router-dom'

import { Profile1, Shield, Settings, Link } from '@ledget/shared-assets'
import { usePillAnimation } from '@utils/hooks'
import { useGetMeQuery } from '@features/userSlice'
import { useEffect } from 'react'

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
                aria-current={rootPath === route ? "page" : null}
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
    const { data: user } = useGetMeQuery()

    return (
        <li
            key="Account"
            role="link"
            name="profile"
            tabIndex={0}
            onClick={() => navigate("/profile/details")}
            onKeyDown={(e) => e.key === "Enter" && navigate("/profile/details")}
            className={`side-nav-item${location.pathname === "/profile/details" ? "-current" : ''}`}
            id="profile"
            aria-current={location.pathname === "/profile/details" ? "page" : null}
        >
            <div>
                <Profile1 width="1.6em" height="1.6em" />
            </div>
            <div>
                <span>{`${user?.name.first}'s`} Ledget</span>
                <br />
                <span style={{ opacity: '.5' }}>{user?.email}</span>
            </div>
        </li>
    )
}

const Gutter = () => {
    const ref = useRef(null)
    const location = useLocation()
    const [gutterWidth, setGutterWidth] = useState(0)

    const { props } = usePillAnimation({
        ref: ref,
        update: [location.pathname, gutterWidth],
        refresh: [],
        querySelectall: '[role=link]',
        find: (el) => el.getAttribute('aria-current') === 'page',
        styles: {
            backgroundColor: 'var(--green-hlight2)',
            borderRadius: location.pathname === '/profile/details'
                ? 'var(--border-radius25)'
                : 'var(--border-radius2)',
        }
    })

    // Resize observer to update gutter width
    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const newWidth = entry.contentRect.width
                setGutterWidth(newWidth)
            }
        })

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            observer.disconnect()
        }
    }, [])

    return (
        <div id="gutter" >
            <div>
                <ul role="navigation" ref={ref}>
                    <Profile />
                    <NavList />
                    <animated.span id="gutter-pill" style={props} />
                </ul>
            </div>
        </div>
    )
}

export default Gutter
