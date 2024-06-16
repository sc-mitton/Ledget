import * as React from "react"
import Svg, { Path, Circle } from "react-native-svg"
import { NativeSvgProps } from "../../types"

function SvgComponent(props: NativeSvgProps) {
    return (
        <Svg
            x="0px"
            y="0px"
            viewBox="0 0 288 288"
            strokeMiterlimit={10}
            strokeWidth={5.7154}
            {...props}
        >
            <Path
                d="M46.7 183.2V71.3c0-4.3 3.4-7.6 7.6-7.6h180.1c4.3 0 7.6 3.4 7.6 7.6l.1 111.8"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
            />
            <Path
                d="M261.3 210.8H27.5c-3.4 0-6.2-2.6-6.2-5.9v-3.8c0-3.2 2.8-5.9 4.8-5.9H260c4.8 0 7.6 2.6 7.6 5.9v3.8c-.1 3.3-2.9 5.9-6.3 5.9z"
                fill="none"
                stroke="currentColor"
            />
            <Circle cx={144.4} cy={80.7} r={4.8} fill="#242424" />
        </Svg>
    )
}

export default SvgComponent
