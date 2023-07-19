import React, { useRef, useState, useEffect } from 'react'
import { useTransition, animated } from '@react-spring/web'

import './modal.css'
import Close from '../../assets/svg/Close'


function withModal(WrappedComponent) {
    return function WithModal(props) {
        const [visible, setVisible] = useState(true)
        const modalRef = useRef(null)
        const exitRef = useRef(null)

        useEffect(() => {
            // Add event listener for clickingoutside of modal
            const handleClickOutside = (event) => {
                if (modalRef.current && !modalRef.current.contains(event.target)) {
                    setVisible(false)
                }
            }
            const handleEscape = (event) => {
                if (event.key === "Escape") {
                    setVisible(false)
                }
            }
            window.addEventListener("keydown", handleEscape)
            window.addEventListener("mousedown", handleClickOutside)

            return () => {
                window.removeEventListener("keydown", handleEscape)
                window.removeEventListener("mousedown", handleClickOutside)
            }
        }, [])

        useEffect(() => {
            modalRef.current.focus()
            const handleKeyDown = (event) => {
                if (event.key === "Tab") {
                    event.preventDefault()
                    exitRef.current.focus()
                }
            }

            window.addEventListener("keydown", handleKeyDown)
            return () => {
                window.removeEventListener("keydown", handleKeyDown)
            }
        }, [])

        const {
            cleanUp = () => { },
            hasBackground = true,
            hasExit = true,
            width = '70%',
            maxWidth = '450px',
            zIndex = 1000,
        } = props

        const backgroundConfig = {
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'fixed',
            zIndex: zIndex,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: hasBackground ? 'rgba(49, 49, 49, 0.7)' : 'transparent',
            backdropFilter: hasBackground ? 'blur(5px)' : 'none'
        }

        const backgroundTransitions = useTransition(visible, {
            from: { opacity: 0 },
            enter: { opacity: 1, ...backgroundConfig },
            leave: { opacity: 0 },
            config: { duration: 200 },
            onDestroyed: () => cleanUp(),
        })

        const contentConfig = {
            width: width,
            maxWidth: maxWidth,
            borderRadius: '12px',
            padding: '28px',
            zIndex: zIndex + 1,
            position: "relative",
            backgroundColor: 'var(--window-background-color)'
        }

        const modalContainerTransitions = useTransition(visible, {
            from: {
                opacity: 0,
                scale: 0.92,
                ...contentConfig
            },
            enter: {
                opacity: 1,
                scale: 1,
                backgroundColor: 'var(--window-background-color)',
                ...contentConfig,
            },
            leave: { opacity: 0, scale: .92 },
            config: { duration: 200 },
        })

        const Exit = () => {
            return (
                <>
                    <button
                        className="exit-button icon"
                        onClick={() => setVisible(false)}
                        aria-label="Close modal"
                        style={{ zIndex: zIndex + 2 }}
                        ref={exitRef}
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
                        >
                            {modalContainerTransitions((scaleStyles, item2) =>
                                item2 && (
                                    <animated.div
                                        className="modal-content"
                                        style={scaleStyles}
                                        ref={modalRef}
                                    >
                                        {hasExit && <Exit />}
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
