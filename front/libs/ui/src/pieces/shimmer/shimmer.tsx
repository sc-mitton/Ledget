import { FC, HTMLProps } from 'react'

import './shimmer.scss';
import { useTransition, animated } from '@react-spring/web'
import { TextInputWrapper } from '../../inputs/text/text'
import { useColorScheme } from '../../utils/hooks/use-color-scheme/use-color-scheme'
import React from 'react';


interface ShimmerProps {
  shimmering?: boolean
  lightness?: number
  darkMode?: boolean
}

export const Shimmer = (props: ShimmerProps) => {
  const { shimmering = false, lightness = 90, darkMode = false } = props
  const transitions = useTransition(shimmering, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })
  const { isDark } = useColorScheme()

  return (
    <>
      {transitions(
        (styles, item) => item &&
          <animated.div
            style={styles}
            className="loading-shimmer"
          >
            <div
              className={`shimmer ${isDark ? 'dark-mode' : ''}`}
              style={{ '--shimmer-lightness': `${(isDark || darkMode) ? 99 - lightness : lightness}%` } as React.CSSProperties}
            />
          </animated.div>
      )}
    </>
  )
}

interface ColoredShimmerProps extends ShimmerProps {
  length?: number
  color?: 'blue' | 'green'
  style?: React.CSSProperties
}

export const ColoredShimmer = (props: ColoredShimmerProps) => {

  const {
    shimmering = false,
    length = 12,
    color = 'blue',
    style = {},
    lightness,
    darkMode,
    ...rest
  } = props

  return (
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
          darkMode={darkMode}
        />
      </div>
    </>
  )
}

export const ShimmerText = (props: Omit<ColoredShimmerProps, 'color'>) => {
  const {
    shimmering = false,
    length = 12,
    style = {} as React.CSSProperties,
    darkMode,
    ...rest
  } = props

  return (
    <>
      <div
        style={{
          width: `${length}ch`,
          height: '2.5ch',
          margin: '2px 0',
          borderRadius: 'var(--border-radius1)',
          backgroundColor: 'var(--inner-window)',
          position: 'relative',
          ...style,
        }}
      >
        <Shimmer shimmering={shimmering} darkMode={darkMode} {...rest} />
      </div>
    </>
  )
}

type TransactionShimmerProps = HTMLProps<HTMLDivElement> & Omit<ColoredShimmerProps, 'color'>

export const TransactionShimmer = ({ shimmering = true, ...rest }: TransactionShimmerProps) => (
  <>
    <div >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.125em' }}>
        <ShimmerText length={25} shimmering={shimmering} {...rest} />
        <ShimmerText length={10} shimmering={shimmering}  {...rest} />
      </div>
      <div>
        <ShimmerText length={10} shimmering={shimmering}  {...rest} />
      </div>
    </div>
  </>
)

type ShimmerDivProps =
  HTMLProps<HTMLDivElement> &
  Pick<ShimmerProps, 'shimmering' | 'lightness' | 'darkMode'> &
  { background?: string }

export const ShimmerDiv = (props: ShimmerDivProps) => {
  const {
    shimmering,
    background,
    children,
    style = {},
    lightness = 90,
    darkMode,
    ...rest
  } = props

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
      <Shimmer shimmering={shimmering} lightness={lightness} darkMode={darkMode} />
      {!shimmering && children}
    </div>
  )
}

export const InputShimmerDiv = (props: Pick<ShimmerDivProps, 'darkMode'>) => {

  return (
    <TextInputWrapper>
      <span style={{ color: 'transparent' }}>Shimmering</span>
      <div className='block-shimmer--container'>
        <ShimmerDiv shimmering={true} lightness={88} darkMode={props.darkMode} />
      </div>
    </TextInputWrapper>
  )
}

export const TranslucentShimmerDiv = (props: Pick<ShimmerDivProps, 'darkMode'>) => (
  <div className="translucent-shimmer--container">
    <ShimmerDiv shimmering={true} darkMode={props.darkMode} />
  </div>
)
