import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
import { NativeSvgProps } from '../../types';
function SvgCornerGrip({ size, ...props }: NativeSvgProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      stroke="currentColor"
      fill="none"
      {...props}
    >
      <Circle cx={18.1} cy={18.1} r={2.8} fill="currentColor" />
      <Circle cx={5.9} cy={5.9} r={2.8} fill="currentColor" />
      <Circle cx={5.9} cy={18.1} r={2.8} fill="currentColor" />
    </Svg>
  );
}
export default SvgCornerGrip;
