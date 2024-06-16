import * as React from 'react';
import type { SVGProps } from 'react';
import { SvgProps } from '../../types';
function SvgCurrencyNote({ size, ...props }: SvgProps) {
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
        d="M22.8 15.1v-6c0-1.3-1.1-2.4-2.4-2.4H3.6c-1.3 0-2.4 1.1-2.4 2.4v6.1c0 1.3 1.1 2.4 2.4 2.4h16.8c1.4 0 2.4-1.1 2.4-2.5m-12.4-1.4c-.9-.9-.9-2.3 0-3 .9-.8 2.3-.9 3 0s.9 2.3 0 3c-.7.8-2.1.8-3 0"
      />
    </svg>
  );
}
export default SvgCurrencyNote;
