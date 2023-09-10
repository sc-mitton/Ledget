import React, { useRef, useState } from 'react'
import { useTransition, animated } from '@react-spring/web'

import './modal.css'
import useAccessEsc from '../hooks/useAccessEsc'
import { CloseButton } from '@ledget/shared-ui'

function withModal(WrappedComponent) {
    return (props) => {
        const {
            cleanUp = () => { },
            hasBackground = true,
            hasExit = true,
            width = '70%',
            minWidth = '300px',
            maxWidth = '450px',
            zIndex = 1000,
            blur = 4,
            style,
            ...rest
        } = props

        const [visible, setVisible] = useState(true)
        const modalRef = useRef(null)
        const exitRef = useRef(null)

        useAccessEsc({
            refs: [modalRef],
            visible: visible,
            setVisible: setVisible,
        })

        const backgroundConfig = {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            zIndex: zIndex,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: hasBackground ? 'rgba(49, 49, 49, 0.7)' : 'transparent',
            backdropFilter: hasBackground ? `blur(${blur}px)` : 'none'
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
            minWidth: minWidth,
            borderRadius: '12px',
            padding: '28px',
            zIndex: zIndex + 1,
            position: "relative",
            backgroundColor: 'var(--window-background-color)',
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            ...style
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
                <CloseButton
                    ref={exitRef}
                    onClick={() => setVisible(false)}
                    aria-label="Close modal"
                    style={{ zIndex: zIndex + 2 }}
                />
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
                            {...rest}
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
                                            visible={visible}
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
