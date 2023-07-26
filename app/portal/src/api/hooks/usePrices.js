import { useState, useEffect } from 'react'
import ledgetapi from '../axios'

const usePrices = () => {
    const [prices, setPrices] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const storedPrices = sessionStorage.getItem('prices')

                if (storedPrices) {
                    setPrices(JSON.parse(storedPrices))
                } else {
                    const response = await ledgetapi.get('prices')
                    setPrices(response.data)
                    sessionStorage.setItem('prices', JSON.stringify(response.data))
                }
            } catch (error) {
                setError(error)
            }
        }
        fetchPrices()
    }, [])

    return { prices, error }
}

export default usePrices
