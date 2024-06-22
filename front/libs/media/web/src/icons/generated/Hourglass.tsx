import * as React from 'react';
import { SVGProps } from 'react';
function SvgHourglass({
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
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M4.2 20.8h15.6M6.4 20.8c0-2.6 2.1-8.6 5.6-8.6s5.5 5.9 5.5 8.6zM19.8 3.6H4.2M17.6 3.6c0 2.6-2.1 8.6-5.6 8.6s-5.5-6-5.5-8.6z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M15.3 9.1c.3 0 .5.3.3.6-.9 1.4-2.1 2.5-3.6 2.5s-2.7-1.1-3.6-2.5c-.2-.3 0-.6.3-.6z"
      />
    </svg>
  );
}
export default SvgHourglass;
