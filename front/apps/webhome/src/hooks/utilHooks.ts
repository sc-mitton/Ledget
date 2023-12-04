import { useSearchParams } from "react-router-dom"

interface DateRange {
    start: number
    end: number
}

export const useGetStartEndQueryParams = (month?: number, year?: number): DateRange => {
    const [searchParams] = useSearchParams()
    const today = new Date()
    const searchYear = searchParams.get('year')
    const searchMonth = searchParams.get('month')

    const localYear = searchYear ? parseInt(searchYear) : year ? year : today.getFullYear()
    const localMonth = searchMonth ? parseInt(searchMonth) : month ? month : today.getMonth()

    const start = Math.floor(new Date(localYear, localMonth - 1, 1).getTime() / 1000)
    const end = Math.floor(new Date(localYear, localMonth, 0).getTime() / 1000)

    return { start, end }
}
