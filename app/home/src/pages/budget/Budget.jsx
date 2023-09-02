import React, { useState, useEffect } from 'react'

import TabView from './TabView'
import ColumnarView from './ColumnarView'
import './styles/Budget.css'

import { ShadowedContainer } from '@components/pieces'

const Budget = () => {
    const [tabView, setTabView] = useState(false)

    useEffect(() => {
        const updateViewMode = () => {
            if (window.innerWidth < 700)
                setTabView(true)
            else
                setTabView(false)
        }
        updateViewMode()
        window.addEventListener('resize', updateViewMode)
        return () => {
            window.removeEventListener('resize', updateViewMode)
        }
    }, [])

    return (
        <ShadowedContainer>
            <div id="budget--container" >
                {tabView ? <TabView /> : <ColumnarView />}
            </div>
        </ShadowedContainer>
    )
}

export default Budget
