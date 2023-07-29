import React, { useRef, useEffect } from 'react'

import Edit from "@assets/icons/Edit"
import Split from "@assets/icons/Split"
import Details from "@assets/icons/Info"
import Snooze from "@assets/icons/Snooze"


const ItemOptionsMenu = () => {

    const refs = useRef([]);
    for (let i = 0; i < 4; i++) {
        refs.current[i] = useRef();
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowUp') {
                event.preventDefault()
                const currentIndex = refs.current.findIndex((ref) => ref.current === document.activeElement)
                const previousIndex = Math.max(currentIndex - 1, 0)
                refs.current[previousIndex].current.focus()
            } else if (event.key === 'ArrowDown') {
                event.preventDefault()
                const currentIndex = refs.current.findIndex((ref) => ref.current === document.activeElement)
                const nextIndex = Math.min((currentIndex + 1), refs.current.length - 1)
                refs.current[nextIndex].current.focus()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    useEffect(() => {
        refs.current[0].current.focus()
    }, [])

    return (
        <ul role="menu">
            <li
                className={`dropdown-item`}
                ref={refs.current[0]}
                role="menuitem"
            >
                <Split className="dropdown-icon" />
                Split
            </li>
            <li
                className={`dropdown-item`}
                ref={refs.current[1]}
                role="menuitem"
            >
                <Edit className="dropdown-icon" />
                Note
            </li>
            <li
                className={`dropdown-item`}
                ref={refs.current[2]}
                role="menuitem"
            >
                <Snooze className="dropdown-icon" />
                Snooze
            </li>
            <li
                className={`dropdown-item`}
                ref={refs.current[3]}
                role="menuitem"
            >
                <Details className="dropdown-icon" />
                Details
            </li>
        </ul>
    )
}

export default ItemOptionsMenu
