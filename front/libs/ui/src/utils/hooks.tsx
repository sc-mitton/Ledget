import { useEffect, useState } from 'react'

export const useLoaded = (time?: number, flag: boolean = true) => {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (time && flag) {
            const timeout = setTimeout(() => {
                setLoaded(true)
            }, time)

            return () => clearTimeout(timeout)
        } else if (!time) {
            setLoaded(true)
        }
    }, [time, flag])

    return loaded
}
