import { FC, useRef, HTMLProps, useState, useEffect } from 'react'

import './styles/ShadowedContainer.scss'

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

type ShadowedContainerProps = HTMLProps<HTMLDivElement> & {
    showShadow?: boolean;
}

const ShadowedContainer: FC<ShadowedContainerProps> = ({ children, showShadow = true, ...rest }) => {
    const [shadow, setShadow] = useState<'top' | 'bottom' | 'bottom-top' | ''>('');
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleScroll = (e: Event) => {
            if (ref.current?.firstChild) {
                const { scrollTop, scrollHeight, offsetHeight } = e.target as HTMLDivElement;
                // Update shadow based on scroll position
                if (scrollTop === 0 && scrollHeight === offsetHeight) {
                    setShadow('');
                } else if (scrollTop === 0 && scrollHeight > offsetHeight) {
                    setShadow('bottom');
                } else if (scrollTop > 0 && scrollTop + offsetHeight < scrollHeight) {
                    setShadow('bottom-top');
                } else if (scrollTop + offsetHeight === scrollHeight) {
                    setShadow('top');
                }
            }
        };

        if (ref.current?.firstChild) {
            ref.current?.firstChild.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (ref.current?.firstChild) {
                ref.current?.firstChild.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <div
            className="scroll-shadows--container"
            {...rest}
            style={{ maskImage: showShadow ? getMaskImage(shadow) : '' }}
            ref={ref}
        >
            {children}
        </div>
    );
};

export default ShadowedContainer
