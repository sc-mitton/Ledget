import React from 'react'
import { useState, useRef, useEffect } from 'react'

import CashFlow from '../../assets/svg/CashFlow'
import Graph from '../../assets/svg/Graph'
import Arrow from '../../assets/svg/Arrow'
import './style/Spending.css'

const monthMappings = [
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

function Spending() {
    const dates = {
        2021: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        2022: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        2023: [1, 2, 3, 4],
    }
    const [year, setYear] = useState(
        Object.keys(dates)[Object.keys(dates).length - 1]
    )
    const [month, setMonth] = useState(dates[year][dates[year].length - 1])
    const [graphView, setGraphView] = useState(true)

    const MonthPicker = () => {
        const [picker, setPicker] = useState(false)
        const [pickerYear, setPickerYear] = useState(year)
        const [pickerMonth, setPickerMonth] = useState(month)
        const monthPickerRef = useRef(null)

        const handleArrowClick = () => setPicker(!picker)

        useEffect(() => {
            document.addEventListener("mousedown", handleClickOutside)
            document.addEventListener("keydown", handleKeyDown)
            return () => {
                document.removeEventListener("mousedown", handleClickOutside)
                document.removeEventListener("keydown", handleKeyDown)
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
            document.addEventListener("keydown", handleArrowNavigation);
            return () => {
                document.removeEventListener("keydown", handleArrowNavigation);
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
                            `month-picker-item${(pickerMonth === index && year == pickerYear) ? '-selected' : ''}`
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
                <h2>{monthMappings[month - 1][1]} {year}</h2>
                <div id="header-arrow-container">
                    <button
                        className='icon'
                        id='header-arrow'
                        onClick={handleArrowClick}
                        aria-label="Open month picker"
                    >
                        <Arrow />
                    </button>
                </div>
                {picker &&
                    <div className="dropdown" id="picker-container">
                        <div id="year-navigation">
                            <button
                                className="arrow-nav"
                                onClick={decrementYear}
                                aria-label="Decrement year"
                            >
                                <Arrow stroke='#f8f8f8' scale={.8} rotation={90} />
                            </button>
                            <div>{pickerYear}</div>
                            <button
                                className="arrow-nav"
                                onClick={incrementYear}
                                aria-label="Increment year"
                            >
                                <Arrow stroke='#f8f8f8' scale={.8} rotation={-90} />
                            </button>
                        </div>
                        <div className="month-picker-grid">
                            {renderMonths()}
                        </div>
                    </div>
                }
            </div>
        )
    }

    const Header = () => {
        return (
            <div className="window-header">
                <MonthPicker />
                <div className="window-header-buttons">
                    <button
                        onClick={() => setGraphView(!graphView)}
                        className={`window-header-button${!graphView ? '-selected' : ''}`}
                        aria-label="Toggle cash flow view"
                    >
                        <CashFlow fill={!graphView ? "var(--window)" : null} />
                    </button>
                    <button
                        onClick={() => setGraphView(!graphView)}
                        className={`window-header-button${graphView ? '-selected' : ''}`}
                        aria-label="Toggle graph view"
                    >
                        <Graph fill={graphView ? "var(--window)" : null} />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='window' id="spending-window">
            <Header />
        </div>
    )
}

export default Spending

