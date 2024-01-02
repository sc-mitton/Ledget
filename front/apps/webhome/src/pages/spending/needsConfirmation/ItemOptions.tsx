import { useRef, useEffect, useState } from 'react'

import { DropdownItem } from '@ledget/ui'
import { Split, Info as DetailsIcon } from "@ledget/media"

interface ItemOptionsMenuProps {
    handlers: (() => void)[]
}

const ItemOptionsMenu = (props: ItemOptionsMenuProps) => {
    // const ref = useRef()
    // const refs = useRef([])
    const ref = useRef<any>(null)
    const refs = useRef<any[]>(null)
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    for (let i = 0; i < 4; i++) {
        if (refs.current && refs.current[i]) {
            refs.current[i] = useRef()
        }
    }

    useEffect(() => {
        ref.current?.focus()
        ref.current?.addEventListener('focus', () => {
            setActiveIndex(0)
        })
    }, [])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
        switch (e.key) {
            case 'ArrowUp':
                activeIndex! > 0 && setActiveIndex(activeIndex! - 1)
                break
            case 'ArrowDown':
                if (activeIndex === null) {
                    setActiveIndex(0)
                } else if (activeIndex < 3) {
                    setActiveIndex(activeIndex + 1)
                }
                break
            case 'Enter':
                (refs.current && activeIndex) ? refs.current[activeIndex].click() : null
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
                <DropdownItem
                    as='li'
                    active={activeIndex === 0}
                    role="menuitem"
                    ref={refs.current && refs.current[0]}
                    tabIndex={-1}
                    onClick={() => { props.handlers[0]() }}
                    aria-label="Split"
                >
                    <Split fill={'currentColor'} /> Split
                </DropdownItem>
                <DropdownItem
                    as='li'
                    role="menuitem"
                    onClick={() => { props.handlers[1]() }}
                    tabIndex={-1}
                    aria-label="Details"
                >
                    <DetailsIcon fill={'currentColor'} />
                    Details
                </DropdownItem>
            </ul>
        </div>
    )
}

export default ItemOptionsMenu
