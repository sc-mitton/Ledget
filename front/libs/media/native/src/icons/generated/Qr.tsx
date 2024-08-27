import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
function SvgQr({
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
        d="M19.7 9.8H15c-.5 0-.9-.4-.9-.9V4.2c0-.5.4-.9.9-.9h4.7c.5 0 .9.4.9.9v4.7c0 .5-.4.9-.9.9M8.5 9.8H3.8c-.5 0-.9-.4-.9-.9V4.2c0-.5.4-.9.9-.9h4.7c.5 0 .9.4.9.9v4.7c0 .5-.4.9-.9.9M17.5 14.4h2.1c.4 0 .8.4.8.9v4.4M16.7 20.7h-2.2c-.4 0-.8-.4-.8-.9v-4.4M8.5 20.9H3.8c-.5 0-.9-.4-.9-.9v-4.7c0-.5.4-.9.9-.9h4.7c.5 0 .9.4.9.9V20c0 .5-.4.9-.9.9M17.5 18.3h-.9c-.1 0-.2-.1-.2-.2v-.9c0-.1.1-.2.2-.2h.9c.1 0 .2.1.2.2v.9c0 .1-.1.2-.2.2"
      />
    </Svg>
  );
}
export default SvgQr;
