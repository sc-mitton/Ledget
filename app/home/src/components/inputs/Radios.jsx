import React, { useRef, useEffect, useState, createContext, useContext } from 'react'

import { animated } from '@react-spring/web'

import { usePillAnimation } from '@utils/hooks'
import './styles/Radios.css'


const RadioContext = createContext(null)

const Radios = (props) => {
    const { value: propValue, onChange: propOnChange, children, ...rest } = props

    const ref = useRef(null)
    const [value, setValue] = useState(propValue || '')

    const handleChange = (newValue) => {
        setValue(newValue)
        propOnChange && propOnChange(newValue)
    }

    const data = {
        value,
        onChange: handleChange,
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

const Input = (props) => {
    const [selected, setSelected] = useState(false)
    const { option, children, style, ...rest } = props
    const { value, onChange } = useContext(RadioContext)

    const handleClick = (e) => {
        e.preventDefault()
        onChange(option.value)
    }

    const handleKeyDown = (e) => {
        (e.key === 'Enter' || e.key === ' ') && onChange(option.value)
    }

    useEffect(() => {
        if (option.default) {
            onChange(option.value)
            setSelected(true)
        }
    }, [])

    useEffect(() => {
        setSelected(value === option.value)
    }, [value])

    return (
        <>
            <input
                type="radio"
                name={option.name}
                value={option.value}
                onChange={(event) => onChange(event.target.value)}
                checked={value === option.value ? true : false}
            />
            <label
                style={{
                    zIndex: '2',
                    position: 'relative',
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
    const { styles, ...rest } = props
    const { value, ref } = useContext(RadioContext)

    const animationConfig = {
        ref: ref,
        querySelectall: 'label',
        update: [value],
        refresh: [],
        styles: {
            zIndex: 1,
            ...styles
        },
        ...rest,
        find: (element) => element.htmlFor === value || element.name === value
    }

    const { props: pillProps } = usePillAnimation(animationConfig)

    return (
        <animated.span style={pillProps} />
    )
}

const GreenRadios = (props) => {
    const { options, ...rest } = props

    return (
        <Radios
            {...rest}
            className="green-radios-container"
        >
            <Pill styles={{ backgroundColor: 'var(--green-hlight3)' }} />
            {options.map((option, index) => (
                <Input
                    key={index}
                    option={option}
                    className="green-radios-container-label"
                >
                    <span>
                        {option.label}
                    </span>
                </Input>
            ))}
        </Radios>
    )
}

Radios.Input = Input
Radios.Pill = Pill
export default Radios
export { GreenRadios }
