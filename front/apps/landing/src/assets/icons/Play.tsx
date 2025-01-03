const PlayLogo = ({
  width = '1.3em',
  height = '1.3em',
  fill = 'var(--m-text)',
}) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    width={width}
    height={height}
    viewBox="0 0 144 144"
    xmlSpace="preserve"
    aria-label="Play Store Logo"
  >
    <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
      <path
        fill={fill}
        d="M26.1,23l6.3-6.3L9.1,3.4C8,2.8,7,2.7,6.3,3L26.1,23z"
      />
      <path
        fill={fill}
        d="M4.7,5.7c0,0.1,0,0.2,0,0.3v38.4v0.1L24,25.1L4.7,5.7z"
      />
      <path
        fill={fill}
        d="M26.1,27.2L6.1,47.4C6.8,47.8,7.8,47.7,9,47l23.5-13.4L26.1,27.2z"
      />
      <path
        fill={fill}
        d="M43,22.7l-7.7-4.4l-6.9,6.8l7,7l7.6-4.4C45.4,26.3,45.4,24,43,22.7z"
      />
    </g>
  </svg>
);

export default PlayLogo;
