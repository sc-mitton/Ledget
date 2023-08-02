import React from 'react'

import { Route, Routes } from 'react-router-dom'

import './styles/Window.css'
import Header from './Header'
import CreateCategory from '@components/modals/CreateCategory'
import CreateBill from '@components/modals/CreateBill'

function Main() {
    return (
        <></>
    )
}

function Window() {
    return (
        <div className="window" id="budget-window">
            <Header />
            <Routes>
                <Route path="new-category" element={<CreateCategory />} />
                <Route path="new-bill" element={<CreateBill />} />
                <Route path="edit" element={<div>edit</div>} />
                <Route path="/" element={<Main />} />
            </Routes>
        </div>
    )
}

export default Window
