import React, { createContext, ReactNode, useEffect, useContext, useState } from 'react'


const ScreenContext = createContext<{
    screenSize: 'small' | 'medium' | 'large' | 'extra-large'
    screenWidth: number | undefined
} | undefined
>(undefined)

export const useScreenContext = () => {
    const context = useContext(ScreenContext)
    if (context === undefined) {
        throw new Error('useScreenContext must be used within a ScreenProvider')
    }
    return context
}
export const ScreenProvider = ({ children }: { children: ReactNode }) => {
    const [screenSize, setScreenSize] = useState<'small' | 'medium' | 'large' | 'extra-large'>('large')
    const [screenWidth, setScreenWidth] = useState<number>()

    useEffect(() => {
        let timeout: NodeJS.Timeout
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setScreenSize('small')
            } else if (window.innerWidth < 1024) {
                setScreenSize('medium')
            } else if (window.innerWidth < 1224) {
                setScreenSize('large')
            } else {
                setScreenSize('extra-large')
            }
            setScreenWidth(window.innerWidth)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
            clearTimeout(timeout)
        }
    }, [])

    return (
        <ScreenContext.Provider value={{ screenSize, screenWidth }}>
            {children}
        </ScreenContext.Provider>
    )
}
