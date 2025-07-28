import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

type Theme = string;

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    themes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const availableThemes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
    "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
    "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
    "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
    "night", "coffee", "winter"
];

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme && availableThemes.includes(savedTheme) ? savedTheme : 'light';
    });

    // Effect to apply the theme to the document and save it to localStorage
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Memoize the context value to prevent unnecessary re-renders of consumers
    const value = useMemo(() => ({
        theme, setTheme, themes: availableThemes
    }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};