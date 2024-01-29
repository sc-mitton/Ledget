import { useState, useEffect } from 'react'

import { useSearchParams } from 'react-router-dom'
import dayjs, { Dayjs } from 'dayjs'
import { ChevronLeft, ChevronRight } from '@geist-ui/icons'

import './styles/MonthPicker.scss'
import { useGetMeQuery } from '@features/userSlice'
import { FadedTextButton, DatePicker } from '@ledget/ui'
import { changeBudgetMonthYear, selectBudgetMonthYear } from '@features/uiSlice'
import { useAppDispatch, useAppSelector } from '@hooks/store'

export const MonthPicker = ({ darkMode = false }) => {
    const { data: user } = useGetMeQuery()

    const [date, setDate] = useState<Dayjs>(dayjs())
    const dispatch = useAppDispatch()
    const [searchParams, setSearchParams] = useSearchParams()
    const [showDatePicker, setShowDatePicker] = useState(false)
    const { month, year } = useAppSelector(selectBudgetMonthYear)

    // On date value change, update the search params, and dispatch the change to the redux store
    useEffect(() => {
        if (date) {
            const year = date.year()
            const month = date.month() + 1
            searchParams.set('month', `${month}`)
            searchParams.set('year', `${year}`)
            setSearchParams(searchParams)
            dispatch(changeBudgetMonthYear({ month, year }))
        }
    }, [date])

    // On mount, select the month and year from the redux store
    // and set the date to the selected month and year or the curren month and year
    useEffect(() => {
        if (month && year) {
            setDate(dayjs().year(year).month(month - 1))
        } else {
            setDate(dayjs())
        }
    }, [month, year])

    const seekYear = (direction: 1 | -1, amount: 1 | 5,) => {
        const newYear = date.add(direction * amount, 'year').year()
        if (direction === 1 && newYear <= new Date().getFullYear()) {
            setDate(dayjs().year(newYear))
        } else if (direction === -1 && newYear >= new Date(user?.created_on || new Date()).getFullYear()) {
            setDate(dayjs().year(newYear))
        }
    }

    return (
        <div className={`month-picker ${darkMode ? 'dark' : ''}`}>
            <div className='month-picker--container'>
                {darkMode
                    ? <FadedTextButton
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        aria-aria-haspopup='true'
                    >
                        {date.format('MMMM YYYY')}
                    </FadedTextButton>
                    : <button
                        aria-haspopup='true'
                        onClick={(e) => setShowDatePicker(!showDatePicker)}>
                        {date.format('MMMM YYYY')}
                    </button>}
                <button onClick={() => seekYear(-1, 1)}>
                    <ChevronLeft className='icon' />
                </button>
                <button onClick={() => seekYear(1, 1)}>
                    <ChevronRight className='icon' />
                </button>
            </div>
            <DatePicker
                period='month'
                hideInputElement={true}
                dropdownVisible={showDatePicker}
                setDropdownVisible={setShowDatePicker}
                defaultValue={date}
                onChange={(date) => date && setDate(date)}
            />
        </div>
    )
}
