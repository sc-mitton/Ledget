import * as React from 'react';
import type { SVGProps } from 'react';
function SvgFilter2({
  size = '1.25em',
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: string | number;
}) {
  return (
    <svg
      data-name="Layer 1"
      viewBox="0 0 25 25"
      width={size}
      height={size}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      stroke="currentColor"
      fill="none"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M6 12.7h13M2.9 7h19.2M9.2 18.5h6.6"
      />
    </svg>
  );
}
export default SvgFilter2;
