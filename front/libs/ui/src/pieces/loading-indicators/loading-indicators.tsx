import { FC, HTMLAttributes } from 'react'
import styles from './loading-indicators.module.scss'
import { useTransition, animated } from '@react-spring/web'
import { AnimatePresence, motion } from 'framer-motion'

export const LoadingRing = ({ visible = false, style, className = '' }: { visible?: boolean, style?: React.CSSProperties, className?: string }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: visible ? 'block' : 'none',
        color: 'inherit',
        ...style
      }}
    >
      <div className={styles.ldsRing}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export const LoadingRingDiv: FC<HTMLAttributes<HTMLDivElement> & { loading: boolean, style?: React.CSSProperties, }>
  = ({ loading = false, style = {}, children, ...rest }) => {
    const transition = useTransition(!loading, {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 }
    })

    return (
      <div
        style={{ position: 'relative', ...style }}
        {...rest}
      >
        <LoadingRing visible={loading} />
        {transition((style, item) =>
          item &&
          <animated.div style={style}>
            {children}
          </animated.div>
        )}
      </div>
    )
  }

export const LoadingMessage = ({ message = 'Loading' }) => {

  return (
    <div className={styles.loadingMessage}>
      {message}
      <span /><span /><span />
    </div>
  )
}

export const WindowLoadingBar = ({ visible }: { visible: boolean }) => (
  <AnimatePresence initial={false}>
    {visible &&
      <motion.div
        className={styles.loadingBarContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 0.2 }}
      >
        <div className={styles.loadingBar}>
          <div></div>
          <div></div>
        </div>
      </motion.div>
    }
  </AnimatePresence>
)
