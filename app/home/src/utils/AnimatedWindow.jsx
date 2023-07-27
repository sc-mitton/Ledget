import React from 'react';
import { useTransition, animated } from '@react-spring/web';

const AnimatedWindow = ({ children, ...rest }) => {

    const style = {
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        borderRadius: "12px",
        padding: "12px 20px",
        boxSizing: "border-box",
    }

    const transitions = useTransition(true, {
        from: { opacity: 0, transform: 'scale(1)' },
        enter: { opacity: 1, transform: 'scale(1)', ...style },
        leave: { opacity: 0, transform: 'scale(1)' },
        config: {
            friction: 24,
            tension: 100
        },
    })

    return transitions((styles, item) =>
        item && (
            <animated.div
                style={styles}
                {...rest}
            >
                {children}
            </animated.div>
        )
    )
}

export default AnimatedWindow;
