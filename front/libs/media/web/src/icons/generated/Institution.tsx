import * as React from 'react';
import { SVGProps } from 'react';
function SvgInstitution({
  size = '1.25em',
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: string | number;
}) {
  return (
    <svg
      viewBox="0 0 25 25"
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
        d="M9.8 11.9v10.3M20.6 11.9v10.3"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.398}
        d="M4.4 11.9v10.3M12.2 2.9 3 6.8c-1 .3-.8 1.9.3 1.9h18.4c1.1 0 1.3-1.5.3-1.9L12.9 3c-.3-.3-.5-.3-.7-.1"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M2.3 22.2h20.4M15.2 11.9v10.3"
      />
    </svg>
  );
}
export default SvgInstitution;
