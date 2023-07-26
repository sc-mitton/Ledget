import React, { useEffect, useRef } from 'react'

import DropAnimation from "@utils/DropAnimation"
import './Options.css'

const OptionsMenu = ({ pos, show, setShow, children }) => {
    const menuRef = useRef('')

    useEffect(() => {
        if (pos) {
            setShow(true)
        }

        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShow(false)
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' || e.key === 'Tab') {
                setShow(false)
            }
        };

        const handleWindowResize = () => {
            setShow(false)
        };

        window.addEventListener('click', handleClick)
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('resize', handleWindowResize)

        return () => {
            window.removeEventListener('resize', handleWindowResize)
            window.removeEventListener('click', handleClick)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [pos])

    return (
        <DropAnimation
            visible={show}
            className="dropdown options-dropdown"
            style={{
                position: 'absolute',
                top: pos ? pos.y + 30 : 0,
                left: pos ? pos.x - 45 : 0,
                zIndex: 10,
            }}
            ref={menuRef}
        >
            {children}
        </DropAnimation>
    )
}

export default OptionsMenu
