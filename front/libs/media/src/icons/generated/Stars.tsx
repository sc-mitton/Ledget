import * as React from 'react';
import type { SVGProps } from 'react';
function SvgStars({
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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15.7 1.7 17 4.3c.6 1.1 1.4 1.9 2.5 2.5l2.6 1.4-2.6 1.4c-1.1.6-1.9 1.4-2.5 2.5l-1.4 2.6-1.4-2.6c-.6-1.1-1.4-1.9-2.5-2.5L9.3 8.1l2.6-1.4c1.1-.6 1.9-1.4 2.5-2.5zM5.8 14l.9 1.8c.4.7 1 1.3 1.7 1.7l1.8.9-1.8.9c-.7.4-1.3 1-1.7 1.7l-.9 1.8-.9-1.8c-.4-.7-1-1.3-1.7-1.7l-1.8-.9 1.8-.9c.7-.4 1.3-1 1.7-1.7z"
      />
    </svg>
  );
}
export default SvgStars;
