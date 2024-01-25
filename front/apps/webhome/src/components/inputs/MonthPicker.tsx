import { useState, useEffect, useRef } from 'react'

import { useSearchParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { ChevronLeft, ChevronRight } from '@geist-ui/icons'

import './styles/MonthPicker.scss'
import { useGetMeQuery } from '@features/userSlice'
import { SmallArrowButton, FadedTextButton, DropDownDiv, IconButton3, useAccessEsc } from '@ledget/ui'

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

const MonthPicker = ({ darkMode = false }) => {
    const { data: user, isSuccess: userIsFetched } = useGetMeQuery()
    const [searchParams, setSearchParams] = useSearchParams()

    const [dateOptions, setDateOptions] = useState<{ [year: number]: number[] }>({
        [new Date().getFullYear()]: [new Date().getMonth() + 1]
    })
    const [showPicker, setShowPicker] = useState(false)
    const [pickerYear, setPickerYear] = useState(new Date().getFullYear())
    const monthPickerRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLDivElement>(null)

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

    // Focus the month picker when it is opened
    useEffect(() => {
        if (showPicker && monthPickerRef.current) {
            monthPickerRef.current.focus()
        }
    }, [showPicker])

    useAccessEsc({
        visible: showPicker,
        setVisible: setShowPicker,
        refs: [monthPickerRef, buttonRef]
    })

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

    const handleArrowClick = (direction: 1 | -1) => {

        const currentYear = searchParams.get('year') || `${new Date().getFullYear()}`
        const currentMonth = searchParams.get('month') || `${new Date().getMonth() + 1}`
        const d = dayjs(`${currentYear}-${currentMonth}-01`)
        const next = d.add(direction, 'month')

        if (dateOptions[next.year()]?.includes(next.month() + 1)) {
            searchParams.set('month', `${next.month() + 1}`)
            searchParams.set('year', `${next.year()}`)
            setSearchParams(searchParams)
        }
    }
    return (
        <div id="month-picker" ref={monthPickerRef} className={darkMode ? 'dark' : ''}>
            <div ref={buttonRef}>
                <FadedTextButton
                    onClick={() => { setShowPicker(!showPicker) }}
                    aria-label="Open month picker"
                >
                    <span>{monthMappings[parseInt(searchParams.get('month') || '1') - 1][1]} {searchParams.get('year')}</span>
                </FadedTextButton>
                <IconButton3 onClick={() => handleArrowClick(-1)}>
                    <ChevronLeft className='icon' />
                </IconButton3>
                <IconButton3 onClick={() => handleArrowClick(1)}>
                    <ChevronRight className='icon' />
                </IconButton3>
            </div>
            <DropDownDiv
                placement="middle"
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
