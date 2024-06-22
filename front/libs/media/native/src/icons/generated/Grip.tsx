import * as React from 'react';
import Svg, { SvgProps, Circle } from 'react-native-svg';
function SvgGrip({
  size = 24,
  ...props
}: SvgProps & {
  size?: string | number;
}) {
  return (
    <Svg
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
      <Circle cx={7.5} cy={4.5} r={1.16} fill="currentColor" />
      <Circle cx={16.5} cy={4.5} r={1.16} fill="currentColor" />
      <Circle cx={7.5} cy={12.2} r={1.16} fill="currentColor" />
      <Circle cx={16.5} cy={12.2} r={1.16} fill="currentColor" />
      <Circle cx={7.5} cy={19.9} r={1.16} fill="currentColor" />
      <Circle cx={16.5} cy={19.9} r={1.16} fill="currentColor" />
    </Svg>
  );
}
export default SvgGrip;
