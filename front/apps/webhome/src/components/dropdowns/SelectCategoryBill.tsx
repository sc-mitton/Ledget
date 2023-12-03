
import {
    FC,
    ForwardRefExoticComponent,
    RefAttributes,
    ButtonHTMLAttributes,
    useState,
    Fragment,
    useEffect,
    useRef
} from 'react'

import { Combobox } from "@headlessui/react"

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
    const { start, end } = useGetStartEndQueryParams(month, year)
    const [query, setQuery] = useState('')
    const {
        data: categoryData,
        isLoading:
        isFetchingCategories,
        isSuccess: isFetchCategoriesSuccess
    } = useGetCategoriesQuery({ start, end, spending: false })
    const {
        data: billData,
        isSuccess: isFetchBillsSuccess
    } = useGetBillsQuery({ month, year })
    const [filteredBillCats, setFilteredBillCats] = useState<(Category | Bill)[]>([])
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (categoryData && billData) {
            includeBills
                ? setFilteredBillCats([...categoryData, ...billData])
                : setFilteredBillCats(categoryData)
        }
    }, [isFetchCategoriesSuccess, isFetchBillsSuccess])

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
    name?: string
    SelectorComponent: ForwardRefExoticComponent<ButtonHTMLAttributes<HTMLButtonElement>
        & RefAttributes<HTMLButtonElement>>
    defaultValue?: (Category | Bill | undefined)
}

export const FullSelectCategoryBill: FC<Selector>
    = ({ SelectorComponent, defaultValue, name, month, year, ...rest }) => {

        const [showBillCatSelect, setShowBillCatSelect] = useState(false)
        const [value, onChange] = useState(defaultValue)
        const dropdownRef = useRef<HTMLDivElement>(null)
        const buttonRef = useRef<HTMLButtonElement>(null)

        useAccessEsc({
            refs: [dropdownRef, buttonRef],
            visible: showBillCatSelect,
            setVisible: setShowBillCatSelect
        })

        return (
            <div>
                {value && name &&
                    <input
                        name={name}
                        type='hidden'
                        value={value.id}
                        {...rest}
                    />}
                <SelectorComponent
                    className="bill-category-selector--button"
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

                    <ArrowIcon size={'.8em'} />
                </SelectorComponent>
                <DropAnimation
                    placement='left'
                    visible={showBillCatSelect}
                    className="dropdown"
                    ref={dropdownRef}
                >
                    <StaticSelectCategoryBill
                        includeBills={true}
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
