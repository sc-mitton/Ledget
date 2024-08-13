import { useEffect, useState } from 'react'

export const useLoaded = (time?: number, initialLoaded: boolean = false) => {
  const [loaded, setLoaded] = useState(initialLoaded)

  useEffect(() => {
    if (time && !loaded) {
      const timeout = setTimeout(() => {
        setLoaded(true)
      }, time)

      return () => clearTimeout(timeout)
    } else if (!time) {
      setLoaded(true)
    }
  }, [time, initialLoaded])

  return loaded
}
