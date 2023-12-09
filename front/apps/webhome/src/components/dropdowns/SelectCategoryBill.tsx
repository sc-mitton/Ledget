
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
import { LoadingRingDiv, DropAnimation, useAccessEsc, BillCatLabel } from '@ledget/ui'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'

interface I {
    default?: string | string[]
    value?: (Category | Bill | undefined | (Category | Bill)[]),
    onChange?: React.Dispatch<React.SetStateAction<Category | Bill | undefined | (Category | Bill)[]>>
    includeBills?: boolean
    includeCategories?: boolean
    month?: number
    year?: number
    multiple?: boolean
    name?: string
}

function SelectCategoryBillBody({
    value,
    name,
    onChange,
    month,
    year,
    includeBills = true,
    includeCategories = true,
    multiple = false
}: I) {
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

    return (
        <Combobox
            name={name}
            value={value}
            onChange={onChange}
            as={'div'}
            className="select-bill-category"
            multiple={multiple as any}
        >
            <div className="category-select--container">
                <div>
                    <SearchIcon />
                    <Combobox.Input
                        autoFocus
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
                                    <BillCatLabel
                                        as='li'
                                        slim={true}
                                        color={billcat.period === 'month' ? 'blue' : 'green'}
                                        name={billcat.name}
                                        emoji={billcat.emoji}
                                        checked={selected}
                                        active={active}
                                    />
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

        const [value, onChange] = useState<Category | Bill | undefined | (Category | Bill)[]>()
        const [showBillCatSelect, setShowBillCatSelect] = useState(false)
        const dropdownRef = useRef<HTMLDivElement>(null)
        const buttonRef = useRef<HTMLButtonElement>(null)
        const name = useRef<string>(rest.name ||
            !rest.includeBills
            ? 'category'
            : !rest.includeCategories ? 'bill' : 'item'
        )

        // Controll for react-hook-form
        const { field } = useController({ name: name.current, control })

        // Update react-hook-form value
        useEffect(() => {
            Array.isArray(value) && console.log(value.map?.((v) => v.id))
            field.onChange(value
                ? Array.isArray(value)
                    ? value.map?.((v) => v.id)
                    : value.id : ''
            )
        }, [value])

        useEffect(() => {
            if (Array.isArray(value)) {
                field.onChange(value ? value.map?.((v) => v.id) : [])
            } else {
                field.onChange(value ? value.id : '')
            }
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
                        ${value && (Array.isArray(value) && value.length) ? 'valid' : 'placeholder'}
                        ${showBillCatSelect ? 'active' : ''}`}
                    type='button'
                    onClick={() => setShowBillCatSelect(!showBillCatSelect)}
                    ref={buttonRef}
                >
                    <div className="selector-current-label">
                        {!value || (Array.isArray(value) && value.length === 0)
                            ? <span>{`${placeholder || ''}`}</span>
                            : <>
                                {Array.isArray(value)
                                    ? <>
                                        {value.map((v) => (
                                            <BillCatLabel
                                                key={v.id}
                                                slim={true}
                                                color={v.period === 'month' ? 'blue' : 'green'}
                                                name={v.name}
                                                tint={true}
                                                hoverable={false}
                                            />
                                        ))}
                                    </>
                                    : <BillCatLabel
                                        slim={true}
                                        color={value.period === 'month' ? 'blue' : 'green'}
                                        name={value.name}
                                        emoji={value.emoji}
                                        tint={true}
                                        hoverable={false}
                                    />
                                }
                            </>
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
                        <SelectCategoryBillBody
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

export default SelectCategoryBillBody
