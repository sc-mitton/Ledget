import React, { useState, useEffect, useRef } from 'react'

import Arrow from '@assets/icons/Arrow'
import { monthMappings } from '@assets/data/monthMappings'
import DropAnimation from '@utils/DropAnimation'
import './styles/MonthPicker.css'

const MonthPicker = () => {
    const dates = {
        2021: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        2022: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        2023: [1, 2, 3, 4],
    }
    const [year, setYear] = useState(
        Object.keys(dates)[Object.keys(dates).length - 1]
    )
    const [month, setMonth] = useState(dates[year][dates[year].length - 1])

    const [picker, setPicker] = useState(false)
    const [pickerYear, setPickerYear] = useState(year)
    const monthPickerRef = useRef(null)

    const handleArrowClick = () => setPicker(!picker)

    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside)
        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    useEffect(() => {
        if (picker && monthPickerRef.current) {
            monthPickerRef.current.focus();
        }
    }, [picker]);

    const handleClickOutside = (event) => {
        if (monthPickerRef.current && !monthPickerRef.current.contains(event.target)) {
            setPicker(false)
        }
    }

    const handleArrowNavigation = (event) => {
        // Handle arrow navigation in the month picker

        if (picker && monthPickerRef.current) {
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
        };
    }, [picker])

    const handleKeyDown = (event) => {
        if (monthPickerRef.current && ['Escape', 'Esc', 'Tab'].includes(event.key)) {
            setPicker(false)
        }
    }

    const renderMonths = () => {
        return dates[pickerYear].map((index) => {
            return (
                <button
                    key={index}
                    className={
                        `month-picker-item${(month === index && year == pickerYear) ? '-selected' : ''}`
                    }
                    onClick={() => {
                        setPicker(false)
                        setYear(pickerYear)
                        setMonth(index)
                    }}
                >
                    {monthMappings[index - 1][0]}
                </button>
            )
        })
    }

    const incrementYear = () => {
        if (pickerYear < Object.keys(dates)[Object.keys(dates).length - 1]) {
            setPickerYear(pickerYear + 1)
        }
    }

    const decrementYear = () => {
        if (pickerYear > Object.keys(dates)[0]) {
            setPickerYear(pickerYear - 1)
        }
    }

    return (
        <div id="month-picker" ref={monthPickerRef}>
            <h1>{monthMappings[month - 1][1]} {year}</h1>
            <div id="header-arrow-container">
                <button
                    className='btn btn-clr'
                    id='header-arrow'
                    onClick={handleArrowClick}
                    aria-label="Open month picker"
                >
                    <Arrow width={'1.3em'} height={'1.3em'} />
                </button>
            </div>
            <DropAnimation
                visible={picker}
                className="dropdown"
                id="picker-container"
            >
                <div >
                    <div id="year-navigation">
                        <button
                            className="arrow-nav btn-scale2"
                            onClick={decrementYear}
                            aria-label="Decrement year"
                        >
                            <Arrow stroke='var(--main-text-gray)' scale={.8} rotation={90} />
                        </button>
                        <div>{pickerYear}</div>
                        <button
                            className="arrow-nav btn-scale2"
                            onClick={incrementYear}
                            aria-label="Increment year"
                        >
                            <Arrow stroke='var(--main-text-gray)' scale={.8} rotation={-90} />
                        </button>
                    </div>
                    <div className="month-picker-grid">
                        {renderMonths()}
                    </div>
                </div>
            </DropAnimation>
        </div>
    )
}

export default MonthPicker
