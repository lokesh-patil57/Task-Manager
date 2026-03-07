/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('dark')

    useEffect(() => {
        const root = document.documentElement
        root.classList.remove('light')
        root.classList.add('dark')
        localStorage.setItem('atm_theme', 'dark')
    }, [])

    const toggleTheme = () => { } // No-op

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
    return ctx
}
