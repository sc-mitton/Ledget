import * as React from 'react';
import type { SVGProps } from 'react';
import { SvgProps } from '../../types';
function SvgGraph({ size, ...props }: SvgProps) {
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
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21.7 21.6H3.3V4.2"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m6.1 16.2 5.3-5.3 3.1 3.1 5.9-5.9"
      />
    </svg>
  );
}
export default SvgGraph;
