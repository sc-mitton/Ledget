import * as React from "react"
import Svg, { Circle, Path, SvgProps } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      id="Layer_1"
      x="0px"
      y="0px"
      viewBox="0 0 88 88"
      {...props}
    >
      <Circle cx={44} cy={44} r={38} />
      <Path d="M44 16L44 44 23.3 44" />
    </Svg>
  )
}

export default SvgComponent
