import * as React from 'react';
import type { SVGProps } from 'react';
import { SvgProps } from '../../types';
function SvgCheckAll({ size, ...props }: SvgProps) {
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
        d="m7.6 15.9-1.3 1.3-4.7-4.7M16.7 6.8 10.5 13M22.1 6.8 11.6 17.2l-4.7-4.7"
      />
    </svg>
  );
}
export default SvgCheckAll;
