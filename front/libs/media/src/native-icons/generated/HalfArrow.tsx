import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
function SvgHalfArrow({
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
      <Path
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m13.8 6.3 7.9 7.9H2.3"
      />
    </Svg>
  );
}
export default SvgHalfArrow;
