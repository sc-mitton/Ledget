import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style */

function SvgComponent(props: SvgProps) {
  return (
    <Svg id="Layer_1" x="0px" y="0px" viewBox="0 0 88 88" {...props}>
      <Path d="M72.4 47.2c0 1.2-1.6 2-2.4 1.2-2-1.8-5.4-3.8-11.3-3.8-11.9 0-13.5 7.7-25.6 7.7-10.1 0-17.4-7.1-17.4-7.1V12.1c0-1.2 1.4-1.8 2.2-1.2 2.6 1.8 7.5 4.4 15.1 4.4 12.1 0 13.7-7.7 25.6-7.7 10.5 0 13.1 6.1 13.7 7.5v32.1z" />
      <Path d="M15.8 44.6L15.8 84.3" />
    </Svg>
  );
}

export default SvgComponent;
