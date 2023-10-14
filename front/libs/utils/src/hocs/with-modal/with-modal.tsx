import React, { useRef, useState } from 'react'
import { useTransition, animated } from '@react-spring/web'

import './with-modal.css'
import { useAccessEsc } from '../../hooks/use-access-esc/use-access-esc'
import { CloseButton } from '@ledget/ui'

export interface IWithModal {
  onClose?: () => void
  hideAll?: boolean
  hideModal?: boolean
  hasOverlay?: boolean
  hasExit?: boolean
  overLayExit?: boolean
  focusOnMount?: boolean
  width?: string
  minWidth?: string
  maxWidth?: string
  zIndex?: number
  blur?: number
  style?: React.CSSProperties
}

export function withModal(WrappedComponent: React.FC<any>) {
  return (props: IWithModal) => {
    const {
      onClose = () => { },
      hideAll = false,
      hideModal = false,
      hasOverlay = true,
      hasExit = true,
      overLayExit = true,
      focusOnMount = true,
      width = '70%',
      minWidth = '300px',
      maxWidth = '450px',
      zIndex = 1000,
      blur = 2,
      style,
      ...rest
    } = props

    const [closeAll, setCloseAll] = useState(false)
    const modalRef = useRef(null)

    useAccessEsc({
      refs: overLayExit ? [modalRef] : [],
      visible: closeAll,
      setVisible: () => setCloseAll(true),
    })

    const backgroundConfig = {
      inset: 0,
      position: 'fixed',
      zIndex: zIndex,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: hasOverlay ? 'rgba(49, 49, 49, 0.7)' : 'transparent',
      backdropFilter: hasOverlay ? `blur(${blur}px)` : 'none',
    }

    const backgroundTransitions = useTransition(!closeAll && !hideAll, {
      from: { opacity: 0 },
      enter: { opacity: 1, ...backgroundConfig },
      leave: { opacity: 0 },
      config: { duration: 200 },
      onDestroyed: () => onClose(),
    })

    const contentConfig = {
      width: width,
      maxWidth: maxWidth,
      minWidth: minWidth,
      borderRadius: '12px',
      padding: '28px',
      zIndex: zIndex + 1,
      position: "relative",
      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
      ...style
    }

    const modalContainerTransitions = useTransition(!closeAll && !hideModal && !hideAll, {
      from: {
        opacity: 0,
        scale: 0.92,
        backgroundColor: 'var(--window)',
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

    return (
      <>
        {backgroundTransitions((opacityStyles: any, item1: boolean) =>
          item1 && (
            <animated.div
              className="modal"
              style={opacityStyles}
              aria-modal="true"
              {...rest}
            >
              {modalContainerTransitions((scaleStyles: any, item2: boolean) =>
                item2 && (
                  <animated.div
                    className="modal-content"
                    style={scaleStyles}
                    ref={modalRef}
                  >
                    {hasExit &&
                      <CloseButton
                        onClick={() => setCloseAll(true)}
                        aria-label="Close modal"
                        style={{ zIndex: zIndex + 2 }}
                      />
                    }
                    <WrappedComponent
                      {...rest}
                      closeModal={() => setCloseAll(true)}
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
