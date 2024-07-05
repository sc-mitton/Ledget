import * as React from "react"
import Svg, { G, Path, SvgProps } from "react-native-svg"

function SvgComponent(props: SvgProps & { size: number }) {
  const { fill = 'currentColor', size, ...rest } = props

  return (
    <Svg
      x="0px"
      y="0px"
      viewBox="0 0 71.2 120.7"
      width={size}
      height={size}
      {...rest}
    >
      <Path
        fill={fill}
        d="M61.4 0H9.8C4.4 0 0 4.4 0 9.8v101.1c0 5.4 4.4 9.8 9.8 9.8h51.6c5.4 0 9.7-4.4 9.8-9.7V9.8c0-5.4-4.4-9.8-9.8-9.8zm6.7 109.3c0 4.7-3.7 8.5-8.3 8.5H11.3c-4.6 0-8.3-3.7-8.3-8.5v-98c0-4.7 3.7-8.5 8.3-8.5h48.4c4.6 0 8.3 3.7 8.3 8.5v98z"
      />
      <Path
        fill={fill}
        d="M35.6 17.8c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zM19 63.2c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5c0 1.3-1.1 2.5-2.5 2.5zM30 63.2c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5c0 1.3-1.1 2.5-2.5 2.5zM41 63.2c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5c0 1.3-1.1 2.5-2.5 2.5zM52 63.2c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5c0 1.3-1.1 2.5-2.5 2.5z"
      />
    </Svg>
  )
}

export default SvgComponent
