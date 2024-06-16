import * as React from 'react';
import type { SVGProps } from 'react';
import { SvgProps } from '../../types';
function SvgCornerGrip({ size = '1.25em', ...props }: SvgProps) {
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
      <circle cx={18.1} cy={18.1} r={2.8} fill="currentColor" />
      <circle cx={5.9} cy={5.9} r={2.8} fill="currentColor" />
      <circle cx={5.9} cy={18.1} r={2.8} fill="currentColor" />
    </svg>
  );
}
export default SvgCornerGrip;
