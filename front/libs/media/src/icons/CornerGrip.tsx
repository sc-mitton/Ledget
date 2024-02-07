const CornerGripIcon = ({
    className = '',
    fill = "currentColor",
    width = ".9em",
    height = ".9em",
}) => {

    return (
        <>
            <svg
                className={className}
                width={width}
                height={height}
                viewBox="0 0 144 144"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                aria-label="Grip Icon"
            >
                <circle fill={fill} cx="108.5" cy="108.5" r="16.9" />
                <circle fill={fill} cx="35.5" cy="35.5" r="16.9" />
                <circle fill={fill} cx="35.5" cy="108.5" r="16.9" />
            </svg>
        </>
    )
}

export default CornerGripIcon
