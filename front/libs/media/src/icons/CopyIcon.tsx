'react'

const CopyIcon = ({
    className = '',
    fill = "#292929",
    width = "1em",
    height = "1em",
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
                aria-label="Copy Icon"
            >
                <g>
                    <path fill={fill} d="M109.8,50.1H68.5c-10.2,0-18.4,8.3-18.4,18.4v41.2c0,10.2,8.3,18.4,18.4,18.4h41.2c10.2,0,18.4-8.3,18.4-18.4V68.5
                        C128.2,58.4,119.9,50.1,109.8,50.1z"/>
                    <path fill={fill} d="M80.3,15.8H38.9c-12.8,0-23.1,10.3-23.1,23.1v41.4c0,7.5,6.1,13.6,13.6,13.6h6.8V59c0-12.6,10.3-22.9,22.9-22.9h35L94,29.4
                        C93.9,21.9,87.8,15.8,80.3,15.8z"/>
                </g>
            </svg>
        </>
    )
}

export default CopyIcon
