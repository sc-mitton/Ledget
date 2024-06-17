import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
function SvgFilter2({
  size = '1.25em',
  ...props
}: SvgProps & {
  size?: string | number;
}) {
  return (
    <Svg
      data-name="Layer 1"
      viewBox="0 0 25 25"
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
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M6 12.7h13M2.9 7h19.2M9.2 18.5h6.6"
      />
    </Svg>
  );
}
export default SvgFilter2;
