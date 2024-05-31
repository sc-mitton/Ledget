import { createContext, useContext, useState } from 'react'

interface EmailContext {
    email?: string
    setEmail: React.Dispatch<React.SetStateAction<string | undefined>>
}

const emailContext = createContext<EmailContext | null>(null)
const EmailContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [email, setEmail] = useState<string | undefined>()
    return (
        <emailContext.Provider value={{ email, setEmail }}>
            {children}
        </emailContext.Provider>
    )
}
const useEmailContext = () => {
    const email = useContext(emailContext)
    if (email === null) {
        throw new Error('useEmailContext must be used within a EmailProvider')
    }
    return email
}

export { EmailContextProvider, useEmailContext }
