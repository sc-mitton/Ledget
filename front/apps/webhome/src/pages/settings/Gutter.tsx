import { useRef, useState, useEffect } from 'react'

import { animated } from '@react-spring/web'
import { useLocation, useNavigate } from 'react-router-dom'

import {
    usePillAnimation,
    useSchemeVar,
    useScreenContext
} from '@ledget/ui'
import { useGetMeQuery } from '@features/userSlice'
import { useColorScheme } from '@ledget/ui'
import { Shield, Link, User } from '@geist-ui/icons'

const tabs = ['details', 'connections', 'security']

const NavList = () => {
    const rootPath = useLocation().pathname.split("/")[2]
    const navigate = useNavigate()

    const Icon = (props: { name: string, stroke: string }) => {
        switch (props.name) {
            case "settings":
                return <User {...props} className='icon' />
            case 'connections':
                return <Link {...props} className='icon' />
            case "security":
                return <Shield {...props} className='icon' />
            default:
                return null
        }
    }

    return (
        tabs.slice(1, 3).map((route) => (
            <li
                role="menuitem"
                data-current={location.pathname.includes(route) ? "page" : ''}
                key={route}
                id={route}
                onClick={() => navigate(route)}
                onKeyDown={(e) => { e.key === "Enter" && navigate(route) }}
                className={`slim side-nav-item ${rootPath === route ? "current" : ''}`}
            >
                <div><Icon name={route} stroke={'currentColor'} /></div>
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
            role="menuitem"
            data-current={location.pathname === "/settings/profile" ? "page" : ''}
            onClick={() => navigate("/settings/profile")}
            onKeyDown={(e) => e.key === "Enter" && navigate("/settings/profile")}
            className={`side-nav-item ${location.pathname === "/settings/profile" ? "current" : ''}`}
            id="profile"
        >
            <div><User size="1.6em" stroke={'currentColor'} /></div>
            <div>
                <span>{`${user?.name.first}'s`} Ledget</span>
                <br />
                <span>{user?.email}</span>
            </div>
        </li>
    )
}

const Gutter = () => {
    const ulRef = useRef<HTMLUListElement>(null)

    const location = useLocation()
    const backgroundColor = useSchemeVar('--btn-feather-light-gray')
    const { screenSize } = useScreenContext()
    const { isDark } = useColorScheme()

    const [updatePill, setUpdatePill] = useState(0)

    const [props] = usePillAnimation({
        ref: ulRef,
        update: [location.pathname, updatePill, isDark],
        refresh: [],
        querySelectall: '[role=menuitem]',
        find: (el, index) => el.getAttribute('data-current') === 'page',
        styles: {
            backgroundColor: backgroundColor,
            borderRadius: '8px',
        }
    })

    // Observer to update pill size when screen size changes
    useEffect(() => {
        if (!ulRef.current) return

        const resizeObserver = new ResizeObserver(() => {
            setUpdatePill(prev => prev + 1)
        })

        resizeObserver.observe(ulRef.current)

        return () => {
            resizeObserver.disconnect()
        }
    }, [screenSize])

    return (
        <nav id='gutter'>
            <ul ref={ulRef}>
                <Profile />
                <NavList />
                <animated.span style={props} />
            </ul>
        </nav>
    )
}

export default Gutter
