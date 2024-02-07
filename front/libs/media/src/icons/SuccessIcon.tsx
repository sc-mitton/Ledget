'react'

const Success = ({
    className = '',
    width = "1em",
    height = "1em",
    fill = "#ffffff",
}) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label="success"
        >
            <path fill={fill} d="M342.3,658.4c-12.9,0-25-5.7-33.3-15.6L162.5,466.9c-16.4-17.4-15.6-44.9,1.9-61.3
                c17.4-16.4,44.9-15.6,61.3,1.9c1.2,1.3,2.3,2.6,3.3,4l106.7,128.1l230.9-399.9c12-20.7,38.5-27.8,59.2-15.9
                c20.7,12,27.8,38.5,15.9,59.2L379.8,636.7c-7.1,12.3-19.7,20.3-33.8,21.5C344.7,658.3,343.5,658.4,342.3,658.4L342.3,658.4z"/>
        </svg>

    )
}

export default Success
