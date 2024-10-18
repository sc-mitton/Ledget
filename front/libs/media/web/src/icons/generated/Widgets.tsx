import * as React from 'react';
import { SVGProps } from 'react';
function SvgWidgets({
  size = '1.25em',
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: string | number;
}) {
  return (
    <svg
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <rect
        width={7}
        height={7}
        x={3}
        y={2.95}
        stroke="currentColor"
        strokeWidth={1.5}
        rx={1}
      />
      <rect
        width={7}
        height={7}
        x={3}
        y={13.95}
        stroke="currentColor"
        strokeWidth={1.5}
        rx={1}
      />
      <rect
        width={7}
        height={7}
        x={13}
        y={6.95}
        stroke="currentColor"
        strokeWidth={1.5}
        rx={1}
        transform="rotate(-45 13 6.95)"
      />
      <rect
        width={7}
        height={7}
        x={14}
        y={13.95}
        stroke="currentColor"
        strokeWidth={1.5}
        rx={1}
      />
    </svg>
  );
}
export default SvgWidgets;
