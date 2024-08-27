import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
function SvgHalfArrow({
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
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m13.8 6.3 7.9 7.9H2.3"
      />
    </Svg>
  );
}
export default SvgHalfArrow;
