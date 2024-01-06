import { useState, useEffect, useRef } from 'react'

import { useSearchParams } from 'react-router-dom'

import './styles/MonthPicker.scss'
import { useGetMeQuery } from '@features/userSlice'
import { SmallArrowButton, IconButton, DropDownDiv } from '@ledget/ui'
import { ArrowIcon } from '@ledget/media'

export const monthMappings: [string | number, string | number][] = [
    ['Jan', 'January'],
    ['Feb', 'February'],
    ['Mar', 'March'],
    ['Apr', 'April'],
    ['May', 'May'],
    ['Jun', 'June'],
    ['Jul', 'July'],
    ['Aug', 'August'],
    ['Sep', 'September'],
    ['Oct', 'October'],
    ['Nov', 'November'],
    ['Dec', 'December'],
]

const MonthPicker = () => {
    const { data: user, isSuccess: userIsFetched } = useGetMeQuery()
    const [searchParams, setSearchParams] = useSearchParams()

    const [dateOptions, setDateOptions] = useState<{ [year: number]: number[] }>({
        [new Date().getFullYear()]: [new Date().getMonth() + 1]
    })
    const [showPicker, setShowPicker] = useState(false)
    const [pickerYear, setPickerYear] = useState(new Date().getFullYear())
    const monthPickerRef = useRef<HTMLDivElement>(null)

    // Set date options based on when the user was created
    useEffect(() => {
        if (userIsFetched && user) {
            const userCreatedOn = new Date(user.created_on)
            const currentDate = new Date()

            const currentYear = currentDate.getFullYear()
            const currentMonth = currentDate.getMonth() + 1
            const userCreatedYear = userCreatedOn.getFullYear()
            const userCreatedMonth = userCreatedOn.getMonth() + 1

            let newDateOptions: { [year: number]: number[] } = {}
            const numberOfMonths = (currentYear - userCreatedYear) * 12 + (currentMonth - userCreatedMonth) + 1

            for (let i = 0; i < numberOfMonths; i++) {
                const year = userCreatedYear + Math.floor((userCreatedMonth + i - 1) / 12)
                const month = (userCreatedMonth + i - 1) % 12 + 1

                if (newDateOptions[year]) {
                    newDateOptions[year].push(month)
                } else {
                    newDateOptions[year] = [month]
                }
            }
            setDateOptions(newDateOptions)
        }
    }, [userIsFetched, user])

    // Event listeners for closing the month picker
    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside)
        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    // Focus the month picker when it is opened
    useEffect(() => {
        if (showPicker && monthPickerRef.current) {
            monthPickerRef.current.focus()
        }
    }, [showPicker])

    const handleClickOutside = (event: MouseEvent) => {
        if (monthPickerRef.current && !monthPickerRef.current.contains(event.target as Node)) {
            setShowPicker(false)
        }
    }

    const handleArrowNavigation = (event: KeyboardEvent) => {
        // Handle arrow navigation in the month picker

        if (showPicker && monthPickerRef.current) {
            const buttons = monthPickerRef.current.querySelectorAll('button');
            const currentIndex = Array.from(buttons).findIndex((button) => button === document.activeElement)

            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault()

                const columns = 3; // The number of columns in the month picker grid
                const nextIndex = currentIndex + (event.key === 'ArrowUp' ? -columns : columns)

                if (nextIndex >= 0 && nextIndex < buttons.length) {
                    buttons[nextIndex].focus()
                }
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault()

                const nextIndex = currentIndex + (event.key === 'ArrowLeft' ? -1 : 1)

                if (nextIndex >= 0 && nextIndex < buttons.length) {
                    buttons[nextIndex].focus()
                }
            }
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleArrowNavigation);
        return () => {
            window.removeEventListener("keydown", handleArrowNavigation);
        }
    }, [showPicker])

    const handleKeyDown = (event: KeyboardEvent) => {
        if (monthPickerRef.current && ['Escape', 'Esc', 'Tab'].includes(event.key)) {
            setShowPicker(false)
        }
    }

    const renderMonths = () => {
        return dateOptions[pickerYear]?.map((month) => {
            const isSelected = (searchParams.get('month') === `${month}` && searchParams.get('year') == `${pickerYear}`)
            return (
                <button
                    key={month}
                    className={
                        `month-picker-item${isSelected ? '-selected' : ''}`
                    }
                    onClick={() => {
                        setShowPicker(false)
                        searchParams.set('month', `${month}`)
                        searchParams.set('year', `${pickerYear}`)
                        setSearchParams(searchParams)
                    }}
                >
                    {monthMappings[month - 1][0]}
                </button>
            )
        })
    }

    const incrementYear = () => {
        if (pickerYear < new Date().getFullYear())
            setPickerYear(pickerYear + 1)
    }

    const decrementYear = () => {
        if (pickerYear > new Date(user?.created_on || new Date()).getFullYear())
            setPickerYear(pickerYear - 1)
    }

    return (
        <div id="month-picker" ref={monthPickerRef}>
            <h1>{monthMappings[parseInt(searchParams.get('month') || '1') - 1][1]} {searchParams.get('year')}</h1>
            <div id="header-arrow-container">
                <IconButton
                    id='header-arrow'
                    onClick={() => { setShowPicker(!showPicker) }}
                    aria-label="Open month picker"
                >
                    <ArrowIcon size={'1em'} stroke={'currentColor'} />
                </IconButton>
            </div>
            <DropDownDiv
                placement="left"
                visible={showPicker}
                id="picker-container"
            >
                <div >
                    <div id="year-navigation">
                        <SmallArrowButton
                            type="back"
                            onClick={decrementYear}
                            aria-label="Decrement year"
                        />
                        <div>{pickerYear}</div>
                        <SmallArrowButton
                            type="forward"
                            onClick={incrementYear}
                            aria-label="Increment year"
                        />
                    </div>
                    <div className="month-picker-grid">
                        {renderMonths()}
                    </div>
                </div>
            </DropDownDiv>
        </div>
    )
}

export default MonthPicker
