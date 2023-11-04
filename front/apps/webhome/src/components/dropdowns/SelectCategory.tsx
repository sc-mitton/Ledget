
import { useState, Fragment, useEffect } from 'react'

import { Combobox } from "@headlessui/react"

import './SelectCategory.scss'
import { Category, useGetCategoriesQuery } from '@features/categorySlice'
import { Bill, useGetBillsQuery } from '@features/billSlice'
import { DropAnimation, GrnSlimButton, BlueSlimButton } from '@ledget/ui'
import { SearchIcon } from '@ledget/media'

interface I {
    placeholder?: string
    predicted: Category | Bill | undefined
    value: (Category | Bill | undefined)
    onChange: (value: (Category | Bill)) => void
}

const SelectCategory = ({ placeholder, predicted, value, onChange }: I) => {
    const [query, setQuery] = useState('')
    const { data: categoryData, isSuccess: isFetchCategoriesSuccess } = useGetCategoriesQuery()
    const { data: billData, isSuccess: isFetchBillsSuccess } = useGetBillsQuery()
    const [options, setOptions] = useState<(Category | Bill)[]>([])

    useEffect(() => {
        if (isFetchCategoriesSuccess && isFetchBillsSuccess) {
            setOptions([...categoryData, ...billData])
        }
    }, [isFetchCategoriesSuccess, isFetchBillsSuccess])

    const filteredBillCats =
        query === ''
            ? options.sort((a, b) => a.name.localeCompare(b.name))
            : options.filter((category) => category.name.toLowerCase().includes(query.toLowerCase()))

    return (
        <Combobox value={value} onChange={onChange} as={'div'} className="select-bill-category">
            {({ open }) => (
                <>
                    <Combobox.Button as={predicted?.period == 'year' ? BlueSlimButton : GrnSlimButton}>
                        <>
                            {value === undefined
                                ? <span>{predicted?.name.charAt(0).toUpperCase()}{predicted?.name.slice(1)}</span>
                                : <span>{value?.name.charAt(0).toUpperCase()}{value?.name.slice(1)}</span>}
                        </>
                    </Combobox.Button>
                    <div className="category-select--container">
                        <DropAnimation visible={open} className="dropdown">
                            <SearchIcon />
                            <Combobox.Input
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
                        </DropAnimation>
                    </div>
                </>
            )}
        </Combobox>
    )
}

export default SelectCategory
