import React from 'react'

import './home.css'
import Items from './windows/Items'
import Budget from './windows/Budget'


function Home() {
    return (
        <div id="dashboard">
            <Budget />
            <Items />
        </div>
    )
}

export default Home
