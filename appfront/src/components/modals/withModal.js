import React, { useRef, useEffect, useState } from 'react'
import { useTransition, animated } from '@react-spring/web'

import './modal.css'
import Close from '../../assets/images/Cancel'

const modalConfig = {
    width: '100vw',
    height: '100vh',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'fixed',
    zIndex: 300,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(49, 49, 49, 0.85)',
    backdropFilter: 'blur(4px)'
}

const contentConfig = {
    top: "-10%",
    backgroundColor: 'var(--window-background-color)',
    width: '40%',
    maxWidth: '350px',
    borderRadius: '6px',
    padding: '28px',
    zIndex: 301,
    position: "relative"
}

function withModal(WrappedComponent) {
    return function WithModal(props) {
        const modalRef = useRef(null)
        const [visible, setVisible] = useState(true)

        // useEffect(() => {
        //     function handleClickOutside(event) {
        //         if (modalRef.current && !modalRef.current.contains(event.target)) {
        //             setVisible(false);
        //         }
        //     }
        //     document.addEventListener('mousedown', handleClickOutside);
        //     return () => {
        //         document.removeEventListener('mousedown', handleClickOutside);
        //     };
        // }, [modalRef])

        const opacityTransitions = useTransition(visible, {
            from: { opacity: 0 },
            enter: { opacity: 1, ...modalConfig },
            leave: { opacity: 0 },
            onDestroyed: () => props.cleanUp(),
        });

        const scaleTransitions = useTransition(visible, {
            from: { scale: 0.9 },
            enter: { scale: 1, ...contentConfig },
            leave: { scale: 0.9 },
        })

        const Exit = () => {
            return (
                <div className="exit-button icon" onClick={() => setVisible(false)}>
                    <Close />
                </div>
            )
        }

        return (
            <>
                {opacityTransitions((opacityStyles, item1) =>
                    item1 && (
                        <animated.div className="modal" style={opacityStyles}>
                            {scaleTransitions((scaleStyles, item2) =>
                                item2 && (
                                    <animated.div
                                        className="modal-content"
                                        style={scaleStyles}
                                        ref={modalRef}
                                    >
                                        <Exit />
                                        <WrappedComponent {...props} setVisible={setVisible} />
                                    </animated.div>
                                )
                            )}
                        </animated.div>
                    )
                )}
            </>
        )
    }
}

export default withModal;
