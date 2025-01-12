import React, { FC, useRef, useState, useEffect } from 'react';
import { useTransition, animated } from '@react-spring/web';

import styles from './styles.module.scss';
import { CloseButton } from '../../buttons/specialty-buttons';
import { useColorScheme } from '../../themes/hooks/use-color-scheme/use-color-scheme';
import { useCloseDropdown } from '../../utils/hooks';

export interface WithModalI {
  onClose?: () => void;
  hideAll?: boolean;
  hideModal?: boolean;
  hasOverlay?: boolean;
  hasExit?: boolean;
  disableClose?: boolean;
  overLayExit?: boolean;
  focusOnMount?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  zIndex?: number;
  blur?: number;
  style?: React.CSSProperties;
}

export function withModal<P>(
  WrappedComponent: FC<P & { closeModal: () => void }>
) {
  return (props: WithModalI & P) => {
    const {
      onClose = () => {},
      hideAll = false,
      hideModal = false,
      hasOverlay = true,
      hasExit = true,
      disableClose = false,
      overLayExit = true,
      focusOnMount = true,
      width = '70%',
      minWidth = '18.75rem',
      maxWidth = '28rem',
      zIndex = 200,
      blur = 1,
      style,
      ...rest
    } = props;

    const [closeAll, setCloseAll] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const { isDark } = useColorScheme();

    useCloseDropdown({
      refs: overLayExit ? [modalRef] : [],
      visible: closeAll,
      setVisible: () => !disableClose && setCloseAll(true),
    });

    // Focus on mount
    useEffect(() => {
      modalRef.current?.focus();
    }, [focusOnMount]);

    const backgroundConfig = {
      inset: 0,
      position: 'fixed',
      zIndex: zIndex,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: hasOverlay ? 'rgba(50, 50, 50, 0.7)' : 'transparent',
      backdropFilter: hasOverlay ? `blur(${blur}px)` : 'none',
    };

    const backgroundTransitions = useTransition(!closeAll && !hideAll, {
      from: { opacity: 0 },
      enter: { opacity: 1, ...backgroundConfig },
      leave: { opacity: 0 },
      config: { duration: 200 },
      onDestroyed: () => onClose(),
    });

    const contentConfig = {
      width: width,
      maxWidth: maxWidth,
      minWidth: minWidth,
      borderRadius: 'var(--border-radius5)',
      padding: '28px',
      zIndex: zIndex + 1,
      position: 'relative',
      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
      ...style,
    };

    const modalContainerTransitions = useTransition(
      !closeAll && !hideModal && !hideAll,
      {
        from: {
          opacity: 0,
          scale: 0.92,
          ...contentConfig,
        },
        enter: {
          opacity: 1,
          scale: 1,
          ...contentConfig,
        },
        leave: { opacity: 0, scale: 0.92 },
        config: { duration: 200 },
      }
    );

    return (
      <>
        {backgroundTransitions(
          (opacityStyles: any, item1: boolean) =>
            item1 && (
              <animated.div style={opacityStyles} aria-modal="true" {...rest}>
                {modalContainerTransitions(
                  (scaleStyles: any, item2: boolean) =>
                    item2 && (
                      <animated.div
                        style={scaleStyles}
                        ref={modalRef}
                        className={styles.modal}
                      >
                        {hasExit && !disableClose && (
                          <CloseButton
                            onClick={() => setCloseAll(true)}
                            aria-label="Close modal"
                            style={{ zIndex: zIndex + 2 }}
                          />
                        )}
                        <WrappedComponent
                          {...(rest as P)}
                          closeModal={() => setCloseAll(true)}
                        />
                      </animated.div>
                    )
                )}
              </animated.div>
            )
        )}
      </>
    );
  };
}
