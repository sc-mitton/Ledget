'react'

const Stocks = ({
    width = "1.2em",
    height = "1.2em",
    className = '',
    fill = "#292929"
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 144 144`}
            className={className}
            aria-label='stocks'

        >
            <path fill={fill} d="M134.6,38.2l-32.2,8.6c-1.2,0.3-1.6,1.8-0.7,2.7l6.4,6.4L81.3,82.7L55.1,56.5c-2.5-2.5-6.6-2.5-9.2,0L9.7,92.8
                c-3,3-3,7.8,0,10.8c1.5,1.5,3.5,2.2,5.4,2.2s3.9-0.7,5.4-2.2l30-30l26.2,26.2c2.5,2.5,6.6,2.5,9.2,0l33-33l6.4,6.4
                c0.9,0.9,2.4,0.5,2.7-0.7l8.6-32.2C136.9,39,135.8,37.9,134.6,38.2z"/>
        </svg >
    )
}

export default Stocks
