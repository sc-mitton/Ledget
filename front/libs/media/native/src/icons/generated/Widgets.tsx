import * as React from 'react';
import Svg, { SvgProps, Rect } from 'react-native-svg';
function SvgWidgets({
  size = 24,
  ...props
}: SvgProps & {
  size?: string | number;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      stroke="currentColor"
      fill="none"
      {...props}
    >
      <Rect
        width={7}
        height={7}
        x={3}
        y={2.95}
        stroke="currentColor"
        strokeWidth={1.5}
        rx={1}
      />
      <Rect
        width={7}
        height={7}
        x={3}
        y={13.95}
        stroke="currentColor"
        strokeWidth={1.5}
        rx={1}
      />
      <Rect
        width={7}
        height={7}
        x={13}
        y={6.95}
        stroke="currentColor"
        strokeWidth={1.5}
        rx={1}
        transform="rotate(-45 13 6.95)"
      />
      <Rect
        width={7}
        height={7}
        x={14}
        y={13.95}
        stroke="currentColor"
        strokeWidth={1.5}
        rx={1}
      />
    </Svg>
  );
}
export default SvgWidgets;
