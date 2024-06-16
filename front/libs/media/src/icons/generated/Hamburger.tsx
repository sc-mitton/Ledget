import * as React from 'react';
import type { SVGProps } from 'react';
import { SvgProps } from '../../types';
function SvgHamburger({ size, ...props }: SvgProps) {
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
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20.2 8.2H3.3M20.2 16.1H3.3"
      />
    </svg>
  );
}
export default SvgHamburger;
