'react'

const Clock = ({
    className = '',
    width = "1em",
    height = "1em",
    fill = "var(--icon-full)",
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label='clock'
        >
            <path fill={fill} d="M72,9C37.2,9,9,37.2,9,72c0,34.8,28.2,63,63,63s63-28.2,63-63C135,37.2,106.8,9,72,9z M106.1,79.5H72
                c-4.1,0-7.5-3.4-7.5-7.5V27.1c0-4.1,3.4-7.5,7.5-7.5c4.1,0,7.5,3.4,7.5,7.5v37.4h26.6c4.1,0,7.5,3.4,7.5,7.5
                C113.6,76.1,110.2,79.5,106.1,79.5z"/>
        </svg>
    )
}

export default Clock
