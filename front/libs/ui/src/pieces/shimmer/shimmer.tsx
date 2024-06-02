import { HTMLProps, forwardRef } from 'react'

import stylesModule from './shimmer.module.scss';
import { useTransition, animated } from '@react-spring/web'
import { TextInputWrapper } from '../../inputs/text/text'
import { useColorScheme } from '../../themes/hooks/use-color-scheme/use-color-scheme'
import React from 'react';


interface ShimmerProps {
  shimmering?: boolean
  lightness?: number
  darkMode?: boolean
  shimmerColor?: string
}

export const Shimmer = (props: ShimmerProps) => {
  const { shimmering = false, lightness = 94, shimmerColor, darkMode = false } = props
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
            className={stylesModule.loadingShimmer}
          >
            <div
              className={stylesModule.shimmer}
              style={{
                '--shimmer-color': shimmerColor
                  ? shimmerColor
                  : isDark || darkMode
                    ? `hsl(var(--window-h), 0%, ${99 - lightness}%)`
                    : `hsl(var(--window-h), 0%, ${lightness}%)`
              } as React.CSSProperties}
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
  className?: string
}

export const ColoredShimmer = (props: ColoredShimmerProps) => {

  const {
    shimmering = false,
    length = 12,
    color = 'blue',
    style = {},
    lightness,
    darkMode,
    className,
    ...rest
  } = props

  return (
    <>
      <div
        {...rest}
        data-color={color}
        className={stylesModule.coloredLoadingShimmer}
        style={{
          width: '100%',
          height: '1.25em',
          margin: '.75em 0',
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

export const ShimmerText = (props: Omit<ColoredShimmerProps, 'color'> & { backgroundColor?: string }) => {
  const {
    shimmering = false,
    length = 12,
    style = {} as React.CSSProperties,
    backgroundColor,
    darkMode,
    ...rest
  } = props

  return (
    <>
      <div
        style={{
          width: `${length}ch`,
          fontSize: 'inherit',
          height: '1em',
          margin: '2px 0',
          borderRadius: '.375em',
          backgroundColor: backgroundColor || 'var(--shimmer-text-background)',
          position: 'relative',
          ...style,
        }}
      >
        <Shimmer shimmering={shimmering} darkMode={darkMode} {...rest} />
      </div>
    </>
  )
}

// export const ShimmerTextDiv = (props: HTMLProps<HTMLDivElement> & Omit<ColoredShimmerProps, 'color'>) => {
export const ShimmerTextDiv = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & Omit<ColoredShimmerProps, 'color'>>((props, ref) => {
  const {
    shimmering = false,
    length = 12,
    style = {} as React.CSSProperties,
    darkMode,
    children,
    ...rest
  } = props

  return (
    <div {...rest}>
      <>
        {shimmering
          ?
          <div
            style={{
              width: `${length}ch`,
              fontSize: 'inherit',
              height: '1em',
              margin: '2px 0',
              borderRadius: 'var(--border-radius1)',
              backgroundColor: 'var(--shimmer-text-background)',
              position: 'relative',
              ...style,
            }}
          >
            <Shimmer shimmering={shimmering} darkMode={darkMode} {...rest} />
          </div>
          : children
        }
      </>
    </div>
  )
})

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
  Pick<ShimmerProps, 'shimmering' | 'lightness' | 'darkMode' | 'shimmerColor'> &
  { background?: string }

export const ShimmerDiv = (props: ShimmerDivProps) => {
  const {
    shimmering,
    background,
    shimmerColor,
    children,
    style = {},
    lightness = 94,
    darkMode,
    ...rest
  } = props

  return (
    <div
      className={stylesModule.loadingShimmerContainer}
      style={{
        position: 'relative',
        ...(background && shimmering ? { backgroundColor: background } : {}),
        ...style,
      }}
      {...rest}
    >
      <Shimmer shimmering={shimmering} lightness={lightness} darkMode={darkMode} shimmerColor={shimmerColor} />
      {!shimmering && children}
    </div>
  )
}

export const InputShimmerDiv = (props: Pick<ShimmerDivProps, 'darkMode'>) => {

  return (
    <TextInputWrapper>
      <span style={{ color: 'transparent' }}>Shimmering</span>
      <div className={stylesModule.blockShimmerContainer}>
        <ShimmerDiv shimmering={true} lightness={94} darkMode={props.darkMode} />
      </div>
    </TextInputWrapper>
  )
}

export const TranslucentShimmerDiv = (props: Pick<ShimmerDivProps, 'darkMode'>) => (
  <div className={stylesModule.translucentShimmerDiv}>
    <ShimmerDiv shimmering={true} data-dark={props.darkMode} />
  </div>
)
