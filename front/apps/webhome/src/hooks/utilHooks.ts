
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

interface DateRange {
    start: number
    end: number
}

export const useGetStartEndQueryParams = (arg?: { month?: number, year?: number }): DateRange => {
    const { month, year } = arg || {}
    const [searchParams] = useSearchParams()

    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(0)

    useEffect(() => {
        if (month && year) {
            const start = Math.floor(new Date(year, month - 1, 1).getTime() / 1000)
            const end = Math.floor(new Date(year, month, 0).getTime() / 1000)
            setStart(start)
            setEnd(end)
        } else if (searchParams.get('month') && searchParams.get('year')) {
            const year = parseInt(searchParams.get('year')!)
            const month = parseInt(searchParams.get('month')!)
            setStart(Math.floor(new Date(year, month - 1, 1).getTime() / 1000))
            setEnd(Math.floor(new Date(year, month, 0).getTime() / 1000))
        }
    }, [month, year, searchParams.get('month'), searchParams.get('year')])

    return { start, end }
}
