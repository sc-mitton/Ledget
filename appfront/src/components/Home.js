import React from 'react'

import './home.css'
import NewItems from './windows/NewItems'
import Items from './windows/Items'
import Assets from './windows/Assets'
import Budget from './windows/Budget'


function Home() {
    return (
        <div id="dashboard">
            <div id="dashboard-row-1">
                <NewItems />
                <Items />
            </div>
            <div id="dashboard-row-2">
                <Budget />
                <Assets />
            </div>
        </div>
    )
}

export default Home
