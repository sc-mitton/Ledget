import React from 'react'

const Ellipsis = ({
    className = '',
    fill = "#292929",
    width = "1.2em",
    height = "1.2em"
}) => {

    return (

        <svg
            width={width}
            height={height}
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
