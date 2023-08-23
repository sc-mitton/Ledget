import React, { createContext, useState, useContext, useEffect, useRef } from 'react'

import { useClickClose } from '@utils'

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
}

const ComboSelect = (props) => {
    const { value, onChange, setSelections, limit, multiple = false } = props
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState(null)
    const [options, setOptions] = useState([])
    const [custom, setCustom] = useState([])
    const buttonRef = useRef(null)
    const ulRef = useRef(null)
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
        ulRef,
        customRef,
        custom,
        setCustom,
        limit,
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

const Button = React.forwardRef((props, ref) => {
    const { setOpen, open, buttonRef, setActive, options } = useContext(DataContext)
    const { children, ...rest } = props

    const localRef = useRef(null)
    const propRef = ref || localRef

    const handleClick = (event) => {
        event.stopPropagation()
        setOpen(!open)
    }

    const handleKeyDown = (event) => {
        event.stopPropagation()
        if (event.key === 'Enter') {
            !open && setActive(options[0])
            setOpen(!open)
        }
    }

    return (
        <button
            ref={(e) => {
                buttonRef.current = e
                propRef.current = e
            }}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            {...rest}
        >
            {children}
        </button>
    )
})

const Options = (props) => {
    const {
        multiple,
        open,
        setOpen,
        active,
        setActive,
        options,
        buttonRef,
        ulRef,
        customRef
    } = useContext(DataContext)

    const { children, static: isStatic, style, ...rest } = props

    useClickClose({
        refs: [ulRef, buttonRef],
        visible: open,
        setVisible: setOpen,
    })

    // ul focus on open
    useEffect(() => {
        ulRef.current.focus()

        const handleTab = (event) => {
            if (event.key === 'Tab') {
                setOpen(false)
            }
        }

        window.addEventListener('keydown', handleTab)
        return () => {
            window.removeEventListener('keydown', handleTab)
        }
    }, [open])

    // Clear active on close
    useEffect(() => {
        if (!open) {
            setActive(null)
        }
    }, [open])

    // Keyboard nav
    const handleKeyDown = (e) => {
        e.stopPropagation()
        switch (e.key) {
            case 'ArrowDown':
                setActive((prev) => {
                    if (prev === null) {
                        return options[0]
                    } else if (prev === options[options.length - 1]) {
                        customRef.current?.focus()
                        if (!customRef.current) {
                            return options[options.length - 1]
                        }
                    } else {
                        return options[options.findIndex((item) => item === prev) + 1]
                    }
                })
                break
            case 'ArrowUp':
                setActive((prev) => {
                    if (prev === null) {
                        return options[options.length - 1]
                    } else if (prev === options[0]) {
                        return options[0]
                    } else {
                        return options[options.findIndex((item) => item === prev) - 1]
                    }
                })
                break
            case 'Enter':
                ulRef.current.querySelector(`[headlessui-state='active']`).click()
                break
            case 'Tab':
            case 'Escape':
                setOpen(false)
                break
            default:
                break
        }
    }

    return (
        <>
            {(open || isStatic) &&
                <div >
                    <ul
                        ref={ulRef}
                        aria-multiselectable={multiple}
                        aria-labelledby={buttonRef.current?.id}
                        aria-orientation='vertical'
                        role="listbox"
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
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
        setSelections,
        setOpen
    } = useContext(DataContext)

    // Updating the active list
    const updateValue = () => {
        if (multiple) {
            if (contextValue.length === limit) {
                return
            } else if (contextValue.includes(value)) {
                onChange(contextValue.filter((item) => item !== value))
            }
            else {
                onChange([...contextValue, value])
            }
        } else {
            onChange(value)
            setOpen(false)
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
            aria-selected={multiple ? contextValue.includes(value) : contextValue === value}
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
        multiple,
        customRef,
        ulRef,
        onChange,
        setSelections,
        setCustom,
        setOpen,
        options,
        setActive
    } = useContext(DataContext)
    const {
        children,
        onBlur,
        onFocus,
        onKeyDown,
        getValue,
        value,
        ...rest
    } = props
    const [focused, setFocused] = useState(false)

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

    const handleFocus = (event) => {
        // execute prop function
        onFocus && onFocus(event)
        setFocused(true)
    }

    const handleBlur = (event) => {
        // execute prop function
        setFocused(false)
        ulRef.current.focus()
        setActive(options[options.length - 1])
        onBlur && onBlur(event)
    }

    const handleKeyDown = (event) => {
        event.stopPropagation()
        switch (event.key) {
            case 'ArrowUp':
                setFocused(false)
                customRef.current.blur()
                break
            case 'Enter':
                handleEnter(event)
                break
            case 'Tab':
                setOpen(false)
                break
            default:
                onKeyDown && onKeyDown(event)
                break
        }
    }

    return (
        <>
            <input
                type="text"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                ref={(el) => {
                    customRef.current = el
                    ref.current = el
                }}
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
