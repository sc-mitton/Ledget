'react'

const Calendar
    = ({
        className = 'calendar-icon',
        fill = "currentColor",
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
                transform="translate(0, 0)"
            >
                <path fill={fill} d="M108.7,20H100v-8.1H90V20H77v-8.1H67V20H54v-8.1H44V20h-8.7c-12,0-21.8,9.8-21.8,21.8v68.5c0,12,9.8,21.8,21.8,21.8h73.4
                    c5.9,0,11.4-2.3,15.5-6.5c4.1-4.2,6.3-9.7,6.3-15.4V41.8C130.5,29.8,120.7,20,108.7,20z M35.3,30H44v8h10v-8h13v8h10v-8h13v8h10v-8
                    h8.7c6.5,0,11.8,5.3,11.8,11.8v7.9h-97v-7.9C23.5,35.3,28.8,30,35.3,30z M117.1,118.6c-2.2,2.3-5.2,3.5-8.4,3.5H35.3
                    c-6.5,0-11.8-5.3-11.8-11.8V59.7h97v50.6C120.5,113.4,119.3,116.4,117.1,118.6z"/>
            </svg >
        )
    }

export default Calendar

