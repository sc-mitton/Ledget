import { useRef, useEffect, useState } from 'react'

import { Edit, Split, Info as DetailsIcon, Snooze } from "@ledget/media"


const ItemOptionsMenu = () => {
    const ref = useRef()
    const refs = useRef([])
    const [activeIndex, setActiveIndex] = useState(null)

    for (let i = 0; i < 4; i++) {
        refs.current[i] = useRef()
    }

    useEffect(() => {
        ref.current.focus()

        ref.current.addEventListener('focus', () => {
            setActiveIndex(0)
        })
    }, [])

    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'ArrowUp':
                activeIndex > 0 && setActiveIndex(activeIndex - 1)
                break
            case 'ArrowDown':
                if (activeIndex === null) {
                    setActiveIndex(0)
                } else if (activeIndex < 3) {
                    setActiveIndex(activeIndex + 1)
                }
                break
            case 'Enter':
                refs.current[activeIndex].click()
                break
            default:
                break
        }
    }

    return (
        <div>
            <ul
                ref={ref}
                role="menu"
                aria-orientation='vertical'
                onKeyDown={handleKeyDown}
                tabIndex={0}
            >
                <li
                    className={`dropdown-item${activeIndex === 0 ? ' active' : ''}`}
                    role="menuitem"
                >
                    <div
                        ref={refs.current[0]}
                        tabIndex={-1}
                        onClick={() => console.log('split')}
                        aria-label="Split"
                        role="button"
                    >
                        <Split className="dropdown-icon" />
                        Split
                    </div>
                </li>
                <li
                    className={`dropdown-item${activeIndex === 1 ? ' active' : ''}`}
                    role="menuitem"
                >
                    <div
                        ref={refs.current[1]}
                        tabIndex={-1}
                        onClick={() => console.log('Add Note')}
                        aria-label="Add note"
                        role="button"
                    >
                        <Edit className="dropdown-icon" />
                        Note
                    </div>
                </li>
                <li
                    className={`dropdown-item${activeIndex === 2 ? ' active' : ''}`}
                    role="menuitem"
                >
                    <div
                        ref={refs.current[2]}
                        tabIndex={-1}
                        onClick={() => console.log('Snooze')}
                        aria-label="Snooze"
                        role="button"
                    >
                        <Snooze className="dropdown-icon" />
                        Snooze
                    </div>
                </li>
                <li
                    className={`dropdown-item${activeIndex === 3 ? ' active' : ''}`}
                    role="menuitem"
                >
                    <div
                        ref={refs.current[3]}
                        tabIndex={-1}
                        onClick={() => console.log('Checkout details')}
                        aria-label="Details"
                        role="button"
                    >
                        <DetailsIcon className="dropdown-icon" />
                        Details
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default ItemOptionsMenu
