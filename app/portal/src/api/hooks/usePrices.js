import React from 'react'
import { useState, useEffect } from 'react'

import apiAuth from '../axios'

const usePrices = () => {
    const [prices, setPrices] = useState([])
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)

    const fetchPrices = async () => {
        await apiAuth.get('prices')
            .then(response => {
                console.log(response.data)
                setPrices(response.data)
                sessionStorage.setItem(
                    'prices',
                    JSON.stringify(response.data)
                )
                setLoading(false)
            })
            .catch(error => {
                setError(error)
                setLoading(false)
            })
    }

    useEffect(() => {
        if (!loaded) {
            if (sessionStorage.getItem('prices')) {
                setPrices(
                    JSON.parse(sessionStorage.getItem('prices'))
                )
                setLoading(false)
            } else {
                fetchPrices()
            }
        }
    }, [])

    return { prices, loading, error }
}

export default usePrices


