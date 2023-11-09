import { FC, useRef, useState, useEffect } from 'react'

import './styles/ShadowedContainer.css'

const getMaskImage = (string: 'top' | 'bottom' | 'bottom-top' | '') => {
    switch (string) {
        case 'top':
            return 'linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 0px), transparent)'
        case 'bottom':
            return 'linear-gradient(to bottom, transparent 0%, black 0px, black calc(100% - 16px), transparent)'
        case 'bottom-top':
            return 'linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 16px), transparent)'
        default:
            return ''
    }
}

interface I {
    showShadow?: boolean
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void
}

const ShadowedContainer: FC<React.HTMLAttributes<HTMLDivElement & I>> = ({ children, ...rest }) => {
    const [shadow, setShadow] = useState<'top' | 'bottom' | 'bottom-top' | ''>('')
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleScroll = (e: Event) => {
            if (ref.current?.firstChild) {
                const { scrollTop, scrollHeight, offsetHeight } = e.target as HTMLDivElement;
                // Update shadow based on scroll position
                if (scrollTop === 0 && scrollHeight === offsetHeight) {
                    setShadow('')
                } else if (scrollTop === 0 && scrollHeight > offsetHeight) {
                    setShadow('bottom')
                } else if (scrollTop > 0 && scrollTop + offsetHeight < scrollHeight) {
                    setShadow('bottom-top')
                } else if (scrollTop + offsetHeight === scrollHeight) {
                    setShadow('top')
                }
            }
        }

        if (ref.current?.firstChild) {
            ref.current?.firstChild.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (ref.current?.firstChild) {
                ref.current?.firstChild.removeEventListener('scroll', handleScroll);
            }
        }
    }, [])

    return (
        <div
            className="scroll-shadows--container"
            {...rest}
            style={{ maskImage: getMaskImage(shadow) }}
            ref={ref}
        >
            {children}
        </div>
    )
}

export default ShadowedContainer
