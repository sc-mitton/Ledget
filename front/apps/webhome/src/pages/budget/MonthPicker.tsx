import { useState, useEffect, useRef } from 'react'

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

    const seek = (direction: 1 | -1, amount: 1 | 5,) => {
        const newDjs = date.add(direction * amount, 'month')
        if (direction === 1 && newDjs.isBefore(dayjs())) {
            setDate(newDjs)
        } else if (direction === -1 && newDjs.isAfter(dayjs(user?.created_on))) {
            setDate(newDjs)
        }
    }

    return (
        <div className={`month-picker ${darkMode ? 'dark' : ''}`}>
            <div className='month-picker--container'>
                <button
                    aria-haspopup='true'
                    onClick={(e) => setShowDatePicker(!showDatePicker)}>
                    {date.format('MMM YYYY')}
                </button>
                <button onClick={() => seek(-1, 1)}>
                    <ChevronLeft size={'1.125em'} strokeWidth={2} />
                </button>
                <button onClick={() => seek(1, 1)}>
                    <ChevronRight size={'1.125em'} strokeWidth={2} />
                </button>
            </div>
            <DatePicker
                placement='middle'
                period='month'
                hideInputElement={true}
                dropdownVisible={showDatePicker}
                disabled={[[undefined, dayjs(user?.created_on)], [dayjs().add(1, 'month'), undefined]]}
                omitDisabled={true}
                setDropdownVisible={setShowDatePicker}
                defaultValue={date}
                onChange={(date) => date && setDate(date)}
            />
        </div>
    )
}
