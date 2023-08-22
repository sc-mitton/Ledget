import React, { forwardRef, useRef, useState, useEffect } from 'react'

import { useTransition, animated } from '@react-spring/web'
import { set } from 'react-hook-form'

const useShadowTransition = ({ location, visible }) => {
    const styles = {
        top: {
            top: '0',
            background: `-webkit-linear-gradient(var(--scroll-shadow-top))`,
            background: `linear-gradient(var(--scroll-shadow-top))`
        },
        bottom: {
            bottom: '0',
            background: `-webkit-linear-gradient(var(--scroll-shadow-bottom))`,
            background: `linear-gradient(var(--scroll-shadow-bottom))`
        }
    }

    const transitions = useTransition(visible, {
        from: { opacity: 0 },
        enter: {
            width: "100%",
            height: "40px",
            zIndex: 2,
            opacity: 1,
            position: "absolute",
            left: 0,
            ...styles[location]
        },
        leave: { opacity: 0 },
        config: { duration: 100 }
    })

    return transitions
}

const ShadowedContainer = (props) => {
    const { showShadow = true, children, style, onScroll, ...rest } = props

    const ref = useRef(null)
    const [bottomShadow, setBottomShadow] = useState(false)
    const [topShadow, setTopShadow] = useState(false)


    const bottomTransitions = useShadowTransition({
        location: 'bottom',
        visible: showShadow && bottomShadow
    })
    const topTransitions = useShadowTransition({
        location: 'top',
        visible: showShadow && topShadow
    })

    const handleScroll = (e) => {
        onScroll && onScroll(e)
        setBottomShadow((e.target.scrollTopMax - e.target.scrollTop) !== 0)
        setTopShadow(e.target.scrollTop !== 0)
    }

    useEffect(() => {
        ref.current?.firstChild.addEventListener('scroll', handleScroll)

        const observer = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                setBottomShadow((entry.target.scrollTopMax - entry.target.scrollTop) !== 0)
            })
        })
        ref.current?.firstChild && observer.observe(ref.current?.firstChild)

        return () => {
            ref.current?.firstChild.removeEventListener('scroll', handleScroll)
            observer.disconnect()
        }
    }, [showShadow])

    useEffect(() => {
        let timeoutId
        const setBottomShadowDelayed = () => {
            if (showShadow) {
                setBottomShadow(ref.current?.firstChild.scrollHeight
                    !== ref.current?.firstChild.clientHeight)
            }
        }
        timeoutId = setTimeout(setBottomShadowDelayed, 200)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [showShadow])

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                ...style
            }}
            ref={ref}
            {...rest}
        >
            {bottomTransitions((style, item) =>
                item && <animated.div style={style} />
            )}
            {topTransitions((style, item) =>
                item && <animated.div style={style} />
            )}
            {children}
        </div>
    )
}

export default ShadowedContainer
