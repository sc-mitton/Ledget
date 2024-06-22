import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
function SvgHamburger({
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
        strokeWidth={1.5}
        d="M20.2 8.2H3.3M20.2 16.1H3.3"
      />
    </Svg>
  );
}
export default SvgHamburger;
