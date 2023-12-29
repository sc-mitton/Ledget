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

type OptionValue = object | string | number
type Option<T> = {
    id: string | number
    value: T
    disabled?: boolean
}

interface ComboSelectPropsMultiple<V extends OptionValue> {
    multiple?: true
    defaultValue?: V[]
    value?: V[]
    onChange: React.Dispatch<React.SetStateAction<V[] | undefined>>
}

interface ComboSelectPropsSingle<V extends OptionValue> {
    multiple?: false
    defaultValue?: V
    value?: V
    onChange: React.Dispatch<React.SetStateAction<V | undefined>>
}

type ComboSelectProps<V extends OptionValue, O extends Option<V>> = (ComboSelectPropsMultiple<V> | ComboSelectPropsSingle<V>) & {
    limit?: number
    name?: string
    children?: React.ReactNode | (({ open }: { open: boolean }) => React.ReactNode)
    syncOptions?: (options: O[]) => void
}

type TDataContextBaseProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    active?: Option<OptionValue>
    setActive: React.Dispatch<React.SetStateAction<Option<OptionValue> | undefined>>
    options: Option<OptionValue>[]
    setOptions: React.Dispatch<React.SetStateAction<Option<OptionValue>[]>>
    buttonRef: React.RefObject<HTMLButtonElement>
    ulRef: React.RefObject<HTMLUListElement>
    customRef: React.RefObject<HTMLInputElement>
    custom: Option<OptionValue>[]
    setCustom: React.Dispatch<React.SetStateAction<Option<OptionValue>[]>>
}

type TDataContext = TDataContextBaseProps & ComboSelectProps<OptionValue, Option<OptionValue>>
const DataContext = createContext<TDataContext | undefined>(undefined)

const useDataContext = () => {
    const context = useContext(DataContext)
    if (!context) {
        throw new Error(`ComboSelect compound components cannot be rendered outside the ComboSelect component`)
    }
    return context
}

const ComboSelect = <TV extends OptionValue, TO extends { id: string | number, value: TV, disabled?: boolean }>
    (props: ComboSelectProps<TV, TO>) => {
    const { defaultValue, onChange, children, ...rest } = props
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState<TO>()
    const [options, setOptions] = useState<TO[]>([])
    const [custom, setCustom] = useState<TO[]>([])
    const buttonRef = useRef<HTMLButtonElement>(null)
    const ulRef = useRef<HTMLUListElement>(null)
    const customRef = useRef<HTMLInputElement>(null)

    const data = {
        onChange,
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
        ...rest
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
                if (buttonRef)
                    (buttonRef.current as any) = e
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
        ulRef.current?.focus()

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
    option: Option<OptionValue>
    disabled?: boolean
    children: ({ active, selected, disabled }: { active: boolean, selected?: boolean, disabled?: boolean }) => React.ReactNode
}

const Option = ({ option, disabled, children }: OptionProps) => {

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
        setOptions
    } = useDataContext()

    // Updating the active list
    const updateValue = () => {
        if (multiple) {
            onChange((prev) => {
                if (limit && prev?.length === limit) {
                    return prev
                } else if (prev?.includes(option.value)) {
                    return prev.filter((item) => item !== option.value)
                } else if (prev) {
                    return [...prev, option.value]
                } else {
                    return [option.value]
                }
            })
        } else {
            onChange(option.value as any)
        }
    }

    // If value is in custom list, remove it entirely
    const updateOptions = () => {
        if (custom.includes(option)) {
            setOptions((prev) => prev.filter((item) => item !== option))
            setCustom((prev) =>
                prev.filter((item) => item !== option.value))
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
            aria-selected={Array.isArray(contextValue)
                ? contextValue?.some((item) => item === option.value)
                : contextValue === option.value}
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
                selected: Array.isArray(contextValue)
                    ? contextValue?.some((item) => item === option.value)
                    : contextValue === option.value,
                disabled: disabled
            })}
        </li>
    )
}

type CustomInputProps = {
    children: ({ focused }: { focused: boolean }) => React.ReactNode
    transformValue?: (value?: string | number | readonly string[] | undefined) => any
    inputSize?: number
} & Omit<ComponentPropsWithRef<'input'>, | 'children'>

const Custom = forwardRef<HTMLInputElement, CustomInputProps>((props, ref) => {
    const {
        multiple,
        customRef,
        ulRef,
        onChange,
        setCustom,
        setOpen,
        options,
        setOptions,
        setActive,
        syncOptions,
    } = useDataContext()
    const {
        children,
        onBlur,
        onFocus,
        onKeyDown,
        transformValue,
        value,
        ...rest
    } = props
    const [focused, setFocused] = useState(false)

    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault()

        // Add new option to options list
        const cleanedVal = transformValue ? transformValue(value) : value
        setOptions((prev) => {
            const updatedArray = prev.some((item) => item.value === cleanedVal.value)
                ? prev
                : [...prev, cleanedVal]

            updatedArray.sort((a, b) => a.value - b.value)
            return updatedArray
        })

        // Add new option to selected values
        onChange && onChange((prev) =>
            prev?.some((item) => item === cleanedVal.value)
                ? prev
                : multiple ? prev?.concat(cleanedVal.value) : [cleanedVal.value]
        )

        // Add to list of custom options
        setCustom((prev) => {
            const updatedArray = prev.some((item) => item === cleanedVal.value)
                ? prev
                : [...prev, cleanedVal.value]

            return updatedArray
        })
    }

    // Sync options with parent
    useEffect(() => {
        syncOptions && syncOptions(options)
    }, [options])

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        // execute prop function
        onFocus && onFocus(event)
        setFocused(true)
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        // execute prop function
        setFocused(false)
        ulRef.current?.focus()
        setActive(options[options.length - 1])
        onBlur && onBlur(event)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        event.stopPropagation()
        switch (event.key) {
            case 'ArrowUp':
                setFocused(false)
                customRef.current?.blur()
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
                value={value}
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
