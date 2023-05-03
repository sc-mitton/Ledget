import React, { useRef, useState, useEffect } from 'react'
import { useTransition, animated, useSpringRef } from '@react-spring/web'

import './modal.css'
import Close from '../../assets/images/Close'


function withModal(WrappedComponent) {
    return function WithModal(props) {
        const [visible, setVisible] = useState(true)
        const modalRef = useRef(null)
        const {
            cleanUp = () => { },
        } = props

        const contentConfig = {
            backgroundColor: 'var(--window-background-color)',
            width: "70%",
            maxWidth: "400px",
            top: "-10%",
            borderRadius: '6px',
            padding: '28px',
            zIndex: 301,
            position: "relative"
        }

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
            backdropFilter: 'blur(5px)',
        }

        const backgroundApi = useSpringRef()
        const backgroundTransitions = useTransition(visible, {
            ref: backgroundApi,
            from: { opacity: 0 },
            enter: { opacity: 1, ...modalConfig },
            leave: { opacity: 0 },
            config: { duration: 200 },
            onDestroyed: () => cleanUp(),
        })

        const modalContainerApi = useSpringRef()
        const modalContainerTransitions = useTransition(visible, {
            ref: modalContainerApi,
            from: { scale: 0.95, ...contentConfig },
            enter: { scale: 1, ...contentConfig },
            leave: { opacity: 0 },
            config: { duration: 300 },
        })

        useEffect(() => {
            modalRef.current.focus()
            backgroundApi.start()
            modalContainerApi.start()
        }, [visible])

        const Exit = () => {
            return (
                <>
                    <button
                        className="exit-button icon"
                        onClick={() => setVisible(false)}
                        aria-label="Close modal"
                        tabIndex="0"
                    >
                        <Close />
                    </button>
                </>
            )
        }

        return (
            <>
                {backgroundTransitions((opacityStyles, item1) =>
                    item1 && (
                        <animated.div
                            className="modal"
                            style={opacityStyles}
                            aria-modal="true"
                            ref={modalRef}
                        >
                            {modalContainerTransitions((scaleStyles, item2) =>
                                item2 && (
                                    <animated.div
                                        className="modal-content"
                                        style={scaleStyles}
                                    >
                                        <Exit />
                                        <WrappedComponent
                                            {...props}
                                            setVisible={setVisible}
                                        />
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

export default withModal
