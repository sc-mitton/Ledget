import { useState } from 'react'

import { AnimatePresence } from 'framer-motion'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import { withModal } from '@ledget/ui'
import { SlideMotionDiv } from '@ledget/ui'
import AddBills from './AddBills'
import AddCategories from './AddCategories'
import WelcomeConnect from './WelcomeConnect'

const Main = withModal((props) => {
    const [step, setStep] = useState<'welcome-connect' | 'add-bills' | 'add-categories'>('welcome-connect')
    const location = useLocation()

    return (
        <div id="onboarding-app">
            <AnimatePresence mode='wait'>
                <Routes location={location} key={location.pathname}>
                    <Route path='connect' element={<SlideMotionDiv position={'first'}><WelcomeConnect /></SlideMotionDiv>} />
                    <Route path='add-bills' element={<SlideMotionDiv><AddBills /></SlideMotionDiv>} />
                    <Route path='add-categories' element={<SlideMotionDiv position={'last'}><AddCategories /></SlideMotionDiv>} />
                </Routes>
            </AnimatePresence>
        </div>
    )
})

export default function () {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <Main
            onClose={() => navigate({
                pathname: '/budget',
                search: location.search,
            })}
        />
    )
}
