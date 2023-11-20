'react'

const Show = ({
    width = "1.6em",
    height = "1.6em",
    className = '',
    stroke = "var(--icon-dark)"
}) => {

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 144 144`}
            className={className}
            aria-label="Show"
        >
            <path fill={stroke} d="M72,88.6c4.7,0,8.7-1.6,11.9-4.9c3.4-3.2,4.9-7.4,4.9-11.9s-1.6-8.7-4.9-11.9c-3.2-3.4-7.4-5.1-11.9-5.1
                c-4.6,0-8.7,1.6-11.9,4.9c-3.4,3.2-5,7.4-5,12c0,4.6,1.6,8.7,4.9,11.9C63.3,87,67.2,88.6,72,88.6z"/>
            <path fill='none' strokeWidth="11" stroke={stroke} d="M72,106c-12.9,0-24.4-3.2-34.7-9.6S19.2,82,14.2,71.7c5-10.3,12.9-18.6,23.1-25s21.8-9.4,34.7-9.4
                s24.4,3.2,34.7,9.4s18.2,14.7,23.1,25c-5,10.3-12.9,18.6-23.1,24.7C96.4,102.6,84.9,106,72,106z"/>
        </svg >
    )
}

export default Show
