import { useEffect, useState, useRef } from 'react'

import { useTransition, animated, useSpringRef } from '@react-spring/web';
import Color from 'color';

import './misc.scss'
import { formatCurrency } from '../../utils/funcs'

function getContrastColor(bgColor: string | undefined) {
  const color = Color(bgColor);
  const whiteContrast = color.contrast(Color('white'));
  const blackContrast = color.contrast(Color('black'));

  return whiteContrast > blackContrast ? 'white' : 'black';
}

interface Base64LogoProps {
  data: string | undefined;
  alt: string | undefined;
  backgroundColor?: string;
  style?: React.CSSProperties;
}

export const Base64Logo = (props: Base64LogoProps) => {
  const { data, backgroundColor, alt, style, ...rest } = props

  const config = {
    filter: 'grayscale(1)',
    padding: '1px',
    backgroundColor: backgroundColor,
    borderRadius: 'var(--border-radius4)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: getContrastColor(backgroundColor),
    ...style
  }

  return (
    <div
      className='base64-image--container'
      style={config}
      {...rest}
    >
      <img
        src={`data:image/png;base64,${data}`}
        alt={alt}
      />
    </div>
  )
}

export const DollarCents = ({ value = 0, style = {}, hasCents = true, ...rest }:
  { value: string | number, isDebit?: boolean, style?: React.CSSProperties, [key: string]: any }
) => {
  const str = typeof value === 'string' ? formatCurrency(value.replace(/^-/, '')) : formatCurrency(Math.abs(value));
  const isDebit = Number(value) < 0

  return (
    <>
      <span style={{ fontSize: 'inherit' }}>
        {`${isDebit ? '+' : ''}${str.split('.')[0]}`}
      </span>
      {hasCents &&
        <span style={{ fontSize: '.75em' }}>
          {`.${str.split('.')[1]}`}
        </span>
      }
    </>
  )
}


// Value is integer like 1000 (ie 1000 = $10.00)
export const AnimatedDollarCents = ({ value = 0, hasCents = true, ...rest }:
  { value: number, hasCents?: boolean }) => {

  const [loaded, setLoaded] = useState(false)
  const [slots, setSlots] = useState<string[]>([])
  const slotRefs = useRef<{ [key: string]: string }>({})

  const slotsApi = useSpringRef()
  const transitions = useTransition(slots, {
    from: (item) => {
      const y = !isNaN(Number(slotRefs.current[item])) ? `-${100 - (Number(slotRefs.current[item]) + 1) * 10}%` : '0em'
      return {
        maxWidth: loaded ? '0ch' : '1ch',
        opacity: loaded ? 0 : 1,
        y: y,
      }
    },
    enter: (item) => {
      const y = !isNaN(Number(slotRefs.current[item])) ? `-${100 - (Number(slotRefs.current[item]) + 1) * 10}%` : '0em'
      return {
        opacity: 1,
        maxWidth: '1ch',
        y: y,
        config: { mass: 1, tension: 150, friction: 25 }
      }
    },
    update: (item) => ({
      y: !isNaN(Number(slotRefs.current[item])) ? `-${100 - (Number(slotRefs.current[item]) + 1) * 10}%` : '0em',
    }),
    leave: { maxWidth: '0ch', opacity: 0 },
    config: { mass: 1, tension: 150, friction: 25 },
    ref: slotsApi
  })

  useEffect(() => {
    let currencyVal = formatCurrency(value).replace(/^\$/, '')
    let newVal = hasCents ? currencyVal : currencyVal.split('.')[0]

    // If updating slots or upsizing (setting new slotRef values)
    if (newVal.length >= slots.length) {
      const newChars = Object.fromEntries(
        newVal.split('').slice(0, newVal.length - slots.length).map((char) =>
          [Math.random().toString(36).slice(2, 9), char]
        ))
      const updatedChars = Object.fromEntries(
        newVal.split('').slice(newVal.length - slots.length).map((char, index) =>
          [slots[index], char]
        ))

      slotRefs.current = {
        ...newChars,
        ...updatedChars
      }

      setSlots([...Object.keys({ ...newChars, ...updatedChars })])
    } else {
      // Downsizing
      const numberToRemove = slots.length - newVal.length
      const newKeys = slots.slice(numberToRemove)
      setSlots(prev => prev.slice(numberToRemove))
      slotRefs.current = Object.fromEntries(
        newVal.split('').map((char, index) =>
          [newKeys[index], char]
        ))
    }
  }, [value])

  useEffect(() => {
    let timeout = setTimeout(() => {
      setLoaded(true)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [])

  // Start animations
  useEffect(() => {
    if (slots.length == Object.keys(slotRefs.current).length) {
      slotsApi.start()
    }
  }, [slots, slotRefs.current])

  return (
    <div className={`animated-dollar ${hasCents ? 'with-cents' : ''}`}>
      <div className="slots">
        <div className='slot--container'>
          <span>$</span>
        </div>
        {transitions((style, item) => (
          <animated.div
            key={item}
            style={style}
            className='slot--container'
          >
            {'$.,'.includes(slotRefs.current[item])
              ?
              <span>{slotRefs.current[item]}</span>
              :
              <>
                <span>9</span>
                <span>8</span>
                <span>7</span>
                <span>6</span>
                <span>5</span>
                <span>4</span>
                <span>3</span>
                <span>2</span>
                <span>1</span>
                <span>0</span>
              </>
            }
          </animated.div>
        ))}
      </div>
      <span>
        {`${formatCurrency(value).split('.')[0]}`}
      </span>
      {hasCents &&
        <span>
          {`.${formatCurrency(value).split('.')[1]}`}
        </span>
      }
    </div>
  )
}

export const DollarCentsRange = ({ lower = 0, upper = 0 }) => (
  <>
    {lower && <div><DollarCents value={lower} /></div>}
    {lower && <span>&nbsp;&nbsp;&ndash;&nbsp;&nbsp;</span>}
    <div><DollarCents value={upper} /></div>
  </>
)

export const StaticProgressCircle = ({
  value = 0,
  size = '1.1rem',
  strokeWidth = 5,
  noProgress = false
}) => (
  <div className="progress-circle--container" style={{ width: size, height: size }}>
    <div className="progress-circle--svg">
      <svg viewBox="0 0 36 36" style={{ width: size, height: size }}>
        <circle
          className="progress-circle--background"
          cx="18"
          cy="18"
          r="14"
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          transform="rotate(-90 18 18)"
          fill="transparent"
        />
        <circle
          className="progress-circle--foreground"
          cx="18"
          cy="18"
          r="14"
          strokeWidth={noProgress ? 0 : strokeWidth}
          fill="transparent"
          transform="rotate(-90 18 18)"
          strokeLinecap='round'
          strokeDasharray={`${value ? parseFloat((Math.min(1, value)).toFixed(2)) * 88 : 0}, 88`}
        />
      </svg>
    </div>
  </div>
)


