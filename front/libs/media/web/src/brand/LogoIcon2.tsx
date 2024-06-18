const LogoIcon2 = ({ size = '1.5em' }) => {
  return (
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 600 600"
      width={size}
      height={size}
    >
      <defs>
        <linearGradient
          id="SVGID_1_"
          gradientUnits="userSpaceOnUse"
          x1="133.5052"
          y1="509.5738"
          x2="539.8115"
          y2="509.5738"
        >
          <stop offset="0" stopColor="#BDC2DB" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
      <path
        fill="url(#SVGID_1_)"
        d="M539.8,463.7v58.7c0,36.6-29.7,66.3-66.3,66.3H352.8H133.5c36.6,0,66.3-29.7,66.3-66.3v-58.7
                c0-18.4,14.9-33.3,33.3-33.3h273.4C524.9,430.4,539.8,445.3,539.8,463.7z"
      />
      <path
        fill="#FFFFFF"
        d="M254.2,12.9c18.4,0,33.3,14.9,33.3,33.3v476.2c0,36.6,29.7,66.3,66.3,66.3H133.5c-36.6,0-66.3-29.7-66.3-66.3
                V46.2c0-18.4,14.9-33.3,33.3-33.3H254.2z"
      />
    </svg>
  );
};

export default LogoIcon2;
