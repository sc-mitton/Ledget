const Computer = ({
    className = '',
    width = "3em",
    height = "3em",
    stroke = 'var(--icon-full)',
}) => {

    return (
        <>
            <svg
                className={className}
                width={width}
                height={height}
                viewBox="0 0 288 288"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                aria-label="Computer"
                style={{ width: width, height: height }}
            >
                <path strokeWidth={9} stroke={stroke} fill={'none'} d="M46.7,183.2V71.3c0-4.3,3.4-7.6,7.6-7.6h180.1c4.3,0,7.6,3.4,7.6,7.6l0.1,111.8" />
                <path strokeWidth={9} stroke={stroke} fill={'none'} d="M261.3,210.8H27.5c-3.4,0-6.2-2.6-6.2-5.9v-3.8c0-3.2,2.8-5.9,4.8-5.9H260c4.8,0,7.6,2.6,7.6,5.9v3.8
                    C267.5,208.2,264.7,210.8,261.3,210.8z"/>
                <circle fill={stroke} cx="144.4" cy="80.7" r="4.8" />
            </svg>
        </>
    )
}

export default Computer
