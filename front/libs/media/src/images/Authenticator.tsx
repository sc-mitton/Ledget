
const Authenticator = ({
    fill = 'var(--main-dark)',
    fill2 = 'var(--window)',
    size = '7em'
}) => {

    return (
        <svg
            height={size}
            fill={fill}
            viewBox='0 0 288 288'
            aria-label="authenticate"
            x="0px"
            y="0px"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g>
                <path fill={fill} d="M189.2,42.1H102c-9.1,0-16.5,7.4-16.5,16.5v170.8c0,9.1,7.4,16.5,16.5,16.5h87.2c9.1,0,16.3-7.4,16.5-16.4
                    V58.6C205.7,49.5,198.3,42.1,189.2,42.1z"/>
                <path fill={fill2} d="M196.4,228.1c0,4.7-3.9,8.6-8.6,8.6h-84.6c-4.7,0-8.6-3.8-8.6-8.5V59.8c0-4.7,3.9-8.6,8.6-8.6h84.6
                    c4.7,0,8.6,3.9,8.6,8.6V228.1z"/>
                <circle fill={fill} cx="145.6" cy="67.8" r="6.3" />
            </g>
            <circle fill={fill} cx="117.6" cy="144.6" r="6.2" />
            <circle fill={fill} cx="136.2" cy="144.6" r="6.2" />
            <circle fill={fill} cx="154.8" cy="144.6" r="6.2" />
            <circle fill={fill} cx="173.4" cy="144.6" r="6.2" />
        </svg >
    )
}

export default Authenticator
