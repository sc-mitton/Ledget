import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
function SvgTags({
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
      <Path d="M8.5 10.6H3.7c-1.2 0-2.1-1-2.1-2.1 0-1.2 1-2.1 2.1-2.1h4.8c1.2 0 2.1 1 2.1 2.1s-.9 2.1-2.1 2.1M20.3 10.6h-4.8c-1.2 0-2.1-1-2.1-2.1 0-1.2 1-2.1 2.1-2.1h4.8c1.2 0 2.1 1 2.1 2.1.1 1.1-.9 2.1-2.1 2.1M14.4 17.7H9.6c-1.2 0-2.1-1-2.1-2.1 0-1.2 1-2.1 2.1-2.1h4.8c1.2 0 2.1 1 2.1 2.1s-.9 2.1-2.1 2.1" />
    </Svg>
  );
}
export default SvgTags;
