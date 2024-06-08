

const CheckAll = ({
    className = 'check-all',
    stroke = "currentColor",
    width = "1.5em",
    height = "1.5em"
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label="Check all"
        >
            <g>
                <line stroke={stroke} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill='none' x1="63.4" y1="80.2" x2="103.4" y2="39.2" />
                <polyline stroke={stroke} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill='none' points="9.2,73.9 39.3,104.8 46.9,97.1 	" />
                <polyline stroke={stroke} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill='none' points="40.6,73.9 70.7,104.8 134.8,39.2 	" />
            </g>
        </svg >
    )
}

export default CheckAll
