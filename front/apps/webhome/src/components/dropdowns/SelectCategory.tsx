
import { useState, Fragment, useEffect, useRef } from 'react'

import { Combobox } from "@headlessui/react"

import './SelectCategory.scss'
import { Category, useGetCategoriesQuery } from '@features/categorySlice'
import { Bill, useGetBillsQuery } from '@features/billSlice'
import { SearchIcon } from '@ledget/media'

interface I {
    value: (Category | Bill | undefined)
    onChange: (value: (Category | Bill)) => void
}

const SelectCategory = ({ value, onChange }: I) => {
    const [query, setQuery] = useState('')
    const { data: categoryData, isSuccess: isFetchCategoriesSuccess } = useGetCategoriesQuery()
    const { data: billData, isSuccess: isFetchBillsSuccess } = useGetBillsQuery()
    const [options, setOptions] = useState<(Category | Bill)[]>([])
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isFetchCategoriesSuccess && isFetchBillsSuccess) {
            setOptions([...categoryData, ...billData])
        }
    }, [isFetchCategoriesSuccess, isFetchBillsSuccess])

    const filteredBillCats =
        query === ''
            ? options.sort((a, b) => a.name.localeCompare(b.name))
            : options.filter((category) => category.name.toLowerCase().includes(query.toLowerCase()))

    useEffect(() => { inputRef.current?.focus() }, [])

    return (
        <Combobox value={value} onChange={onChange} as={'div'} className="select-bill-category">
            <div className="category-select--container">
                <SearchIcon />
                <Combobox.Input
                    ref={inputRef}
                    className="input"
                    onChange={(event) => setQuery(event.target.value)}
                    size={options.reduce((acc, curr) => Math.max(acc, curr.name.length), 0)}
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

export default SelectCategory
