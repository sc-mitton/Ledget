import './shimmer.css';

import { useTransition, animated } from '@react-spring/web'
import { TextInputWrapper } from '../../inputs/text/text'


export const Shimmer = ({ shimmering = false, lightness = 90 }) => {
  const transitions = useTransition(shimmering, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })

  return (
    <>
      {transitions(
        (styles, item) => item &&
          <animated.div
            style={styles}
            className="loading-shimmer"
          >
            <div
              className={`shimmer`}
              style={{ '--shimmer-lightness': `${lightness}%` } as React.CSSProperties}
            />
          </animated.div>
      )}
    </>
  )
}

export const ShimmerText = ({ shimmering = false, length = 12, lightness = 90, ...rest }) => (
  <>
    <div
      {...rest}
      style={{
        width: `${length}ch`,
        height: '2.5ch',
        margin: '2px 0',
        borderRadius: 'var(--border-radius1)',
        backgroundColor: 'var(--icon-light-gray)',
        position: 'relative'
      }}
    >
      <Shimmer shimmering={shimmering} lightness={lightness} />
    </div>
  </>
)

type ShimmerDivProps = React.HTMLProps<HTMLDivElement> & {
  shimmering: boolean;
  background?: string;
}

export const ShimmerDiv: React.FC<ShimmerDivProps> = ({
  shimmering,
  background,
  children,
  style = {},
  ...rest
}) => {
  return (
    <div
      className="loading-shimmer--container"
      style={{
        position: 'relative',
        ...(background && shimmering ? { backgroundColor: background } : {}),
        ...style,
      }}
      {...rest}
    >
      <Shimmer shimmering={shimmering} />
      {!shimmering && children}
    </div>
  )
}

export const BlockShimmerDiv = ({ id, className }: { id?: string, className?: string }) => {

  return (
    <TextInputWrapper id={id} className={className}>
      <span style={{ color: 'transparent' }}>Shimmering</span>
      <div className='block-shimmer--container'>
        <ShimmerDiv shimmering={true} />
      </div>
    </TextInputWrapper>
  )
}

export const TranslucentShimmerDiv = () => (
  <div className="translucent-shimmer--container">
    <ShimmerDiv shimmering={true} />
  </div>
)
