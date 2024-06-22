import * as React from 'react';
import { SVGProps } from 'react';
function SvgRelink({
  size = '1.25em',
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: string | number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      stroke="currentColor"
      fill="currentColor"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13.8 9.1H18c2.6 0 4.8 2.1 4.8 4.8v-.2c0 2.6-2.1 4.8-4.8 4.8H6c-2.6 0-4.8-2.1-4.8-4.8v.2c0-2.6 2.1-4.8 4.8-4.8h2"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16.6 12.7 13 9.1l3.6-3.6"
      />
    </svg>
  );
}
export default SvgRelink;
