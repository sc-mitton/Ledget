import React, { createContext, useState, useContext, useEffect, useRef } from 'react'

import { useClickClose } from '@utils'
import { set } from 'react-hook-form'

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
    const { setOpen, open, buttonRef, setActive, options } = useContext(DataContext)
    const { children, ...rest } = props

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
            ref={buttonRef}
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
}

const Options = (props) => {
    const {
        multiple,
        open,
        setOpen,
        setActive,
        options,
        buttonRef,
        customRef
    } = useContext(DataContext)
    const ref = useRef(null)
    const { children, static: isStatic, style, ...rest } = props

    useClickClose({
        refs: [ref, buttonRef],
        visible: open,
        setVisible: setOpen,
    })

    // ul focus on open
    useEffect(() => {
        if (open) {
            ref.current.focus()
        }
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
                ref.current.querySelector(`[headlessui-state="active"]`).click()
                break
            case 'Tab':
            case 'Escape':
                setOpen(false)
                break
            default:
                break
        }
    }

    // Refocus ul when custom input is blurred
    useEffect(() => {
        const handleBlur = (event) => {
            if (event.relatedTarget !== ref.current) {
                ref.current.focus()
                setActive(options[options.length - 1])
            }
        }
        customRef.current?.addEventListener('blur', handleBlur)
        return () => {
            customRef.current?.removeEventListener('blur', handleBlur)
        }
    }, [])

    return (
        <>
            {(open || isStatic) &&
                <div >
                    <ul
                        ref={ref}
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
            if (contextValue.includes(value)) {
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
            aria-selected={contextValue.includes(value) || contextValue === value}
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
        onChange,
        setSelections,
        setCustom,
        setOpen,
        setActive
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
        event.preventDefault()
        event.stopPropagation()
        onKeyDown && onKeyDown(event) // execute prop function
        switch (event.key) {
            case 'ArrowUp':
                customRef.current.blur()
                break
            case 'Enter':
                handleEnter(event)
                break
            case 'Tab':
                setOpen(false)
                break
            default:
                break
        }
    }

    const handleFocus = (event) => {
        event.preventDefault()
        onFocus && onFocus(event) // execute prop function
        setFocused(true)
        setActive([])
    }

    const handleBlur = (event) => {
        event.preventDefault()
        onBlur && onBlur(event) // execute prop function
        setFocused(false)
    }

    return (
        <>
            <input
                type="text"
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
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
