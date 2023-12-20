import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useRef,
    forwardRef,
    ComponentPropsWithRef,
} from 'react'

import { useClickClose } from '@ledget/ui'

type OptionValue = {
    [key: string]: any
}

type Option = {
    value: OptionValue
    [key: string]: any
}

interface ComboSelectBaseProps {
    limit?: number
    name?: string
    children?: React.ReactNode | (({ open }: { open: boolean }) => React.ReactNode)
}

interface ComboSelectPropsMultiple<Op, Val> extends ComboSelectBaseProps {
    multiple?: true
    value?: Val[]
    defaultValue?: Val[]
    onChange?: React.Dispatch<React.SetStateAction<Val[] | undefined>>
    setSelections: React.Dispatch<React.SetStateAction<Op[]>>
}

interface ComboSelectPropsSingle<Op, Val> extends ComboSelectBaseProps {
    multiple?: false
    value?: Val
    defaultValue?: Val
    onChange?: React.Dispatch<React.SetStateAction<Val | undefined>>
    setSelections?: React.Dispatch<React.SetStateAction<Op>>
}

type ComboSelectProps<Op, Val> = ComboSelectPropsMultiple<Op, Val> | ComboSelectPropsSingle<Op, Val>

type TDataContext = ComboSelectProps<Option, OptionValue> & {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    active: any
    setActive: React.Dispatch<React.SetStateAction<Option | undefined>>
    options: Option[]
    setOptions: React.Dispatch<React.SetStateAction<Option[]>>
    buttonRef: React.MutableRefObject<HTMLButtonElement>
    ulRef: React.MutableRefObject<HTMLUListElement>
    customRef: React.MutableRefObject<HTMLInputElement>
    custom: OptionValue[]
    setCustom: React.Dispatch<React.SetStateAction<Option[]>>
}

const DataContext = createContext<TDataContext | undefined>(undefined)

const useDataContext = () => {
    const context = useContext(DataContext)
    if (!context) {
        throw new Error(`ComboSelect compound components cannot be rendered outside the ComboSelect component`)
    }
    return context
}

const ComboSelect = <Op extends Option, Val extends OptionValue>(props: ComboSelectProps<Op, Val>) => {
    const { value, defaultValue, onChange, setSelections, limit, multiple = false, children } = props
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState<Op>()
    const [options, setOptions] = useState<Op[]>([])
    const [custom, setCustom] = useState<Val[]>([])
    const buttonRef = useRef<HTMLButtonElement>(null)
    const ulRef = useRef<HTMLUListElement>(null)
    const customRef = useRef<HTMLInputElement>(null)

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

    // Set default value
    useEffect(() => {
        onChange && onChange(defaultValue as any)
    }, [])

    return (
        <DataContext.Provider value={data as any}>
            {typeof children === 'function' ? children({ open }) : children}
        </DataContext.Provider>
    )
}

interface ButtonProps {
    as?: React.FC<ComponentPropsWithRef<'button'>>
}

const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps>((props, ref) => {
    const { setOpen, open, buttonRef, setActive, options } = useDataContext()
    const { as } = props
    const Component = as || 'button'

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()
        setOpen(!open)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        if (event.key === 'Enter') {
            !open && setActive(options[0])
            setOpen(!open)
        }
    }

    return (
        <Component
            ref={(e) => {
                if (ref) {
                    if (typeof ref === 'function') {
                        ref(e)
                    } else {
                        ref.current = e
                    }
                }
                if (buttonRef) {
                    (buttonRef.current as any) = e
                }
            }}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            {...props}
        />
    )
})

interface OptionsProps {
    children: React.ReactNode
    static?: boolean
    style?: React.CSSProperties
    className?: string
}

const Options = (props: OptionsProps) => {
    const {
        multiple,
        open,
        setOpen,
        setActive,
        options,
        buttonRef,
        ulRef,
        customRef
    } = useDataContext()

    const { children, static: isStatic, style, ...rest } = props

    useClickClose({
        refs: [ulRef, buttonRef],
        visible: open,
        setVisible: setOpen,
    })

    // ul focus on open
    useEffect(() => {
        ulRef.current.focus()

        const handleTab = (event: KeyboardEvent) => {
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
            setActive(undefined)
        }
    }, [open])

    // Keyboard nav
    const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
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
                (ulRef?.current?.querySelector(`[headlessui-state='active']`) as any)?.click()
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
                            minWidth: `${buttonRef.current?.offsetWidth}px`,
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

interface OptionProps {
    option: Option
    disabled?: boolean
    isDefault?: boolean
    children: ({ active, selected, disabled }: { active: boolean, selected?: boolean, disabled?: boolean }) => React.ReactNode
}

const Option = ({ option, disabled, isDefault, children }: OptionProps) => {

    const {
        multiple,
        limit,
        value: contextValue,
        active: contextActive,
        custom,
        options,
        onChange,
        setCustom,
        setActive,
        setOptions,
        setSelections,
        setOpen
    } = useDataContext()

    // Updating the active list
    const updateValue = () => {
        if (multiple) {
            if (limit && contextValue?.length === limit) {
                return
            } else if (contextValue?.includes(option.value)) {
                onChange && onChange(contextValue.filter((item) => item !== option.value))
            } else if (contextValue) {
                onChange && onChange([...contextValue, option.value])
            } else {
                onChange && onChange([option.value])
            }
        } else {
            onChange && onChange(option.value as any)
            setOpen(false)
        }
    }

    // If value is in custom list, remove it entirely
    const updateOptions = () => {
        if (custom.includes(option.value)) {
            setSelections && setSelections((prev: any) =>
                prev.filter((item: any) => item.value !== option.value))
            setCustom((prev: any) =>
                prev.filter((item: any) => item !== option.value))
        }
    }

    const handleClick = () => {
        updateValue()
        updateOptions()
    }

    // On mount add option to options list
    useEffect(() => {
        setOptions((prev) => {
            if (prev.some((item) => item === option)) {
                return prev
            }
            return [...prev, option]
        })
    }, [])

    return (
        <li
            role="option"
            aria-selected={multiple ? contextValue?.includes(option.value) : contextValue === option.value}
            headlessui-state={!disabled && contextActive === option ? 'active' : null}
            tabIndex={-1}
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    handleClick()
                }
            }}
            onMouseEnter={() => setActive(options.find((item) => item === option))}
            onMouseLeave={() => setActive(undefined)}
            onClick={handleClick}
        >
            {children({
                active: !disabled && contextActive === option,
                selected:
                    (multiple && !disabled)
                        ? contextValue?.some((item) => item === option)
                        : contextValue === option,
                disabled: disabled
            })}
        </li>
    )
}

type CustomInputProps = {
    children: ({ focused }: { focused: boolean }) => React.ReactNode
    getValue?: (value: any) => any
    value?: OptionValue
    inputSize?: number
} & Omit<ComponentPropsWithRef<'input'>, | 'value' | 'children'>

const Custom = forwardRef<HTMLInputElement, CustomInputProps>((props, ref) => {
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
    } = useDataContext()
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

    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault()

        // Add new option to options list
        const cleanedVal = getValue ? getValue(value) : value
        setSelections && setSelections((prev: any) => {
            const updatedArray = prev.some((item: any) => item.value === cleanedVal.value)
                ? prev
                : [...prev, cleanedVal]

            updatedArray.sort((a: any, b: any) => a.value - b.value)
            return updatedArray
        })

        // Add new option to selected values
        onChange && onChange((prev: any) =>
            prev.some((item: any) => item === cleanedVal.value)
                ? prev
                : multiple ? [...prev, cleanedVal.value] : [cleanedVal.value]
        )

        // Add to list of custom options
        setCustom((prev: any) => {
            const updatedArray = prev.some((item: any) => item === cleanedVal.value)
                ? prev
                : [...prev, cleanedVal.value]

            return updatedArray
        })
    }

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        // execute prop function
        onFocus && onFocus(event)
        setFocused(true)
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        // execute prop function
        setFocused(false)
        ulRef.current.focus()
        setActive(options[options.length - 1])
        onBlur && onBlur(event)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
                ref={(e) => {
                    if (ref) {
                        if (typeof ref === 'function') {
                            ref(e)
                        } else {
                            ref.current = e
                        }
                    }
                    if (customRef) {
                        (customRef.current as any) = e
                    }
                }}
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
