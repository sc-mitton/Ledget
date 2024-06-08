

const Grip = ({
    size = "1.25em",
    className = '',
    stroke = "currentColor",
}) => {

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 25 25`}
            className={className}
            aria-label="Filter"
        >
            <g>
                <line fill='none' strokeWidth={1.5} strokeLinecap="round" stroke={stroke} x1="6" y1="12.7" x2="19" y2="12.7" />
            </g>
            <g>
                <line fill='none' strokeWidth={1.5} strokeLinecap="round" stroke={stroke} x1="2.9" y1="7" x2="22.1" y2="7" />
            </g>
            <g>
                <line fill='none' strokeWidth={1.5} strokeLinecap="round" stroke={stroke} x1="9.2" y1="18.5" x2="15.8" y2="18.5" />
            </g>
        </svg >
    )
}

export default Grip
