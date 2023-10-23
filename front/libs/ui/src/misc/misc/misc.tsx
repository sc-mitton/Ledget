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
  data: string;
  alt: string;
  backgroundColor?: string;
  style?: React.CSSProperties;
}

export const Base64Logo = (props: Base64LogoProps) => {
  const { data, backgroundColor, alt, style, ...rest } = props

  const config = {
    filter: 'grayscale(1)',
    padding: '2px 2px',
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
    <div
      style={{ textAlign: 'end', ...style }}
      {...rest}
    >
      <span style={{ fontSize: 'inherit' }}>
        {`${isDebit ? '+' : ''}${str.split('.')[0]}`}
      </span>
      {hasCents &&
        <span style={{ fontSize: '.7em' }}>
          {`.${str.split('.')[1]}`}
        </span>}
    </div>
  )
}

export const DollarCentsRange = ({ lower = 0, upper = 0 }) => (
  <>
    {lower && <DollarCents value={lower} />}
    {lower && <span>&nbsp;&nbsp;&ndash;&nbsp;&nbsp;</span>}
    <DollarCents value={upper} />
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
          stroke='rgb(var(--charcoal-rgb), .1)'
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
          stroke={value > 1 ? `rgb(var(--red-rgb), ${Math.min(value + 1, 5) / 5})` : 'var(--green-dark3)'}
          fill="transparent"
          transform="rotate(-90 18 18)"
          strokeLinecap='round'
          strokeDasharray={`${value ? parseFloat((value % 1).toFixed(2)) * 88 : 0}, 88`}
        />
      </svg>
    </div>
  </div>
)


