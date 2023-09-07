

import React, { useEffect, useRef } from 'react'

import { DropAnimation } from '@ledget/shared-ui'
import { useClickClose } from "@utils/hooks"
import './Options.css'

const OptionsMenu = ({ pos, show, setShow, children }) => {
    const menuRef = useRef('')

    useClickClose({
        refs: [menuRef],
        visible: show,
        setVisible: setShow,
    })

    useEffect(() => {
        if (!menuRef.current && pos) { setShow(true) }

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' || e.key === 'Tab') {
                setShow(false)
            }
        }

        const handleWindowResize = () => { setShow(false) }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('resize', handleWindowResize)

        return () => {
            window.removeEventListener('resize', handleWindowResize)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [pos])

    return (
        <DropAnimation
            visible={show}
            className="dropdown options-dropdown"
            style={{
                position: 'absolute',
                top: pos ? pos.y + 40 : 0,
                left: pos ? pos.x - 43 : 0,
                zIndex: 10,
            }}
            ref={menuRef}
        >
            {children}
        </DropAnimation>
    )
}

export default OptionsMenu
