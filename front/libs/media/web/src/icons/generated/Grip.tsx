import * as React from 'react';
import type { SVGProps } from 'react';
function SvgGrip({
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
      <circle cx={7.5} cy={4.5} r={1.16} fill="currentColor" />
      <circle cx={16.5} cy={4.5} r={1.16} fill="currentColor" />
      <circle cx={7.5} cy={12.2} r={1.16} fill="currentColor" />
      <circle cx={16.5} cy={12.2} r={1.16} fill="currentColor" />
      <circle cx={7.5} cy={19.9} r={1.16} fill="currentColor" />
      <circle cx={16.5} cy={19.9} r={1.16} fill="currentColor" />
    </svg>
  );
}
export default SvgGrip;
