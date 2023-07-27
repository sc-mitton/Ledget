import React from 'react'

import { useTransition, animated } from '@react-spring/web'

const Shadow = ({ visible, location }) => {
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
            height: "24px",
            zIndex: 2,
            opacity: 1,
            position: "absolute",
            left: 0,
            ...styles[location]
        },
        leave: { opacity: 0 },
        config: { duration: 100 }
    })

    return (
        <>
            {transitions((style, item) =>
                item && <animated.div style={style} className="shadow" />
            )}
        </>
    )
}

export default Shadow
