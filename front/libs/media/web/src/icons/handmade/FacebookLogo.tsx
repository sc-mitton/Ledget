const FacebookLogo = ({
  width = '1.3em',
  height = '1.3em',
  fill = '#039BE5',
}) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    width={width}
    height={height}
    viewBox="0 0 48 48"
    xmlSpace="preserve"
    aria-label="Facebook Logo"
  >
    <path
      fill={fill}
      d="M24,0.5C11,0.5,0.5,11,0.5,24c0,11.8,8.7,21.6,20,23.2l0-0.1V30.2h-5.8V24h5.8v-3.9c0-6.8,3.3-9.8,9-9.8
        c2.7,0,4.2,0.1,4.8,0.2v5.4h-3.8c-2.3,0-3.2,2.2-3.2,4.8V24h7l-1,6.2h-6v17.1C38.7,45.7,47.5,35.9,47.5,24C47.5,11,37,0.5,24,0.5z"
    />
  </svg>
);

export default FacebookLogo;
