import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
function SvgFilter2({
  size = 24,
  ...props
}: SvgProps & {
  size?: string | number;
}) {
  return (
    <Svg
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
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M6 12.7h13M2.9 7h19.2M9.2 18.5h6.6"
      />
    </Svg>
  );
}
export default SvgFilter2;
