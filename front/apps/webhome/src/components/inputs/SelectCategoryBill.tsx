
import {
    ForwardRefExoticComponent,
    RefAttributes,
    ButtonHTMLAttributes,
    useState,
    useEffect,
    useRef
} from 'react'

import { Combobox } from "@headlessui/react"
import { useController, Control } from 'react-hook-form'
import { Search, ChevronDown } from '@geist-ui/icons'


import './styles/SelectCategoryBill.scss'
import { Category, useLazyGetCategoriesQuery } from '@features/categorySlice'
import { Bill, useLazyGetBillsQuery } from '@features/billSlice'
import { LoadingRingDiv, DropdownDiv, useAccessEsc, BillCatLabel } from '@ledget/ui'
import { useAppSelector } from '@hooks/store'
import { selectBudgetMonthYear } from '@features/budgetItemMetaDataSlice'

interface IBase {
    includeBills?: boolean;
    includeCategories?: boolean;
    month?: number;
    year?: number;
    activeBeginning?: number;
    activeEnding?: number;
    name?: string;
}

interface I1 extends IBase {
    multiple?: true;
    value?: (Category | Bill)[];
    onChange?: (value: (Category | Bill)[]) => void;
}

interface I2 extends IBase {
    multiple?: false;
    value?: Category | Bill;
    onChange?: (value: Category | Bill) => void;
}

type I = I1 | I2

function SelectCategoryBillBody(props: I) {
    const [query, setQuery] = useState('')
    const { month, year } = useAppSelector(selectBudgetMonthYear)
    const [getCategories, {
        data: categoryData,
        isLoading: isFetchingCategories,
        isSuccess: isFetchCategoriesSuccess
    }] = useLazyGetCategoriesQuery()
    const [getBills, {
        data: billData,
        isSuccess: isFetchBillsSuccess
    }] = useLazyGetBillsQuery()

    const [filteredBillCats, setFilteredBillCats] = useState<(Category | Bill)[]>([])
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (props.activeBeginning && props.activeEnding) {
            getCategories({ month, year, spending: false })
            getBills({
                month: new Date(props.activeBeginning).getMonth() + 1,
                year: new Date(props.activeBeginning).getFullYear()
            })
        } else {
            getCategories({ month, year, spending: false })
            getBills({ month, year })
        }

    }, [props.activeBeginning, props.activeEnding, props.month, props.year])

    // Set billcats
    useEffect(() => {
        if (categoryData && billData) {
            props.includeBills
                ? props.includeCategories
                    ? setFilteredBillCats([...categoryData, ...billData])
                    : setFilteredBillCats(billData)
                : setFilteredBillCats(categoryData)
        }
    }, [isFetchCategoriesSuccess, isFetchBillsSuccess])

    // Filter billcats
    useEffect(() => {
        let data: (Category | Bill)[] | undefined
        if (categoryData && billData) {
            data = props.includeBills
                ? props.includeCategories
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
            name={props.name}
            value={props.value}
            multiple={props.multiple as any}
            onChange={props.onChange as any}
            as={'div'}
            className="select-bill-category"
        >
            <div className="category-select--container">
                <div>
                    <Search size={'1.25em'} />
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
                            <Combobox.Option key={billcat.id} value={billcat}>
                                {({ active, selected }) => (
                                    <BillCatLabel
                                        slim={true}
                                        color={billcat.period === 'month' ? 'blue' : 'green'}
                                        labelName={billcat.name}
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

interface SelectorBase extends IBase {
    SelectorComponent: ForwardRefExoticComponent<ButtonHTMLAttributes<HTMLButtonElement>
        & RefAttributes<HTMLButtonElement>>
    children?: React.ReactNode
    placeholder?: string
    control?: Control<any>
}

interface Selector1 extends SelectorBase {
    multiple?: true;
    defaultValue?: (Category | Bill)[]
}

interface Selector2 extends SelectorBase {
    multiple?: false;
    defaultValue?: Category | Bill
}

type Selector = Selector1 | Selector2

export const FullSelectCategoryBill =
    ({ SelectorComponent, placeholder, children, control, ...rest }: Selector) => {
        const [value, onChange] = useState<typeof rest.defaultValue>()
        const [showBillCatSelect, setShowBillCatSelect] = useState(false)
        const dropdownRef = useRef<HTMLDivElement>(null)
        const buttonRef = useRef<HTMLButtonElement>(null)
        const name = useRef<string>(rest.name ||
            (!rest.includeBills
                ? 'category'
                : !rest.includeCategories ? 'bill' : 'item')
        )

        // Set default
        useEffect(() => {
            onChange(rest.defaultValue)
        }, [rest.month, rest.year])

        // Controll for react-hook-form
        const { field } = useController({ name: name.current, control })

        // Update react-hook-form value
        useEffect(() => {
            if (Array.isArray(value)) {
                field.onChange(value ? value.map?.((v) => v.id) : [])
            } else if (value) {
                field.onChange(value.id)
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
                        ${Array.isArray(value)
                            ? value?.length > 0 ? 'active' : ''
                            : value ? 'active' : ''}
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
                                                labelName={v.name}
                                                hoverable={false}
                                            />
                                        ))}
                                    </>
                                    : <BillCatLabel
                                        slim={true}
                                        color={value.period === 'month' ? 'blue' : 'green'}
                                        labelName={value.name}
                                        emoji={value.emoji}
                                        hoverable={false}
                                    />
                                }
                            </>
                        }
                    </div>
                    <ChevronDown size={'1.25em'} />
                    {children}
                </SelectorComponent>
                <div>
                    <DropdownDiv
                        placement='left'
                        visible={showBillCatSelect}
                        ref={dropdownRef}
                    >
                        <SelectCategoryBillBody
                            {...rest}
                            value={value as any}
                            onChange={onChange}
                            name={name.current}
                        />
                    </DropdownDiv>
                </div>
            </div>
        )
    }

export default SelectCategoryBillBody
