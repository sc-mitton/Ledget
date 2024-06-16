import * as React from 'react';
import type { SVGProps } from 'react';
import { SvgProps } from '../../types';
function SvgGrip({ size, ...props }: SvgProps) {
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
      <circle cx={6.5} cy={3.5} r={1.9} fill="currentColor" />
      <circle cx={17.5} cy={3.5} r={1.9} fill="currentColor" />
      <circle cx={6.5} cy={12.2} r={1.9} fill="currentColor" />
      <circle cx={17.5} cy={12.2} r={1.9} fill="currentColor" />
      <circle cx={6.5} cy={20.8} r={1.9} fill="currentColor" />
      <circle cx={17.5} cy={20.8} r={1.9} fill="currentColor" />
    </svg>
  );
}
export default SvgGrip;
