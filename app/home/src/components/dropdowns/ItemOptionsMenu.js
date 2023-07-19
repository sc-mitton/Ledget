import React, { useRef, useEffect } from 'react'

import Edit from "../../assets/svg/Edit"
import Split from "../../assets/svg/Split"
import Details from "../../assets/svg/Info"
import Snooze from "../../assets/svg/Snooze"


const ItemOptionsMenu = ({ visible, callBack }) => {
    const ref = useRef()
    const refs = useRef([]);
    for (let i = 0; i < 4; i++) {
        refs.current[i] = useRef();
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' || event.key === 'Tab') {
                callBack()
            } else if (event.key === 'ArrowUp') {
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
        };
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callBack()
            }
        }

        window.addEventListener("mousedown", handleClickOutside)
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        refs.current[0].current.focus()
    }, [])

    return (
        <div
            className="options-dropdown-container"
            ref={ref}
        >
            <button className={`dropdown-item`} ref={refs.current[0]}>
                <Split className="dropdown-icon" />
                Split
            </button>
            <button className={`dropdown-item`} ref={refs.current[1]}>
                <Edit className="dropdown-icon" />
                Note
            </button>
            <button className={`dropdown-item`} ref={refs.current[2]}>
                <Snooze className="dropdown-icon" />
                Snooze
            </button>
            <button className={`dropdown-item`} ref={refs.current[3]}>
                <Details className="dropdown-icon" />
                Details
            </button>
        </div>
    )
}

export default ItemOptionsMenu
