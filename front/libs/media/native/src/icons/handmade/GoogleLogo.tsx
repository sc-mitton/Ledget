import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

function SvgComponent({ size = 34, ...rest }: SvgProps & { size?: number }) {
  return (
    <Svg
      x="0px"
      y="0px"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      {...rest}
    >
      <Path
        d="M46.5 19.5h-1.8v-.1H24v9.2h13c-1.8 5.4-7 9.2-13 9.2-7.6 0-13.8-6.2-13.8-13.8S16.4 10.2 24 10.2c3.6 0 6.7 1.4 9.2 3.4l6.5-6.5c-4.2-3.6-9.6-6-15.7-6C11.4 1.1 1.1 11.4 1.1 24S11.4 46.9 24 46.9 46.9 36.6 46.9 24c0-1.5-.1-3-.4-4.5z"
        fill="#ffc107"
      />
      <Path
        d="M3.7 13.3l7.6 5.5c2.1-5 7-8.6 12.7-8.6 3.6 0 6.7 1.4 9.2 3.4l6.5-6.5c-4.2-3.6-9.6-6-15.7-6C15.2 1.1 7.6 6 3.7 13.3z"
        fill="#ff3d00"
      />
      <Path
        d="M24 46.9c6 0 11.4-2.3 15.4-6l-7.1-6c-2.3 1.7-5.2 2.8-8.3 2.8-6 0-11-3.8-13-9.1l-7.5 5.7C7.4 41.9 15.1 46.9 24 46.9z"
        fill="#4caf50"
      />
      <Path
        d="M46.5 19.4H24v9.2h13c-.9 2.5-2.5 4.8-4.7 6.4l7.1 6c-.5.5 7.6-5.5 7.6-17-.1-1.5-.1-3.1-.5-4.6z"
        fill="#1976d2"
      />
    </Svg>
  );
}

export default SvgComponent;
