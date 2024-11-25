import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
function SvgTags01({
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
      <Path d="M9 10.6H3.1c-.9 0-1.6-.7-1.6-1.6V7.9c0-.9.7-1.6 1.6-1.6H9c.9 0 1.6.7 1.6 1.6V9c0 .9-.7 1.6-1.6 1.6M20.9 10.6H15c-.9 0-1.6-.7-1.6-1.6V7.9c0-.9.7-1.6 1.6-1.6h5.9c.9 0 1.6.7 1.6 1.6V9c0 .9-.8 1.6-1.6 1.6M15 17.7H9c-.9 0-1.6-.7-1.6-1.6V15c0-.9.7-1.6 1.6-1.6h6c.9 0 1.6.7 1.6 1.6v1.1c-.1.9-.8 1.6-1.6 1.6" />
    </Svg>
  );
}
export default SvgTags01;
