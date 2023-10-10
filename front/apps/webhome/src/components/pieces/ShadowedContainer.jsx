import { useRef, useState, useEffect } from 'react'

import './styles/ShadowedContainer.css'
import { useTransition, animated } from '@react-spring/web'

const useShadowTransition = ({ location, direction, visible }) => {
    const styles = {
        top: {
            top: '0',
            background: `linear-gradient(180deg, var(--scroll-shadow))`,
        },
        bottom: {
            bottom: '0',
            background: `linear-gradient(0deg, var(--scroll-shadow))`,
        }
    }

    const transitions = useTransition(visible, {
        from: { opacity: 0 },
        enter: {
            zIndex: 2,
            opacity: 1,
            position: "absolute",
            height: '40px',
            left: 0,
            right: 0,
            ...styles[location]
        },
        leave: { opacity: 0 },
        config: { duration: 100 }
    })

    return transitions
}

const ShadowedContainer = (props) => {
    const { showShadow = true, children, onScroll, direction, ...rest } = props

    const ref = useRef(null)
    const [bottomShadow, setBottomShadow] = useState(false)
    const [topShadow, setTopShadow] = useState(false)

    const bottomTransitions = useShadowTransition({
        location: 'bottom',
        visible: showShadow && bottomShadow,
        direction: direction
    })
    const topTransitions = useShadowTransition({
        location: 'top',
        visible: showShadow && topShadow,
        direction: direction
    })

    const handleScroll = (e) => {
        onScroll && onScroll(e)
        setBottomShadow((e.target.scrollTopMax - e.target.scrollTop) !== 0)
        setTopShadow(e.target.scrollTop !== 0)
    }

    // Effects for listening to resize and scroll events to set
    // the shadows correctly
    useEffect(() => {
        ref.current?.firstChild.addEventListener('scroll', handleScroll)

        const observer = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.target.style.overflowY === 'hidden') {
                    setBottomShadow(false)
                    setTopShadow(false)
                } else {
                    setBottomShadow(entry.target.clientHeight < entry.target.scrollHeight)
                }
            })
        })
        ref.current?.firstChild && observer.observe(ref.current?.firstChild)

        return () => {
            ref.current?.firstChild.removeEventListener('scroll', handleScroll)
            observer.disconnect()
        }
    }, [showShadow])

    useEffect(() => {
        const setBottomShadowDelayed = () => {
            if (ref.current?.firstChild.scrollHeight !== ref.current?.firstChild.clientHeight) {
                setBottomShadow(true)
            } else if ((ref.current?.firstChild.scrollTopMax - ref.current?.firstChild.scrollTop) !== 0) {
                setBottomShadow(true)
            } else {
                setBottomShadow(false)
            }
        }
        let timeoutId = setTimeout(setBottomShadowDelayed, 200)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [showShadow])

    return (
        <div
            className="scroll-shadows--container"
            ref={ref}
            {...rest}
        >
            {children}
            {bottomTransitions((style, item) =>
                item && <animated.div style={style} />
            )}
            {topTransitions((style, item) =>
                item && <animated.div style={style} />
            )}
        </div>
    )
}

export default ShadowedContainer
