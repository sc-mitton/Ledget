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
            backgroundColor: 'var(--green-hlight3)',
            zIndex: 1
        },
        find: (element) => element.htmlFor === selection
    })

    return (
        <fieldset
            style={{
                display: 'inline-block',
            }}
        >
            <div className="slider-radios-container" ref={containerRef}>
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
                                onKeyDown={(event) =>
                                    (event.key === 'Enter' || event.key === ' ')
                                    && setSelection(option.value)
                                }
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

const radioOptions = [
    { name: 'categoryType', value: 'month', label: 'Month', default: true },
    { name: 'categoryType', value: 'year', label: 'Year' },
]

export const PeriodRadios = () => {
    return (
        <div style={{ paddingLeft: '4px', display: 'inline-block' }}>
            <Radios options={radioOptions} />
        </div>
    )
}

export default Radios
