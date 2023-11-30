import { FC, HTMLAttributes } from 'react'
import './loading-indicators.css'
import { useTransition, animated } from '@react-spring/web'



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
      <div className={`lds-ring ${className}`}>
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
