import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
function SvgCheckAll({
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
        d="m7.6 15.9-1.3 1.3-4.7-4.7M16.7 6.8 10.5 13M22.1 6.8 11.6 17.2l-4.7-4.7"
      />
    </Svg>
  );
}
export default SvgCheckAll;
