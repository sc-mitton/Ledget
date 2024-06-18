import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
function SvgRelink({
  size = 24,
  ...props
}: SvgProps & {
  size?: string | number;
}) {
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
      <Path
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13.8 9.1H18c2.6 0 4.8 2.1 4.8 4.8v-.2c0 2.6-2.1 4.8-4.8 4.8H6c-2.6 0-4.8-2.1-4.8-4.8v.2c0-2.6 2.1-4.8 4.8-4.8h2"
      />
      <Path
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16.6 12.7 13 9.1l3.6-3.6"
      />
    </Svg>
  );
}
export default SvgRelink;
