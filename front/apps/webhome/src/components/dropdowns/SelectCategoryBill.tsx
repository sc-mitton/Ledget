
import {
    ForwardRefExoticComponent,
    RefAttributes,
    ButtonHTMLAttributes,
    useState,
    Fragment,
    useEffect,
    useRef
} from 'react'

import { Combobox } from "@headlessui/react"
import { useController, Control } from 'react-hook-form'

import './SelectCategoryBill.scss'
import { Category, useGetCategoriesQuery } from '@features/categorySlice'
import { Bill, useGetBillsQuery } from '@features/billSlice'
import { SearchIcon, ArrowIcon } from '@ledget/media'
import { LoadingRingDiv, DropAnimation, useAccessEsc } from '@ledget/ui'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'

interface I {
    default?: string,
    value?: (Category | Bill | undefined)
    includeBills?: boolean
    includeCategories?: boolean
    onChange?: React.Dispatch<React.SetStateAction<Category | Bill | undefined>>
    month?: number
    year?: number
    multiple?: boolean
    name?: string
}

function StaticSelectCategoryBill({ value, name, onChange, includeBills = true, includeCategories = true, month, year }: I) {
    const [query, setQuery] = useState('')
    const { start, end } = useGetStartEndQueryParams(month, year)
    const {
        data: categoryData,
        isLoading: isFetchingCategories,
        isSuccess: isFetchCategoriesSuccess
    } = useGetCategoriesQuery({ start, end, spending: false })
    const {
        data: billData,
        isSuccess: isFetchBillsSuccess
    } = useGetBillsQuery({ month, year })

    const [filteredBillCats, setFilteredBillCats] = useState<(Category | Bill)[]>([])
    const inputRef = useRef<HTMLInputElement>(null)

    // Set billcats
    useEffect(() => {
        if (categoryData && billData) {
            includeBills
                ? includeCategories
                    ? setFilteredBillCats([...categoryData, ...billData])
                    : setFilteredBillCats(billData)
                : setFilteredBillCats(categoryData)
        }
    }, [isFetchCategoriesSuccess, isFetchBillsSuccess])

    // Filter billcats
    useEffect(() => {
        let data: (Category | Bill)[] | undefined
        if (categoryData && billData) {
            data = includeBills
                ? includeCategories
                    ? [...categoryData, ...billData]
                    : billData
                : categoryData
        }
        if (query && data) {
            setFilteredBillCats(
                data?.filter((billcat) => {
                    const name = billcat.name.toLowerCase()
                    const queryLower = query.toLowerCase()
                    return name.includes(queryLower)
                })
            )
        } else {
            setFilteredBillCats(data || [])
        }
    }, [query])

    useEffect(() => { inputRef.current?.focus() }, [])

    return (
        <Combobox
            name={name}
            value={value}
            onChange={onChange}
            as={'div'}
            className="select-bill-category"
        >
            <div className="category-select--container">
                <div>
                    <SearchIcon />
                    <Combobox.Input
                        ref={inputRef}
                        className="input"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        size={filteredBillCats.reduce((acc, curr) => Math.max(acc, curr.name.length), 0)}
                    />
                </div>
                {isFetchingCategories || !isFetchBillsSuccess
                    ? <LoadingRingDiv loading={true} style={{ height: '2em' }} />
                    : <Combobox.Options className="options" static>
                        {filteredBillCats.map((billcat) => (
                            <Combobox.Option key={billcat.id} value={billcat} as={Fragment}>
                                {({ active, selected }) => (
                                    <li
                                        className={`option
                                    ${active ? 'active' : ''} ${selected ? 'selected' : ''}
                                    ${billcat.period === 'year' ? 'year' : 'month'}`}
                                    >
                                        <span>{billcat.emoji}</span>
                                        <span>{billcat.name.charAt(0).toUpperCase()}{billcat.name.slice(1)}</span>
                                    </li>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                }
            </div>
        </Combobox>
    )
}

interface Selector extends Omit<I, 'value' | 'onChange'> {
    SelectorComponent: ForwardRefExoticComponent<ButtonHTMLAttributes<HTMLButtonElement>
        & RefAttributes<HTMLButtonElement>>
    children?: React.ReactNode
    placeholder?: string
    control?: Control<any>
}

export const FullSelectCategoryBill =
    ({ SelectorComponent, placeholder, children, control, ...rest }: Selector) => {

        const [value, onChange] = useState<Category | Bill | undefined>()
        const [showBillCatSelect, setShowBillCatSelect] = useState(false)
        const dropdownRef = useRef<HTMLDivElement>(null)
        const buttonRef = useRef<HTMLButtonElement>(null)
        const name = useRef<string>(rest.name ||
            !rest.includeBills
            ? 'category'
            : !rest.includeCategories ? 'bill' : 'item'
        )

        // Controll for react-hook-form
        const { field } = useController({
            name: name.current,
            control,
        })

        // Update controller on value change
        useEffect(() => {
            field.onChange(value)
        }, [value])

        useAccessEsc({
            refs: [dropdownRef, buttonRef],
            visible: showBillCatSelect,
            setVisible: setShowBillCatSelect
        })

        return (
            <div className="bill-cat-select--container--container">
                <SelectorComponent
                    className={`bill-category-selector--button
                        ${value ? 'valid' : 'placeholder'}
                        ${showBillCatSelect ? 'active' : ''}`}
                    type='button'
                    onClick={() => setShowBillCatSelect(!showBillCatSelect)}
                    ref={buttonRef}
                >
                    <div className="selector-current-label">
                        {value ?
                            <>
                                <span>{value?.emoji}</span>
                                <span>{value?.name.charAt(0).toUpperCase()}{value?.name.slice(1)}</span>
                            </>
                            : placeholder
                                ? `${placeholder}`
                                : <span style={{ opacity: 0, visibility: 'hidden' }}>None</span>
                        }
                    </div>
                    <ArrowIcon size={'.8em'} stroke={'currentColor'} />
                    {children}
                </SelectorComponent>
                <div>
                    <DropAnimation
                        placement='left'
                        visible={showBillCatSelect}
                        className="dropdown"
                        ref={dropdownRef}
                    >
                        <StaticSelectCategoryBill
                            value={value}
                            onChange={onChange}
                            {...rest}
                            name={name.current}
                        />
                    </DropAnimation>
                </div>
            </div>
        )
    }

export default StaticSelectCategoryBill
