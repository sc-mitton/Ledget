import Color from 'color';

import './misc.css'
import { formatCurrency } from '../../utils/funcs'

function getContrastColor(bgColor: string | undefined) {
  const color = Color(bgColor);
  const whiteContrast = color.contrast(Color('white'));
  const blackContrast = color.contrast(Color('black'));

  return whiteContrast > blackContrast ? 'white' : 'black';
}

interface Base64ImageProps {
  data: string;
  alt: string;
  backgroundColor?: string;
  style?: React.CSSProperties;
}

export const Base64Image = (props: Base64ImageProps) => {
  const { data, backgroundColor, alt, style, ...rest } = props

  const config = {
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

export const DollarCents = ({ value = 0, style = {}, ...rest }:
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
      <span style={{ fontSize: '.7em' }}>
        {`.${str.split('.')[1]}`}
      </span>
    </div>
  )
}

export const DollarCentsRange = ({ lower = 0, upper = 0 }) => {

  return (
    <>
      {lower && <DollarCents value={lower} />}
      {lower && <span>&nbsp;&nbsp;&ndash;&nbsp;&nbsp;</span>}
      <DollarCents value={upper} />
    </>
  )
}
