
import { useState, Fragment, useEffect, useRef } from 'react'

import { Combobox } from "@headlessui/react"

import './SelectCategoryBill.scss'
import { Category, useGetCategoriesQuery } from '@features/categorySlice'
import { Bill, useGetBillsQuery } from '@features/billSlice'
import { SearchIcon } from '@ledget/media'

interface I {
    value: (Category | Bill | undefined)
    includeBills?: boolean
    onChange: (value: (Category | Bill | undefined)) => void
}

function SelectCategoryBill({ value, onChange, includeBills = true }: I) {
    const [query, setQuery] = useState('')
    const { data: categoryData, isSuccess: isFetchCategoriesSuccess } = useGetCategoriesQuery()
    const { data: billData, isSuccess: isFetchBillsSuccess } = useGetBillsQuery()
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
        if (query) {
            setFilteredBillCats(
                filteredBillCats.filter((billcat) => {
                    const name = billcat.name.toLowerCase()
                    const queryLower = query.toLowerCase()
                    return name.includes(queryLower)
                })
            )
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
                <Combobox.Options className="options" static>
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
            </div>
        </Combobox>
    )
}

export default SelectCategoryBill
