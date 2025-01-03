import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style */
const SvgComponent = (props: SvgProps) => (
  <Svg id="Layer_1" x={0} y={0} viewBox="0 0 88 88" {...props}>
    <Path d="M32.7 26c2.2 0 4 3.4 4 7.7s-1.8 7.7-4 7.7-4-3.4-4-7.7 1.8-7.7 4-7.7zm21 0c-2.6 0-4 4-4 7.7s1.4 7.7 4 7.7 4-4 4-7.7-1.4-7.7-4-7.7zM43.6 57.4c-6.9.2-12.9-2.8-18.8-5.9-2.1-1.2-4.7.6-4 2.7 2.8 9 11.9 15.6 23 15.6 10.8 0 20-6.5 23-15.6.7-2.2-2-4-4.3-2.8-5.6 3-11.8 5.6-18.2 5.9-.5.1-.7.1-.7.1zm0 26.4c-22 0-40.1-18.1-40.1-40.1S21.6 3.6 43.6 3.6s40.1 18.1 40.1 40.1-18.1 40.1-40.1 40.1zm0-76.2C23.8 7.6 7.5 23.8 7.5 43.7s16.3 36.1 36.1 36.1 36.1-16.3 36.1-36.1c0-19.9-16.2-36.1-36.1-36.1z" />
  </Svg>
);
export default SvgComponent;
