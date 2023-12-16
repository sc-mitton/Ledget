const Phone = ({
    className = '',
    width = "4.5em",
    height = "4.5em",
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
            >
                <g>
                    <path fill="var(--icon-full)" d="M187.7,245.9h-87.2c-9.1,0-16.5-7.4-16.5-16.5V58.6c0-9.1,7.4-16.5,16.5-16.5h87.2c9.1,0,16.5,7.4,16.5,16.5
                        v170.9C204,238.5,196.8,245.9,187.7,245.9z"/>
                    <path fill="#eeeeee" d="M93.1,228.2V59.8c0-4.7,3.9-8.6,8.6-8.6h84.6c4.7,0,8.6,3.9,8.6,8.6v168.3c0,4.7-3.9,8.6-8.6,8.6h-84.6
                        C97,236.7,93.1,232.9,93.1,228.2z"/>
                    <path fill="#fafafa" d="M95.5,233.3c-1.5-1.8-2.4-3.9-2.4-6.4V61.2c0-5.5,4.4-9.9,9.9-9.9h82c2.4,0,4.7,0.9,6.4,2.4L95.5,233.3z" />
                    <circle fill="var(--icon-full)" cx="144.1" cy="67.8" r="6.3" />
                </g>
            </svg>
        </>
    )
}

export default Phone
