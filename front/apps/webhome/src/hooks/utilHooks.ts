import { useSearchParams } from "react-router-dom"

interface DateRange {
    start: number
    end: number
}

export const useGetStartEndFromSearchParams = (): DateRange => {
    const [searchParams] = useSearchParams()
    const today = new Date()
    const searchYear = searchParams.get('year')
    const searchMonth = searchParams.get('month')

    const year = searchYear ? parseInt(searchYear) : today.getFullYear()
    const month = searchMonth ? parseInt(searchMonth) : today.getMonth()

    const start = Math.floor(new Date(year, month - 1, 1).getTime() / 1000)
    const end = Math.floor(new Date(year, month, 0).getTime() / 1000)

    return { start, end }
}
