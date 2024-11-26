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
      <path d="M9.6 9.1H6.3c-.8 0-1.4-.7-1.4-1.4 0-.8.7-1.4 1.4-1.4h3.3c.8 0 1.4.7 1.4 1.4 0 .8-.6 1.4-1.4 1.4M17.6 9.1h-3.3c-.8 0-1.4-.7-1.4-1.4 0-.8.7-1.4 1.4-1.4h3.3c.8 0 1.4.7 1.4 1.4.1.8-.6 1.4-1.4 1.4M9.6 18.6H6.3c-.8 0-1.4-.7-1.4-1.4 0-.8.7-1.4 1.4-1.4h3.3c.8 0 1.4.7 1.4 1.4s-.6 1.4-1.4 1.4M17.6 18.6h-3.3c-.8 0-1.4-.7-1.4-1.4 0-.8.7-1.4 1.4-1.4h3.3c.8 0 1.4.7 1.4 1.4.1.7-.6 1.4-1.4 1.4M13.6 13.9h-3.3c-.8 0-1.4-.7-1.4-1.4 0-.8.7-1.4 1.4-1.4h3.3c.8 0 1.4.7 1.4 1.4s-.6 1.4-1.4 1.4M5.8 13.9H2.5c-.8 0-1.4-.7-1.4-1.4 0-.8.7-1.4 1.4-1.4h3.3c.8 0 1.4.7 1.4 1.4s-.6 1.4-1.4 1.4M21.5 13.9h-3.3c-.8 0-1.4-.7-1.4-1.4 0-.8.7-1.4 1.4-1.4h3.3c.8 0 1.4.7 1.4 1.4s-.6 1.4-1.4 1.4" />
    </svg>
  );
}
export default SvgTags;
