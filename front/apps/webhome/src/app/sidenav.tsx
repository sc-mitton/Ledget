import { useEffect, useRef, useState } from 'react'

import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import { animated } from '@react-spring/web'
import {
    DollarSign,
    Home,
    Settings,
    ChevronDown,
    User,
    Link,
    Shield
} from '@geist-ui/icons'

import styles from './styles/sidenav.module.scss'
import { Institution, LedgetLogo, Hamburger } from '@ledget/media'
import {
    usePillAnimation,
    useScreenContext,
    useColorScheme,
    useSchemeVar,
    useCloseDropdown,
} from '@ledget/ui'

const SubSettingsSidebar = () => {
    const navigate = useNavigate()

    return (
        <ul
            className={styles.subNav}
            role='menu'
        >
            <li data-current={location.pathname.includes('profile') ? "page" : ''}>
                <a onClick={() => navigate('/settings/profile')}>
                    <User className='icon' />
                    <span>Profile</span>
                </a>
            </li>
            <li data-current={location.pathname.includes('connections') ? "page" : ''}>
                <a onClick={() => navigate('/settings/connections')}>
                    <Link className='icon' />
                    <span>Connections</span>
                </a>
            </li>
            <li data-current={location.pathname.includes('security') ? "page" : ''}>
                <a onClick={() => navigate('/settings/security')}>
                    <Shield className='icon' />
                    <span>Security</span>
                </a>
            </li>
        </ul>
    )
}

const LegalLinks = () => (
    <div className={styles.legalLinks}>
        <RouterLink to={`${import.meta.env.VITE_LANDING}/privacy`}>Privacy</RouterLink>
        <RouterLink to={`${import.meta.env.VITE_LANDING}/terms`}>Terms</RouterLink>
    </div>
)

const Nav = () => {

    const ulRef = useRef(null)
    const [updatePill, setUpdatePill] = useState(0)
    const [settingsSubOpen, setSettingsSubOpen] = useState(false)

    const { screenSize } = useScreenContext()
    const { isDark } = useColorScheme()
    const backgroundColor = useSchemeVar('--btn-feather-light-gray')
    const navigate = useNavigate()
    const location = useLocation()

    const [props] = usePillAnimation({
        ref: ulRef,
        update: [location.pathname, updatePill, isDark],
        refresh: [screenSize],
        querySelectall: 'li',
        find: (el, index) => el.getAttribute('data-current') === 'page',
        styles: {
            backgroundColor: backgroundColor,
            borderRadius: '8px',
        }
    })

    useEffect(() => {
        // Set resize observer so that when ulRef changes size, the pill updates
        if (!ulRef.current) return

        const resizeObserver = new ResizeObserver(() => {
            setUpdatePill(prev => prev + 1)
        })
        resizeObserver.observe(ulRef.current)

        return () => {
            resizeObserver.disconnect()
        }
    }, [ulRef.current])

    return (
        <nav className={styles.sideNav} data-size={screenSize}>
            <ul ref={ulRef} role='menu'>
                <li data-current={location.pathname === '/' ? "page" : ''}>
                    <a onClick={() => { }} aria-disabled>
                        <Home className='icon' />
                        <span>Home</span>
                    </a>
                </li>
                <li data-current={location.pathname.includes('budget') ? "page" : ''}>
                    <a onClick={() => { navigate('budget') }}>
                        <DollarSign className='icon' />
                        <span>Budget</span>
                    </a>
                </li>
                <li data-current={location.pathname.includes('accounts') ? "page" : ''}>
                    <a onClick={() => { navigate('accounts/deposits') }}>
                        <Institution className='icon' />
                        <span>Accounts</span>
                    </a>
                </li>
                <li data-current={location.pathname.includes('settings') ? "page" : ''}>
                    <a onClick={() => {
                        !['large', 'extra-large'].includes(screenSize)
                            ? setSettingsSubOpen(prev => !prev)
                            : navigate('/settings/profile')
                    }}
                    >
                        <Settings className='icon' />
                        <span>Settings</span>
                        {!['large', 'extra-large'].includes(screenSize) &&
                            <ChevronDown className='icon' />
                        }
                    </a>
                </li>
                {!['large', 'extra-large'].includes(screenSize) && settingsSubOpen &&
                    <SubSettingsSidebar />}
                <animated.span style={props} />
            </ul>
            <LegalLinks />
        </nav>
    )
}

const Sidebar = () => {
    const { screenSize } = useScreenContext()
    const [open, setOpen] = useState(false)
    const buttonRef = useRef(null)
    const hidingSidebarRef = useRef(null)
    const location = useLocation()
    const { isDark } = useColorScheme()

    useCloseDropdown({
        visible: open,
        setVisible: setOpen,
        refs: [buttonRef, hidingSidebarRef]
    })

    useEffect(() => {
        setOpen(false)
    }, [location.pathname])

    return (
        ['small', 'extra-small', 'medium'].includes(screenSize)
            ?
            <>
                <div className={styles.hamburger}>
                    <button
                        onClick={() => { setOpen(!open) }}
                        ref={buttonRef}
                        aria-label='Open Sidebar'
                        aria-expanded={open}
                        aria-controls='hiding-sidebar'
                        aria-haspopup='true'
                    >
                        <Hamburger />
                    </button>
                </div>
                <div
                    id='hiding-sidebar'
                    className={styles.hidingSidebar}
                    ref={hidingSidebarRef}
                    data-open={open}
                >
                    <LedgetLogo darkMode={isDark} />
                    <Nav />
                </div>
                <div className={styles.hidingSidebarBackdrop} data-open={open} />
            </>
            :
            <Nav />
    )
}

export default Sidebar
