import React from 'react'
import { useState, useEffect } from 'react'

import apiAuth from '../axios'

const usePrices = () => {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const fetchPrices = async () => {
        const response = await apiAuth.get('price/')
            .then(response => {
                setPrices(response.data.prices)
                setLoading(false)
            })
            .catch(error => {
                setError(true)
                setLoading(false)
            })
    }

    useEffect(() => {
        if (!loaded) {
            fetchPrices()
        }
    }, [])

    return { prices, loading, error }
}

export default usePrices


