
const SearchIcon = ({
    stroke = '#292929',
    strokeWidth = "20",
    width = "1em",
    height = "1em",
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${144} ${144}`}
            aria-label="Search"
        >
            <circle
                stroke={stroke}
                fill={'none'}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                cx="58.2" cy="54.6" r="39.1"
            />
            <line
                stroke={stroke}
                fill={'none'}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                x1="82" y1="85.6" x2="120.9" y2="124.6"
            />
        </svg >
    )
}

export default SearchIcon
