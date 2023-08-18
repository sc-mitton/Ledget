import React, { forwardRef, useRef, useState, useEffect } from 'react'

import { useTransition, animated } from '@react-spring/web'

const useShadowTransition = ({ location, visible }) => {
    const styles = {
        top: {
            top: '0',
            background: `-webkit-linear-gradient(180deg, rgba(248, 248, 248), transparent)`,
            background: `linear-gradient(180deg, rgba(248, 248, 248), transparent)`
        },
        bottom: {
            bottom: '0',
            background: `-webkit-linear-gradient(0deg, rgba(248, 248, 248), transparent)`,
            background: `linear-gradient(0deg, rgba(248, 248, 248), transparent)`
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
    const { showShadow = true, children, style, ...rest } = props

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

    useEffect(() => {
        const handleScroll = (e) => {
            setBottomShadow((e.target.scrollTopMax - e.target.scrollTop) !== 0)
            setTopShadow(e.target.scrollTop !== 0)
        }
        ref.current?.firstChild.addEventListener('scroll', handleScroll)
        return () => {
            ref.current?.firstChild.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // Add resize listener to ref first child
    useEffect(() => {
        const handleResize = (e) => {
            setBottomShadow((e.target.scrollTopMax - e.target.scrollTop) !== 0)
            setTopShadow(e.target.scrollTop !== 0)
        }
        ref.current?.firstChild.addEventListener('resize', handleResize)
        return () => {
            ref.current?.firstChild.removeEventListener('resize', handleResize)
        }
    }, [])

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
                item && <animated.div style={style} className="shadow" />
            )}
            {topTransitions((style, item) =>
                item && <animated.div style={style} className="shadow" />
            )}
            {children}
        </div>
    )
}

export default ShadowedContainer
