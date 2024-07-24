const Computer = ({ className = '', size = '3m', stroke = 'currentColor' }) => {
  return (
    <>
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 288 288"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        aria-label="Computer"
        style={{ width: size, height: size }}
      >
        <path
          strokeWidth={9}
          stroke={stroke}
          fill={'none'}
          d="M21.4 18H2.6c-.3 0-.5-.2-.5-.4v-.1c0-.3.2-.4.4-.4h18.8c.4 0 .6.2.6.4v.1c.1.2-.2.4-.5.4z"
        />
        <path
          strokeWidth={9}
          stroke={stroke}
          fill={'none'}
          d="M19.8 17.5V7.8c0-.5-.4-.9-.8-.9H5.1c-.4 0-.8.4-.8.9v9.7"
        />
      </svg>
    </>
  );
};

export default Computer;
