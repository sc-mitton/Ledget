import React, { useEffect } from 'react'

import { BrowserRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Dashboard from './pages/Dashboard'
import { fetchUser } from './slices/user'

function App() {

    // const dispatch = useDispatch()
    // useEffect(() => {
    //     dispatch(fetchUser())
    // }, [])

    return (
        <main tabIndex={0}>
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        </main >
    )
}

export default App
