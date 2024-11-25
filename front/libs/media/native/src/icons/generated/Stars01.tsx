import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
function SvgStars01({
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
        d="m15.7 1.8 1.3 3c.4.9 1.1 1.7 2.1 2.1l3 1.3-3 1.3c-.9.4-1.7 1.1-2.1 2.1l-1.3 3-1.3-3c-.4-.9-1.1-1.7-2.1-2.1l-3-1.3 3-1.3c.9-.4 1.7-1.1 2.1-2.1zM5.8 13.8l.9 2.2q.45 1.05 1.5 1.5l2.2.9-2.2.9q-1.05.45-1.5 1.5L5.8 23l-.9-2.2q-.45-1.05-1.5-1.5l-2.2-.9 2.2-.9c.6-.3 1.2-.9 1.5-1.5z"
        style={{
          fill: 'none',
          stroke: '#000',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
      />
    </Svg>
  );
}
export default SvgStars01;
