import { SvgProps } from 'react-native-svg'
import Svg, { Path } from "react-native-svg"

function SvgComponent(props: SvgProps & { size?: number }) {
  const { size = 94, fill = 'currentColor', stroke = 'currentColor', ...rest } = props

  return (
    <Svg
      x="0px"
      y="0px"
      viewBox="0 0 55.5 22.7"
      width={size}
      height={size}
      {...rest}
    >
      <Path
        fill={fill}
        stroke={stroke}
        strokeMiterlimit={10}
        d="M54.5 10l-1.9-2.1c-.3-.3-.7-.5-1.2-.5h-2.5c-.2 0-.4.1-.5.2l-1.3 1.3c-.3.3-.8.3-1.1 0l-1.3-1.3c-.2-.2-.3-.2-.5-.2h-1.7c-.2 0-.4.1-.5.2l-1.3 1.3c-.3.3-.8.3-1.1 0l-1.3-1.3c-.2-.2-.3-.2-.5-.2h-1.7c-.2 0-.4.1-.5.2l-1.3 1.3c-.3.3-.8.3-1.1 0l-1.3-1.3c-.2-.2-.3-.2-.5-.2h-1.7c-.2 0-.4.1-.5.2l-1.3 1.3c-.3.3-.8.3-1.1 0l-1.3-1.3c-.2-.2-.3-.2-.5-.2h-4.3L18 2.9C17.1 1.4 15.6.5 13.9.5H8.8c-1.7 0-3.2.9-4.1 2.4L1.1 9c-.9 1.5-.9 3.3 0 4.7l3.5 6.2c.8 1.5 2.4 2.4 4.1 2.4H14c1.7 0 3.2-.9 4.1-2.4l2.6-4.5h30.8c.4 0 .9-.2 1.2-.5l1.9-2.1c.6-.8.6-2-.1-2.8zM7.2 14.1c-1.5 0-2.7-1.2-2.7-2.7s1.2-2.7 2.7-2.7 2.7 1.2 2.7 2.7-1.2 2.7-2.7 2.7z"
      />
    </Svg>
  )
}

export default SvgComponent
