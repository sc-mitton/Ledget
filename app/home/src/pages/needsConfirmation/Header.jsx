import React, { useState } from 'react'

import { useSpring, animated } from '@react-spring/web'

import Replay from '@assets/svg/Replay'
import CheckAll from '@assets/svg/CheckAll'
import Tooltip from '@components/widgets/Tooltip'
import './styles/Header.css'


const RefreshButton = ({ onClick }) => {
    const [cycle, setCycle] = useState(1)

    const [props, set] = useSpring(() => ({
        transform: 'rotate(0deg)',
        config: { tention: 180, friction: 20 },
    }))

    const handleClick = () => {
        set.start({
            transform: `rotate(${-360 * cycle}deg)`,
            onRest: () => setCycle(cycle + 1),
        })
    }

    return (
        <Tooltip msg={"Refresh"} ariaLabel={"Refresh list"}>

            <button
                className='icon'
                id="refresh-icon"
                aria-label="Refresh"
                onClick={handleClick}
            >
                <animated.div
                    style={props}
                >
                    <Replay />
                </animated.div>
            </button>
        </Tooltip>
    )
}

const CheckAllButton = () => {

    return (
        <Tooltip msg={"Confirm all"} ariaLabel={"Confirm all items"}>
            <button
                className="icon"
                id="check-all-icon"
                aria-label="Check all"
            >
                <CheckAll />
            </button>
        </Tooltip>
    )
}

const NewItemsHeader = () => {
    return (
        <div id="needs-confirmation-header-container">
            <div id="needs-confirmation-header">
                <div>
                    <div id="number-of-items">
                        10
                    </div>
                    <h4>Need Confirmation</h4>
                </div>
                <div>
                    <RefreshButton />
                    <CheckAllButton />
                </div>
            </div>
        </div>
    )
}

export default NewItemsHeader
