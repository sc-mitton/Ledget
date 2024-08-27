import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
function SvgGraph({
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
        strokeLinejoin="round"
        d="M21.7 20.2H3.3V4.8"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6.1 15.8 5.3-5.3 3.1 3.1 5.9-5.9"
      />
    </Svg>
  );
}
export default SvgGraph;
