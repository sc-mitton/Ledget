import React, { createContext, useState, useContext, useEffect, useRef } from 'react'

import { useAccessEsc } from '@utils'

const DataContext = createContext()

const HiddenInputs = ({ value, name }) => {
    const inputs = []

    const processValue = (value, currentName) => {
        switch (typeof value) {
            case 'object':
                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        processValue(item, `${currentName}[${index}]`)
                    })
                } else {
                    for (const key in value) {
                        processValue(value[key], `${currentName}[${key}]`)
                    }
                }
                break;
            case 'string':
            case 'number':
                inputs.push(
                    <input
                        key={`${currentName}`}
                        type="hidden"
                        name={currentName}
                        value={value}
                    />
                )
                break
            default:
                break
        }
    }

    processValue(value, name)
    return inputs
};

const ComboSelect = (props) => {
    const { value, onChange, setSelections, multiple } = props
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState(null)
    const [options, setOptions] = useState([])
    const [custom, setCustom] = useState([])
    const buttonRef = useRef(null)
    const customRef = useRef(null)

    const data = {
        value,
        onChange,
        setSelections,
        open,
        setOpen,
        active,
        setActive,
        options,
        setOptions,
        buttonRef,
        customRef,
        custom,
        setCustom,
        multiple
    }

    return (
        <DataContext.Provider value={data}>
            <HiddenInputs
                value={value}
                name={`${props.name}`}
            />
            {typeof props.children === 'function' ? props.children({ open }) : children}
        </DataContext.Provider>
    )
}

const Button = (props) => {
    const { setOpen, open, buttonRef } = useContext(DataContext)
    const { children, ...rest } = props

    const handleClick = (event) => {
        event.stopPropagation()
        setOpen(!open)
    }

    return (
        <button
            ref={buttonRef}
            onClick={handleClick}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            {...rest}
        >
            {children}
        </button>
    )
}

const Options = (props) => {
    const {
        multiple,
        open,
        setOpen,
        buttonRef,
        setActive,
        options,
        customRef
    } = useContext(DataContext)
    const ref = useRef(null)
    const { children, static: isStatic, style, ...rest } = props

    useAccessEsc({
        refs: [ref, buttonRef],
        visible: open,
        setVisible: setOpen,
    })

    // Keyboard navigation
    useEffect(() => {
        if (open) {
            const handleKeyDown = (event) => {
                if (event.key === 'ArrowDown' && document.activeElement !== customRef.current) {
                    event.preventDefault()
                    setActive((prev) => {
                        if (prev === null) {
                            return options[0]
                        } else if (prev === options[options.length - 1]) {
                            customRef.current?.focus()
                            return options[options.length - 1]
                        } else {
                            return options[options.findIndex((item) => item === prev) + 1]
                        }
                    })
                }
                if (event.key === 'ArrowUp' && document.activeElement !== customRef.current) {
                    event.preventDefault()
                    setActive((prev) => {
                        if (prev === null) {
                            return options[options.length - 1]
                        } else if (prev === options[0]) {
                            return options[0]
                        } else {
                            return options[options.findIndex((item) => item === prev) - 1]
                        }
                    })
                }
                if (event.key === 'Enter') {
                    event.preventDefault()
                    ref.current.querySelector(`[headlessui-state="active"]`).click()
                }
            }
            document.addEventListener('keydown', handleKeyDown)
            return () => {
                document.removeEventListener('keydown', handleKeyDown)
            }
        }
    }, [open, options])

    return (
        <>
            {(open || isStatic) &&
                <div ref={ref} >
                    <ul
                        aria-multiselectable={multiple}
                        aria-labelledby={buttonRef.current?.id}
                        aria-orientation='vertical'
                        role="listbox"
                        tabIndex={0}
                        style={{
                            position: 'absolute',
                            ...style
                        }}
                        {...rest}
                    >
                        {children}
                    </ul>
                </div>
            }
        </>
    )
}

const Option = ({ value, disabled, children }) => {

    const {
        multiple,
        value: contextValue,
        active: contextActive,
        custom,
        onChange,
        setCustom,
        setActive,
        setOptions,
        setSelections
    } = useContext(DataContext)

    // Updating the active list
    const updateValue = () => {
        if (multiple) {
            if (contextValue.includes(value)) {
                onChange(contextValue.filter((item) => item !== value))
            }
            else {
                onChange([...contextValue, value])
            }
        } else {
            onChange(value)
        }
    }

    // If value is in custom list, remove it entirely
    const updateOptions = () => {
        if (custom.includes(value)) {
            setSelections((prev) =>
                prev.filter((item) => item.value !== value)
            )
            setCustom((prev) =>
                prev.filter((item) => item !== value)
            )
        }
    }

    const handleClick = () => {
        updateValue()
        updateOptions()
    }

    // On mount add option to options list
    useEffect(() => {
        setOptions((prev) => {
            if (prev.some((item) => item === value)) {
                return prev
            }
            return [...prev, value]
        })
    }, [])

    return (
        <li
            role="option"
            aria-selected={value}
            headlessui-state={!disabled && contextActive === value ? 'active' : null}
            tabIndex={-1}
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    handleClick(event)
                }
            }}
            onMouseEnter={() => setActive(value)}
            onMouseLeave={() => setActive(null)}
            onClick={handleClick}
        >
            {children({
                active: !disabled && contextActive === value,
                selected:
                    (multiple && !disabled)
                        ? contextValue.some((item) => item === value)
                        : contextValue === value,
                disabled
            })}
        </li>
    )
}

const Custom = React.forwardRef((props, ref) => {
    const {
        customRef,
        onChange,
        multiple,
        setSelections,
        setCustom
    } = useContext(DataContext)
    const {
        children,
        onKeyDown,
        onBlur,
        onFocus,
        getValue,
        value,
        ...rest
    } = props
    const [focused, setFocused] = useState(false)

    const localRef = useRef(null)

    const handleEnter = (event) => {
        event.preventDefault()

        // Add new option to options list
        const cleanedVal = getValue ? getValue(value) : value
        setSelections((prev) => {
            const updatedArray = prev.some((item) => item.value === cleanedVal.value)
                ? prev
                : [...prev, cleanedVal]

            updatedArray.sort((a, b) => a.value - b.value)
            return updatedArray
        })

        // Add new option to selected values
        onChange((prev) =>
            prev.some((item) => item === cleanedVal.value)
                ? prev
                : multiple ? [...prev, cleanedVal.value] : [cleanedVal.value]
        )

        // Add to list of custom options
        setCustom((prev) => {
            const updatedArray = prev.some((item) => item === cleanedVal.value)
                ? prev
                : [...prev, cleanedVal.value]

            return updatedArray
        })
    }

    const handleKeyDown = (event) => {
        onKeyDown && onKeyDown(event)
        if (event.key === 'ArrowUp') {
            customRef.current.blur()
        }
        if (event.key === 'Enter') {
            handleEnter(event)
        }
    }

    const handleFocus = (event) => {
        event.preventDefault()
        onFocus && onFocus(event)
        setFocused(true)
    }

    const handleBlur = (event) => {
        event.preventDefault()
        onBlur && onBlur(event)
        setFocused(false)
    }

    return (
        <>
            <input
                type="text"
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                ref={ref}
                value={value}
                {...rest}
            />
            {children({ focused })}
        </>
    )
})

ComboSelect.Button = Button
ComboSelect.Options = Options
ComboSelect.Option = Option
ComboSelect.Custom = Custom

export default ComboSelect
