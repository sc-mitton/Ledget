import { SVGProps } from 'react';

const Computer = ({
  size = '3.5em',
  ...rest
}: SVGProps<SVGSVGElement> & { size?: string | number }) => {
  return (
    <svg
      x="0px"
      y="0px"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke="currentColor"
      fill="none"
      {...rest}
    >
      <path
        strokeWidth={0.5}
        strokeLinecap="round"
        strokeMiterlimit={10}
        fill="currentColor"
        d="M21.4 18H2.6c-.3 0-.5-.2-.5-.4v-.1c0-.3.2-.4.4-.4h18.8c.4 0 .6.2.6.4v.1c.1.2-.2.4-.5.4z"
      />
      <path
        fill="none"
        strokeWidth={1}
        d="M19.8 17.5V7.8c0-.5-.4-.9-.8-.9H5.1c-.4 0-.8.4-.8.9v9.7"
      />
    </svg>
  );
};

export default Computer;
