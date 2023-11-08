import './shimmer.css';

import { useTransition, animated } from '@react-spring/web'
import { TextInputWrapper } from '../../inputs/text/text'


export const Shimmer = ({ shimmering = false, lightness = 90, ...rest }) => {
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
            {...rest}
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

export const ColoredShimmer = ({
  shimmering = false,
  length = 12,
  color,
  style = {} as React.CSSProperties,
  ...rest
}: {
  color: 'blue' | 'green'
  shimmering?: boolean,
  length?: number,
  lightness?: number,
  style?: React.CSSProperties,
}) => (
  <>
    <div
      {...rest}
      className={`colored-loading-shimmer ${color}`}
      style={{
        width: '100%',
        height: '2.25em',
        margin: '2px 0',
        borderRadius: 'var(--border-radius1)',
        position: 'relative',
        ...style,
      }}
    >
      <Shimmer
        shimmering={shimmering}
        lightness={0} // unused
      />
    </div>
  </>
)

export const ShimmerText = ({
  shimmering = false,
  length = 12,
  lightness = 90,
  style = {} as React.CSSProperties,
  ...rest
}) => (
  <>
    <div
      {...rest}
      style={{
        width: `${length}ch`,
        height: '2.5ch',
        margin: '2px 0',
        borderRadius: 'var(--border-radius1)',
        backgroundColor: 'var(--icon-light-gray)',
        position: 'relative',
        ...style,
      }}
    >
      <Shimmer shimmering={shimmering} lightness={lightness} />
    </div>
  </>
)

export const TransactionShimmer: React.FC<React.HTMLProps<HTMLDivElement> & { shimmering?: boolean }> = ({ shimmering = true, ...rest }) => (
  <>
    <div {...rest}>
      <div>
        <ShimmerText lightness={90} shimmering={shimmering} length={25} />
        <ShimmerText lightness={90} shimmering={shimmering} length={10} />
      </div>
      <div>
        <ShimmerText lightness={90} shimmering={shimmering} length={10} />
      </div>
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

export const InputShimmerDiv = ({ id, className }: { id?: string, className?: string }) => {

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
