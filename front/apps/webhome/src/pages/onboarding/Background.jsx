import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'

import './styles/Skeleton.css'
import { LedgetLogoIcon } from '@ledget/media'

const Header = () => (
    <header>
        <div className="header-container">
            <div className="header-logo">
                <LedgetLogoIcon />
            </div>
            <div className="header-right">
            </div>
        </div>
    </header>
)

const Dashboard = () => (
    <>
        <Header />
        <div
            style={{
                backgroundColor: 'transparent',
                width: '100%',
                height: '100%',
                display: 'flex',
            }}
        >
        </div>
    </>
)

export default Dashboard
