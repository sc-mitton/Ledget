import * as React from 'react';
import type { SVGProps } from 'react';
function SvgMapPin2({
  size = '1.25em',
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: string | number;
}) {
  return (
    <svg
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
      <path
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M12 10.9c-2.3 0-4.2-1.9-4.2-4.2S9.7 2.5 12 2.5s4.2 1.9 4.2 4.2-1.9 4.2-4.2 4.2ZM12 11.3v10.2"
      />
    </svg>
  );
}
export default SvgMapPin2;
