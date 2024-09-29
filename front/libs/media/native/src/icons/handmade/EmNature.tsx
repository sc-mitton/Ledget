import * as React from "react"
import Svg, { Path, Ellipse, SvgProps } from "react-native-svg"
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
        d="M71.9 38.9C71.2 24.1 59 12.1 44.2 12.1c-15.1 0-27.2 12-27.9 26.8-6 3.5-10 9.7-10 17.3C6.3 67 15.2 75.9 26 75.9c1.6 0 3.1-.2 4.7-.7C33.3 79.9 38.2 83 44 83s10.9-3.3 13.3-8c1.8.4 3.3.9 5.3.9 10.9 0 19.7-8.9 19.7-19.7 0-7.6-4.2-14-10.4-17.3z"
      />
      <Ellipse cx={26.7} cy={46.4} rx={3.5} ry={5.3} />
      <Ellipse cx={60.6} cy={46.4} rx={3.5} ry={5.3} />
      <Path d="M43.3 61.7L43.3 74.1" />
      <Path
        d="M50.6 70.3c-1.1 2-4 3.3-7.3 3.3s-6-1.3-7.3-3.3"
        fill='black'
        strokeWidth={4.5926}
        strokeLinecap="round"
        strokeMiterlimit={10}
      />
      <Path
        d="M41.8 65.2L36 59.5c-.7-1.1 0-2.2 1.6-2.2h11.7c1.6 0 2.2 1.1 1.6 2.2l-5.8 5.8c-.7.8-2.7.8-3.3-.1z"
      />
      <Path
        d="M16.5 38.7c-3.3-1.6-6.4-4.2-8.4-7.8-4.9-8.6-2-19.3 6-23.7s18.6-1.3 23.5 7.3M49.7 13.4c4.9-7.5 14.4-10.6 22.1-6.6C80.3 11 83.4 21.4 79 30.3c-1.8 3.5-4.4 6.2-7.5 8"
      />
    </Svg>
  )
}

export default SvgComponent
