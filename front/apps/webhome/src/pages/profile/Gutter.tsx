import { useRef, useState, useEffect } from 'react'

import { animated, useSpring } from '@react-spring/web'
import { useLocation, useNavigate } from 'react-router-dom'

import {
    usePillAnimation,
    useSchemeVar,
    IconButton,
    useAccessEsc
} from '@ledget/ui'
import { Hamburger } from '@ledget/media'
import { useGetMeQuery } from '@features/userSlice'
import { useScreenContext } from '@context/context'
import { useGutterContext } from './Window'
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
                data-current={location.pathname === "/profile/details" ? "page" : ''}
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
            data-current={location.pathname === "/profile/details" ? "page" : ''}
            onClick={() => navigate("/profile/details")}
            onKeyDown={(e) => e.key === "Enter" && navigate("/profile/details")}
            className={`side-nav-item ${location.pathname === "/profile/details" ? "current" : ''}`}
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
    const buttonRef = useRef<HTMLButtonElement>(null)

    const location = useLocation()
    const backgroundColor = useSchemeVar('--blue-light')
    const [open, setOpen] = useGutterContext()
    const { screenSize } = useScreenContext()
    const { isDark } = useColorScheme()

    const [updatePill, setUpdatePill] = useState(false)
    const [smallScreenMode, setSmallScreenMode] = useState(false)

    const [props] = usePillAnimation({
        ref: ulRef,
        update: [location.pathname, open, updatePill, isDark],
        refresh: [],
        querySelectall: '[role=menuitem]',
        find: (el, index) => index === tabs.indexOf(location.pathname.split("/")[2]),
        styles: {
            backgroundColor: backgroundColor,
            borderRadius: '8px',
        }
    })

    const gutterProps = useSpring({
        flex: open ? 1 : 0,
        ...(smallScreenMode
            ? {
                left: 0,
                right: open ? '20%' : '0%',
                bottom: 0,
                top: 0
            }
            : {}
        ),

        maxWidth: open ? '15.75rem' : '0em',
        paddingLeft: open ? '0.5em' : '0em',
        paddingRight: open ? '0.5em' : '0em',
        paddingTop: open ? '0.75em' : '0em',
        paddingBottom: open ? '0.75em' : '0em',
        marginTop: open
            ? !smallScreenMode ? '.5em' : '0em'
            : '0em',
        marginBottom: open
            ? !smallScreenMode ? '1em' : '0em'
            : '0em',
        config: { duration: 200 },
        delay: open ? 0 : 200,
        onRest: () => setUpdatePill(!updatePill),
        immediate: !smallScreenMode
    })

    useAccessEsc({
        refs: [buttonRef, ulRef],
        visible: open,
        setVisible: () => {
            if (smallScreenMode) {
                setOpen(false)
            }
        }
    })

    // Close gutter on screen resize to small
    useEffect(() => {
        if (screenSize !== 'small' && screenSize !== 'extra-small') {
            setSmallScreenMode(false)
            setOpen(true)
        } else {
            setSmallScreenMode(true)
            setOpen(false)
        }
    }, [screenSize])

    useEffect(() => {
        if (smallScreenMode) {
            setOpen(false)
        }
    }, [location.pathname, smallScreenMode])

    return (
        <>
            {smallScreenMode &&
                <div id='hamburger'>
                    <IconButton
                        onClick={() => { setOpen(!open) }}
                        ref={buttonRef}
                    >
                        <Hamburger size={'1.2em'} />
                    </IconButton>
                </div>}
            <animated.nav
                style={gutterProps}
                id='gutter'
                className={`${open ? 'open' : ''} ${smallScreenMode ? 'small-screen' : ''}`}
            >
                <ul ref={ulRef}>
                    <Profile />
                    <NavList />
                    <animated.span style={props} />
                </ul>
            </animated.nav>
        </>
    )
}

export default Gutter
