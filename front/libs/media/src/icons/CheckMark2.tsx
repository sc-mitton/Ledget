'react'

const CheckMark2 = ({
    className = 'checkmark3',
    fill = "var(--main-hlight3)",
    width = "1em",
    height = "1em"
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
            aria-label="Checkmark"
        >
            <path fill={fill} d="M71.6,2.7C33.2,2.7,2.1,33.8,2.1,72.2c0,38.4,31.1,69.5,69.5,69.5c38.4,0,69.5-31.1,69.5-69.5
                C141.1,33.8,110,2.7,71.6,2.7z M109.2,48.8L69,107.9c-1.3,1.9-3.4,3.2-5.8,3.5l-0.1,0h-0.7c-2.2,0-4.2-0.9-5.7-2.4L32.5,84.8
                c-3.1-3.1-3.1-8.1,0-11.2c3.1-3.1,8.1-3.1,11.2,0l17.5,17.5L96,39.8c2.5-3.6,7.5-4.5,11.1-2.1c1.8,1.1,3,2.9,3.4,5.1
                C110.8,44.8,110.4,47,109.2,48.8z"/>
        </svg >
    )
}

export default CheckMark2
