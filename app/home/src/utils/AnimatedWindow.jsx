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
        from: { opacity: 0 },
        enter: { opacity: 1, ...style },
        leave: { opacity: 0 },
        config: { duration: 300 },
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
