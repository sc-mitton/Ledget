import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
function SvgGrip({
  size = '1.25em',
  ...props
}: SvgProps & {
  size?: string | number;
}) {
  return (
    <Svg
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
      <Circle cx={6.5} cy={3.5} r={1.9} fill="currentColor" />
      <Circle cx={17.5} cy={3.5} r={1.9} fill="currentColor" />
      <Circle cx={6.5} cy={12.2} r={1.9} fill="currentColor" />
      <Circle cx={17.5} cy={12.2} r={1.9} fill="currentColor" />
      <Circle cx={6.5} cy={20.8} r={1.9} fill="currentColor" />
      <Circle cx={17.5} cy={20.8} r={1.9} fill="currentColor" />
    </Svg>
  );
}
export default SvgGrip;
