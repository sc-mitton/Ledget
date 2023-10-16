
import './loading-indicators.css'
import { useTransition, animated } from '@react-spring/web'



export const LoadingRing = ({ visible = false, className = '' }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: visible ? 'block' : 'none',
        color: 'inherit'
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

export const LoadingRingDiv = ({ loading = false, style = {}, children, ...rest }:
  { loading: boolean, style: React.CSSProperties, children: React.ReactNode }) => {
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
