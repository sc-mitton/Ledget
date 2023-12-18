import { useRef, useState } from 'react'

import { animated } from '@react-spring/web'
import { useLocation, useNavigate } from 'react-router-dom'

import { Tooltip, usePillAnimation, useSchemeVar } from '@ledget/ui'
import { Profile1, Shield, Settings, Link } from '@ledget/media'
import { useGetMeQuery } from '@features/userSlice'
import { useEffect } from 'react'

const NavList = () => {
    const tabs = ['connections', 'security']
    const rootPath = useLocation().pathname.split("/")[2]
    const navigate = useNavigate()

    const Icon = (props: { name: string, fill: string }) => {
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
                onKeyDown={(e) => { e.key === "Enter" && navigate(route) }}
                className={`slim side-nav-item${rootPath === route ? "-current" : ''}`}
                data-current={rootPath === route ? "page" : null}
            >
                <Tooltip
                    msg={route.charAt(0).toUpperCase() + route.slice(1)}
                    ariaLabel={route.charAt(0).toUpperCase() + route.slice(1)}
                    type="right"
                >
                    <Icon name={route} fill={'currentColor'} />
                </Tooltip>
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
            tabIndex={0}
            onClick={() => navigate("/profile/details")}
            onKeyDown={(e) => e.key === "Enter" && navigate("/profile/details")}
            className={`side-nav-item${location.pathname === "/profile/details" ? "-current" : ''}`}
            id="profile"
            data-current={location.pathname === "/profile/details" ? "page" : null}
        >
            <Tooltip
                msg={"Profile"}
                ariaLabel={"Profile"}
                type="right"
                style={{
                    bottom: '10%',
                    left: '120%'
                }}
            >
                <Profile1 width="1.6em" height="1.6em" fill={'currentColor'} />
            </Tooltip>
            <div>
                <span>{`${user?.name.first}'s`} Ledget</span>
                <br />
                <span>{user?.email}</span>
            </div>
        </li>
    )
}

const Gutter = () => {
    const ref = useRef(null)
    const location = useLocation()
    const [gutterWidth, setGutterWidth] = useState(0)
    const backgroundColor = useSchemeVar('--main-hlight')

    const { props } = usePillAnimation({
        ref: ref,
        update: [location.pathname, gutterWidth],
        refresh: [],
        querySelectall: '[role=link]',
        find: (el) => el.getAttribute('data-current') === 'page',
        styles: {
            backgroundColor: backgroundColor,
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
            <nav>
                <ul role="navigation" ref={ref}>
                    <Profile />
                    <NavList />
                    <animated.span id="gutter-pill" style={props} />
                </ul>
            </nav>
        </div>
    )
}

export default Gutter
