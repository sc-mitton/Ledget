import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
import { NativeSvgProps } from '../../types';
function SvgMapPin2({ size = '1.25em', ...props }: NativeSvgProps) {
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
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M12 10.9c-2.3 0-4.2-1.9-4.2-4.2S9.7 2.5 12 2.5s4.2 1.9 4.2 4.2-1.9 4.2-4.2 4.2ZM12 11.3v10.2"
      />
    </Svg>
  );
}
export default SvgMapPin2;
