
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
    value?: (Category | Bill | undefined)
    includeBills?: boolean
    onChange?: React.Dispatch<React.SetStateAction<Category | Bill | undefined>>
    month?: number
    year?: number
}

function StaticSelectCategoryBill({ value, onChange, includeBills = true, month, year }: I) {
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
                ? setFilteredBillCats([...categoryData, ...billData])
                : setFilteredBillCats(categoryData)
        }
    }, [isFetchCategoriesSuccess, isFetchBillsSuccess])

    // Filter billcats
    useEffect(() => {
        let data: (Category | Bill)[] | undefined
        if (categoryData && billData) {
            data = includeBills
                ? [...categoryData, ...billData]
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
        <Combobox value={value} onChange={onChange} as={'div'} className="select-bill-category">
            <div className="category-select--container">
                <SearchIcon />
                <Combobox.Input
                    ref={inputRef}
                    className="input"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    size={filteredBillCats.reduce((acc, curr) => Math.max(acc, curr.name.length), 0)}
                />
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
    defaultBillCat?: string
    control?: Control<any>
    name?: string
}

export const FullSelectCategoryBill =
    ({ SelectorComponent, defaultBillCat, includeBills, month, year, name, children, control }: Selector) => {

        const [value, onChange] = useState<Category | Bill | undefined>()
        const [showBillCatSelect, setShowBillCatSelect] = useState(false)
        const dropdownRef = useRef<HTMLDivElement>(null)
        const buttonRef = useRef<HTMLButtonElement>(null)

        const { start, end } = useGetStartEndQueryParams(month, year)
        const {
            data: categoryData,
            isSuccess: isFetchCategoriesSuccess
        } = useGetCategoriesQuery({ start, end, spending: false })
        const {
            data: billData,
            isSuccess: isFetchBillsSuccess
        } = useGetBillsQuery({ month, year })

        const { field } = useController({
            name: name || 'category',
            control,
            defaultValue: value
        })

        useAccessEsc({
            refs: [dropdownRef, buttonRef],
            visible: showBillCatSelect,
            setVisible: setShowBillCatSelect
        })

        // Set default billcat
        useEffect(() => {
            if (defaultBillCat && isFetchCategoriesSuccess && isFetchBillsSuccess) {
                const billcat = [...categoryData, ...billData].find((bc) => bc.id === defaultBillCat)
                if (billcat) {
                    onChange && onChange(billcat)
                }
            }
        }, [isFetchCategoriesSuccess, isFetchBillsSuccess])

        // Update field as value changes
        useEffect(() => {
            field.onChange(value?.id)
        }, [value])

        return (
            <div>
                <input
                    type='hidden'
                    value={value ? value.id : ''}
                    ref={field.ref}
                />
                <SelectorComponent
                    className={`bill-category-selector--button ${value ? 'valid' : ''} ${showBillCatSelect ? 'active' : ''}`}
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
                            : <span style={{ opacity: 0, visibility: 'hidden' }}>None</span>
                        }
                    </div>
                    <ArrowIcon size={'.8em'} stroke={'currentColor'} />
                    {children}
                </SelectorComponent>
                <DropAnimation
                    placement='left'
                    visible={showBillCatSelect}
                    className="dropdown"
                    ref={dropdownRef}
                >
                    <StaticSelectCategoryBill
                        includeBills={includeBills}
                        value={value}
                        onChange={onChange}
                        month={month}
                        year={year}
                    />
                </DropAnimation>
            </div>
        )
    }

export default StaticSelectCategoryBill
