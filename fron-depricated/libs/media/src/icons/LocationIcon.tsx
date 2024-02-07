const Location = ({
    className = 'location-icon',
    stroke = "var(--icon-full)",
    width = "1em",
    height = "1em"
}) => {

    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label="Location"
        >
            <path stroke={stroke} fill={'none'} strokeWidth={9} strokeLinecap={'round'} d="M71.5,70.3c-10.3,0-18.7-8.4-18.7-18.7s8.4-18.7,18.7-18.7s18.7,8.4,18.7,18.7S81.8,70.3,71.5,70.3z" />
            <line stroke={stroke} fill={'none'} strokeWidth={9} strokeLinecap={'round'} x1="71.5" y1="72.3" x2="71.5" y2="117.8" />
        </svg >
    )
}

export default Location
