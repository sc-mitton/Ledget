import React from 'react'
import { useState } from 'react'

import CashFlow from '../../assets/images/CashFlow'
import Graph from '../../assets/images/Graph'
import Arrow from '../../assets/images/Arrow'

function Budget() {
    let months = [
        'January', 'February', 'March',
        'April', 'May', 'June', 'July',
        'August', 'September', 'October',
        'November', 'December'
    ]
    let years = [
        2020, 2021, 2022, 2023,
    ]
    const currentDate = new Date()
    const [month, setMonth] = useState(
        months.indexOf(months[currentDate.getMonth()])
    )
    const [year, setYear] = useState(
        years.indexOf(currentDate.getFullYear())
    )
    const [graphView, setGraphView] = useState(true)


    const MonthPicker = () => {
        const [picker, setPicker] = useState(false)
        const [pickerMonth, setPickerMonth] = useState('')
        const [pickerYear, setPickerYear] = useState(year)

        const handleArrowClick = () => setPicker(!picker)

        return (
            <div id="month-picker">
                <h2>{months[month]} {years[year]}</h2>
                <button className='arrow' onClick={handleArrowClick} >
                    <Arrow />
                </button>

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
                    >
                        <CashFlow className={`window-header-icon${!graphView ? '-selected' : ''}`} />
                    </button>
                    <button
                        onClick={() => setGraphView(!graphView)}
                        className={`window-header-button${graphView ? '-selected' : ''}`}
                    >
                        <Graph className={`window-header-icon${graphView ? '-selected' : ''}`} />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='window' id="budget-window">
            <Header />
        </div>
    )
}

export default Budget
