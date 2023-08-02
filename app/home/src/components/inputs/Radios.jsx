import React, { useRef, useState, createContext, useContext } from 'react'

import { animated } from '@react-spring/web'

import { usePillAnimation } from '@utils/hooks'
import './styles/Radios.css'
import { useEffect } from 'react'


const RadioContext = createContext(null)

const Radios = (props) => {
    const { children, ...rest } = props
    const [choice, setChoice] = useState(null)
    const ref = useRef(null)

    const data = {
        choice,
        setChoice,
        ref
    }

    return (
        <RadioContext.Provider value={data}>
            <fieldset>
                <div ref={ref} style={{ position: 'relative' }} {...rest}>
                    {children}
                </div>
            </fieldset>
        </RadioContext.Provider>
    )
}

const Option = (props) => {
    const [selected, setSelected] = useState(false)
    const { option, children, style, ...rest } = props
    const { choice, setChoice } = useContext(RadioContext)

    useEffect(() => {
        option.default && setChoice(option.value)
    }, [])

    const handleClick = (e) => {
        e.preventDefault()
        setChoice(option.value)
    }

    const handleKeyDown = (e) => {
        (e.key === 'Enter' || e.key === ' ')
            && setChoice(option.value)
    }

    useEffect(() => {
        setSelected(choice === option.value)
    }, [choice])

    return (
        <>
            <input
                type="radio"
                name={option.name}
                value={option.value}
                onChange={(event) => setChoice(event.target.value)}
                checked={choice === option.value ? true : false}
            />
            <label
                style={{
                    zIndex: '2',
                    ...style
                }}
                htmlFor={option.value}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                {...rest}
            >
                {typeof children === 'function' ? children({ selected }) : children}
            </label>
        </>
    )
}

const Pill = (props) => {
    const { styles } = props
    const { choice, ref } = useContext(RadioContext)

    const { props: pillProps } = usePillAnimation({
        ref: ref,
        querySelectall: 'label',
        update: [choice],
        refresh: [],
        styles: {
            zIndex: 1,
            ...styles
        },
        find: (element) => element.htmlFor === choice
    })

    return (
        <animated.span style={pillProps} />
    )
}

const GreenRadios = ({ options }) => {

    return (
        <Radios className="green-radios-container">
            <Pill styles={{ backgroundColor: 'var(--green-hlight3)' }} />
            {options.map((option, index) => (
                <Option
                    key={index}
                    option={option}
                    className="green-radios-container-label"
                >
                    <span>
                        {option.label}
                    </span>
                </Option>
            ))}
        </Radios>
    )
}

Radios.Option = Option
Radios.Pill = Pill
export default Radios
export { GreenRadios }
