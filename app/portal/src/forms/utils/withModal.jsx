import React, { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import Close from '@assets/icons/Close'
import './modal.css'

function withModal(WrappedComponent) {
    return function WithModal(props) {
        const { visible, setVisible } = props
        const modalRef = useRef(null)
        const exitRef = useRef(null)

        useEffect(() => {
            if (visible) {
                document.addEventListener('keydown', handleTabDown)
                document.addEventListener('mousedown', handleOutsideClick)
                document.addEventListener('keydown', handleKeyDown)
            }

            return () => {
                document.removeEventListener('mousedown', handleOutsideClick)
                document.removeEventListener('keydown', handleKeyDown)
                document.removeEventListener('keydown', handleTabDown)
            }
        }, [visible])

        const handleTabDown = (event) => {
            if (event.key === 'Tab') {
                event.preventDefault()
                exitRef.current.focus()
            }
        }

        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setVisible(false)
            }
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setVisible(false)
            }
        }

        const handleExit = (e) => {
            if (e.key === 'Enter') {
                setVisible(false)
            }
        }

        const Exit = () => {
            return (
                <>
                    <div
                        className="exit-button"
                        onClick={() => setVisible(false)}
                        onFocus={() => {
                            document.addEventListener('keydown', handleExit)
                        }}
                        onBlur={() => {
                            document.removeEventListener('keydown', handleExit)
                        }}
                        aria-label="Close modal"
                        ref={exitRef}
                        tabIndex="0"
                    >
                        <Close />
                    </div>
                </>
            )
        }

        const contentConfig = {
            maxWidth: '400px',
            width: '80%'
        }

        return (
            <>
                <AnimatePresence>
                    {visible && (
                        <motion.div
                            className="modal-background"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            aria-modal="true"
                        >
                            <motion.div
                                className="modal-content"
                                initial={{ opacity: 0, scale: 0.92, ...contentConfig }}
                                animate={{ opacity: 1, scale: 1, ...contentConfig }}
                                exit={{ opacity: 0, scale: 0.92, ...contentConfig }}
                                ref={modalRef}
                            >
                                <Exit />
                                <WrappedComponent
                                    {...props}
                                    setVisible={setVisible}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </>
        )
    }
}

export default withModal
