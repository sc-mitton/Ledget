import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: style */

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      id="Layer_1"
      x="0px"
      y="0px"
      viewBox="0 0 88 88"
      {...props}
    >
      <Path
        d="M71 32.4c0-14.9-12.1-27-27-27s-27 12.1-27 27c0 7.3 3 14.2 7.8 19 2.4 2.4 5.4 8.8 8.4 14.7V78c0 2.6 2.2 4.7 4.7 4.7h11c2.6 0 4.7-2.2 4.7-4.7V67.1c3.5-6.3 6.7-13.6 9.3-16.4 5.3-4.8 8.1-11.2 8.1-18.3z"
      />
      <Path d="M34.7 73.6L44 73.6" />
      <Path d="M33.4 66L54.1 66" />
      <Path d="M44 56.3L44 38" />
      <Path d="M33.6 31.3L44 41.6" />
      <Path d="M44 41.6L54.8 30.8" />
    </Svg>
  )
}

export default SvgComponent
