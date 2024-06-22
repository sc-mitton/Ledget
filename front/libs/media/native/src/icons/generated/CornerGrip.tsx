import * as React from 'react';
import Svg, { SvgProps, Circle } from 'react-native-svg';
function SvgCornerGrip({
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
      <Circle cx={5.9} cy={5.9} r={1.66} fill="currentColor" />
      <Circle cx={5.9} cy={18.1} r={1.66} fill="currentColor" />
      <Circle cx={18.1} cy={18.1} r={1.66} fill="currentColor" />
    </Svg>
  );
}
export default SvgCornerGrip;
