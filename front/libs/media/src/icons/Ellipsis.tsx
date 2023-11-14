'react'

const Ellipsis = ({
    className = '',
    fill = "#292929",
    size = "1.2em",
    rotate = 0
}) => {

    return (

        <svg
            transform={`rotate(${rotate})`}
            width={size}
            height={size}
            fill={fill}
            viewBox="0 0 144 144"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            aria-label="Ellipsis"
        >
            <circle cx="72" cy="72" r="13.4" />
            <circle cx="72" cy="26.82" r="13.4" />
            <circle cx="72" cy="117.18" r="13.4" />
        </svg>

    )
}

export default Ellipsis
