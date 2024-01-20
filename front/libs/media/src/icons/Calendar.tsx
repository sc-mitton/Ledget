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
                <path fill={fill} d="M112.5,14.6h-9.6V5.7h-11v8.9H77.5V5.7h-11v8.9H52.1V5.7h-11v8.9h-9.6c-13.2,0-24.1,10.8-24.1,24.1v75.6
                    c0,13.2,10.8,24.1,24.1,24.1h81c6.5,0,12.6-2.5,17.1-7.2c4.5-4.6,7-10.7,7-17V38.7C136.5,25.4,125.7,14.6,112.5,14.6z M31.5,25.7
                    h9.6v8.8h11v-8.8h14.3v8.8h11v-8.8h14.3v8.8h11v-8.8h9.6c7.2,0,13,5.8,13,13v8.7h-107v-8.7C18.5,31.5,24.3,25.7,31.5,25.7z
                    M121.8,123.4c-2.4,2.5-5.7,3.9-9.3,3.9h-81c-7.2,0-13-5.8-13-13V58.4h107v55.8C125.5,117.7,124.2,121,121.8,123.4z"/>
            </svg >
        )
    }

export default Calendar

