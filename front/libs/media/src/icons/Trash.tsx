const Trash = ({
    className = '',
    width = "1em",
    height = "1em",
    fill = "var(--icon-dark)",
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
            aria-label="trash"
        >
            <path fill={fill} d="M105,13.3H81.7c-0.7-4-4.1-7-8.3-7h-3.4c-4.4,0-8.1,3-9.2,7H37.1c-7,0-12.7,5.7-12.7,12.7v2.4h93.3V26
                C117.7,19,112,13.3,105,13.3z"/>
            <g>
                <path fill={fill} d="M24,36.7l5.2,95.8c0.2,4.2,3.6,7.5,7.8,7.5h68c4.2,0,7.7-3.3,7.8-7.5l5.2-95.8H24z" />
            </g>
        </svg>
    )
}

export default Trash
