import * as React from 'react';
import { SVGProps } from 'react';
function SvgTags({
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
      <path d="M8.5 10.6H3.7c-1.2 0-2.1-1-2.1-2.1 0-1.2 1-2.1 2.1-2.1h4.8c1.2 0 2.1 1 2.1 2.1s-.9 2.1-2.1 2.1M20.3 10.6h-4.8c-1.2 0-2.1-1-2.1-2.1 0-1.2 1-2.1 2.1-2.1h4.8c1.2 0 2.1 1 2.1 2.1.1 1.1-.9 2.1-2.1 2.1M14.4 17.7H9.6c-1.2 0-2.1-1-2.1-2.1 0-1.2 1-2.1 2.1-2.1h4.8c1.2 0 2.1 1 2.1 2.1s-.9 2.1-2.1 2.1" />
    </svg>
  );
}
export default SvgTags;
