import React, { useRef, useState, useEffect } from 'react'
import { useTransition, animated } from '@react-spring/web'

import './modal.css'
import Close from '../../assets/svg/Close'


function withModal(WrappedComponent) {
    return function WithModal(props) {
        const [visible, setVisible] = useState(true)
        const modalRef = useRef(null)
        const [hideModal, setHideModal] = useState(false)
        const {
            cleanUp = () => { },
            background = 'rgba(49, 49, 49, 0.85)',
            hasExit = true,
        } = props

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
            background: background,
            backdropFilter: 'blur(5px)',
        }

        const backgroundTransitions = useTransition(visible, {
            from: { opacity: 0 },
            enter: { opacity: 1, ...modalConfig },
            leave: { opacity: 0 },
            config: { duration: 300 },
            onDestroyed: () => cleanUp(),
        })

        const contentConfig = {
            width: "70%",
            maxWidth: "400px",
            top: "-10%",
            borderRadius: '6px',
            padding: '28px',
            zIndex: 301,
            position: "relative"
        }

        const modalContainerTransitions = useTransition(visible, {
            from: {
                opacity: 0,
                scale: 0.95,
                ...contentConfig
            },
            enter: {
                opacity: 1,
                scale: 1,
                backgroundColor: hideModal
                    ? 'transparent'
                    : 'var(--window-background-color)',
                ...contentConfig,
            },
            update: {
                backgroundColor: hideModal
                    ? 'transparent'
                    : 'var(--window-background-color)',
            },
            leave: { opacity: 0 },
            config: { duration: 300 },
        })

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
                                        {!hideModal && hasExit && <Exit />}
                                        <WrappedComponent
                                            {...props}
                                            setVisible={setVisible}
                                            setHideModal={setHideModal}
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
