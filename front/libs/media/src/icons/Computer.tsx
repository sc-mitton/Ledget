const Computer = ({
    className = '',
    width = "4.5em",
    height = "4.5em",
    fill = 'var(--icon-full)',
    fill2 = 'var(--btn-feather-light-gray)'
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
                    <path fill={fill2} d="M53.8,187.7c-1.3-1.3-2.1-3.1-2.1-5.1V85.9c0-4,3.2-7.2,7.2-7.2h170.2c1.8,0,3.5,0.7,4.8,1.8L53.8,187.7z" />
                    <path fill={fill} d="M277.7,210.9l-25.9-9.6c-0.6-1.1-0.9-2.4-0.9-3.6V73.6c0-4.2-3.4-7.6-7.6-7.6H44.7c-4.2,0-7.6,3.4-7.6,7.6
                    v124.1c0,1.3-0.3,2.5-0.9,3.6l-25.9,9.6c-2.7,5,1,11.1,6.7,11.1h254C276.8,222,280.4,215.9,277.7,210.9z M165.7,213.7
                    c0,1.8-1.5,3.3-3.3,3.3h-39.2c-1.8,0-3.3-1.5-3.3-3.3v-1.9h45.8V213.7z M236.3,182.6c0,4-3.2,7.2-7.2,7.2H58.9
                    c-4,0-7.2-3.2-7.2-7.2V85.9c0-4,3.2-7.2,7.2-7.2h170.2c4,0,7.2,3.2,7.2,7.2V182.6z"/>
                </g>
            </svg>
        </>
    )
}

export default Computer
