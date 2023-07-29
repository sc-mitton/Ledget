import React, { useRef, useState } from 'react'


import { animated } from '@react-spring/web'

import { usePillAnimation } from '@utils/hooks'
import './styles/Radios.css'
import { useEffect } from 'react'


const Radios = ({ options }) => {
    const containerRef = useRef(null)
    const [selection, setSelection] = useState(null)

    useEffect(() => {
        options.find((option) => {
            option.default && setSelection(option.value)
        })
    }, [])

    const { props } = usePillAnimation({
        ref: containerRef,
        querySelectall: 'label',
        update: [selection],
        refresh: [],
        styles: {
            backgroundColor: 'var(--green-highlight3)',
            zIndex: 1
        },
        find: (element) => element.htmlFor === selection
    })

    const containerStyle = {
        position: 'relative'
    }

    return (
        <fieldset className="slider-radios-container"  >
            <div style={containerStyle} ref={containerRef}>
                {
                    options.map((option, index) => (
                        <React.Fragment key={index}>
                            <input
                                type="radio"
                                name={option.name}
                                value={option.value}
                                onChange={(event) => setSelection(event.target.value)}
                                checked={selection === option.value}
                            />
                            <label
                                htmlFor={option.value}
                                onClick={(event) => setSelection(option.value)}
                                onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && setSelection(option.value)}
                                tabIndex={0}
                            >
                                <span>
                                    {option.label}
                                </span>
                            </label>
                        </React.Fragment>
                    ))
                }
                <animated.span style={props} />
            </div>
        </fieldset>
    )
}

export default Radios
