const Trash = ({
    className = '',
    size = "1em",
    fill = "var(--icon-dark)",
}) => {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label="trash"
        >
            <path fill={fill} d="M105,13.3H88.7c-1.2-4-6.8-9.7-13.8-9.7h-5.7c-7.3,0-13.5,5.7-15.3,9.7H37.1c-7,0-12.7,5.7-12.7,12.7v9.4h93.3
	            V26C117.7,19,112,13.3,105,13.3z"/>
            <path fill={fill} d="M24,43.7l5.2,88.8c0.2,4.2,3.6,7.5,7.8,7.5h68c4.2,0,7.7-3.3,7.8-7.5l5.2-88.8C118,43.7,24,43.7,24,43.7z" />
        </svg>
    )
}

export default Trash
