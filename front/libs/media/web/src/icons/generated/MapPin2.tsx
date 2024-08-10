import * as React from 'react';
import { SVGProps } from 'react';
function SvgMapPin2({
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
        strokeWidth={1.75}
        d="M12 10.9c-2.3 0-4.2-1.9-4.2-4.2S9.7 2.5 12 2.5s4.2 1.9 4.2 4.2-1.9 4.2-4.2 4.2Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={2.25}
        d="M12 11.3v10.2"
      />
    </svg>
  );
}
export default SvgMapPin2;
