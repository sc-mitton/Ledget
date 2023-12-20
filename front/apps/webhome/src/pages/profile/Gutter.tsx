import { useRef, useState, useEffect } from 'react'

import { animated, useSpring } from '@react-spring/web'
import { useLocation, useNavigate } from 'react-router-dom'

import {
    Tooltip,
    usePillAnimation,
    useSchemeVar,
    IconButton,
    useAccessEsc
} from '@ledget/ui'
import { Profile1, Shield, Settings, Link, Hamburger } from '@ledget/media'
import { useGetMeQuery } from '@features/userSlice'
import { useScreenContext } from '@context/context'
import { useGutterContext } from './Window'

const tabs = ['details', 'connections', 'security']

const NavList = () => {
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
        tabs.slice(1, 3).map((route) => (
            <li
                role="menuitem"
                data-current={location.pathname === "/profile/details" ? "page" : ''}
                key={route}
                id={route}
                onClick={() => navigate(route)}
                onKeyDown={(e) => { e.key === "Enter" && navigate(route) }}
                className={`slim side-nav-item${rootPath === route ? "-current" : ''}`}
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
            role="menuitem"
            data-current={location.pathname === "/profile/details" ? "page" : ''}
            onClick={() => navigate("/profile/details")}
            onKeyDown={(e) => e.key === "Enter" && navigate("/profile/details")}
            className={`side-nav-item${location.pathname === "/profile/details" ? "-current" : ''}`}
            id="profile"
        >
            <Tooltip
                msg={"Profile"}
                ariaLabel={"Profile"}
                type="right"
                style={{ bottom: '10%', left: '120%' }}
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
    const ulRef = useRef<HTMLUListElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const location = useLocation()
    const backgroundColor = useSchemeVar('--main-hlight')
    const [open, setOpen] = useGutterContext()
    const [updatePill, setUpdatePill] = useState(false)
    const { screenSize } = useScreenContext()

    const { props } = usePillAnimation({
        ref: ulRef,
        update: [location.pathname, open, updatePill],
        refresh: [],
        querySelectall: '[role=menuitem]',
        find: (el, index) => index === tabs.indexOf(location.pathname.split("/")[2]),
        styles: {
            backgroundColor: backgroundColor,
            borderRadius: location.pathname === '/profile/details'
                ? 'var(--border-radius25)'
                : 'var(--border-radius2)',
        }
    })

    const navProps = useSpring({
        flex: open ? 1 : 0,
        ...(screenSize === 'small'
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
            ? screenSize !== 'small' ? '1em' : '0em'
            : '0em',
        marginBottom: open
            ? screenSize !== 'small' ? '1em' : '0em'
            : '0em',
        config: { duration: 200 },
        delay: open ? 0 : 200,
        onRest: () => setUpdatePill(!updatePill),
        immediate: screenSize !== 'small'
    })

    useAccessEsc({
        refs: [buttonRef, ulRef],
        visible: open,
        setVisible: () => {
            if (screenSize === 'small') {
                setOpen(false)
            }
        }
    })

    // Close gutter on screen resize to small
    useEffect(() => {
        if (screenSize === 'small') {
            setOpen(false)
        } else {
            setOpen(true)
        }
    }, [screenSize])

    // On page navigation, if in small screen, close gutter
    useEffect(() => {
        if (screenSize === 'small') {
            setOpen(false)
        }
    }, [location.pathname])

    return (
        <>
            <div id='hamburger'>
                <IconButton
                    onClick={() => { screenSize === 'small' && setOpen(!open) }}
                    ref={buttonRef}
                >
                    <Hamburger size={'1.2em'} />
                </IconButton>
            </div>
            <animated.nav
                style={navProps}
                id='gutter'
                className={`${open ? 'open' : ''} ${screenSize === 'small' ? 'small-screen' : ''}`}
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
