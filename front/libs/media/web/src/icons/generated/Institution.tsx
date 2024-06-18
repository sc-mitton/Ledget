import * as React from 'react';
import type { SVGProps } from 'react';
function SvgInstitution({
  size = '1.25em',
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: string | number;
}) {
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
        d="M12.5 11.9v11M21.2 11.9v11M3.9 11.9v11M12.1 2.2 2.3 6.4c-1 .4-.8 2.1.4 2.1h19.7c1.1 0 1.4-1.6.4-2.1L13 2.2c-.4-.1-.6-.1-.9 0"
      />
    </svg>
  );
}
export default SvgInstitution;
