'react'

const Calendar
    = ({
        className = 'calendar-icon',
        fill = "var(--icon-full)",
        size = "1.5em",
    }) => {

        return (
            <svg
                className={className}
                width={size}
                height={size}
                viewBox="0 0 144 144"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                aria-label="Calendar icon"
                transform="translate(0, -2)"
            >
                <path fill={fill} d="M109,21.5h-8.7v-8.1h-10v8.1h-13v-8.1h-10v8.1h-13v-8.1h-10v8.1h-8.7c-12,0-21.8,9.8-21.8,21.8v68.5
                    c0,12,9.8,21.8,21.8,21.8H109c5.9,0,11.4-2.3,15.5-6.5c4.1-4.2,6.3-9.7,6.3-15.4V43.3C130.8,31.3,121,21.5,109,21.5z M35.6,31.5h8.7
                    v8h10v-8h13v8h10v-8h13v8h10v-8h8.7c6.5,0,11.8,5.3,11.8,11.8v7.9h-97v-7.9C23.8,36.8,29.1,31.5,35.6,31.5z M117.4,120.1
                    c-2.2,2.3-5.2,3.5-8.4,3.5H35.6c-6.5,0-11.8-5.3-11.8-11.8V61.2h97v50.6C120.8,114.9,119.6,117.9,117.4,120.1z"/>
                <g>
                    {/* <circle fill={fill} cx="45.6" cy="92" r="4.9" />
                    <circle fill={fill} cx="63.4" cy="92" r="4.9" />
                    <circle fill={fill} cx="81.1" cy="92" r="4.9" />
                    <circle fill={fill} cx="98.9" cy="92" r="4.9" />
                    <circle fill={fill} cx="63.4" cy="108.5" r="4.9" />
                    <circle fill={fill} cx="81.1" cy="108.5" r="4.9" />
                    <circle fill={fill} cx="98.9" cy="108.5" r="4.9" />
                    <circle fill={fill} cx="45.6" cy="75.6" r="4.9" />
                    <circle fill={fill} cx="63.4" cy="75.6" r="4.9" />
                    <circle fill={fill} cx="81.1" cy="75.6" r="4.9" /> */}
                </g>
            </svg >
        )
    }

export default Calendar

