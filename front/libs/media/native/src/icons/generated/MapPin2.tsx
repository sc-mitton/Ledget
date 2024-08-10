import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
function SvgMapPin2({
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
        strokeMiterlimit={10}
        strokeWidth={1.75}
        d="M12 10.9c-2.3 0-4.2-1.9-4.2-4.2S9.7 2.5 12 2.5s4.2 1.9 4.2 4.2-1.9 4.2-4.2 4.2Z"
      />
      <Path
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={2.25}
        d="M12 11.3v10.2"
      />
    </Svg>
  );
}
export default SvgMapPin2;
