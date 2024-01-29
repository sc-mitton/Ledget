
import dayjs from "dayjs"

import { useEffect, useState } from "react"
import { useAppSelector } from "./store"
import { selectBudgetMonthYear } from '@features/uiSlice'

interface DateRange {
    start: number
    end: number
}

export const useGetStartEndQueryParams = (arg?: { month?: number, year?: number }): DateRange => {
    const { month, year } = arg || {}

    const { month: storedMonth, year: storedYear } = useAppSelector(selectBudgetMonthYear)
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(0)

    useEffect(() => {
        if (month && year) {
            const start = Math.floor(new Date(year, month - 1, 1).getTime() / 1000)
            const end = Math.floor(new Date(year, month, 0).getTime() / 1000)
            setStart(start)
            setEnd(end)
        } else if (storedMonth && storedYear) {
            const start = dayjs().month(storedMonth - 1).year(storedYear).startOf('month').unix()
            const end = dayjs().month(storedMonth - 1).year(storedYear).endOf('month').unix()
            setStart(start)
            setEnd(end)
        }
    }, [month, year, storedMonth, storedYear])

    return { start, end }
}
