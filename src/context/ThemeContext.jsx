import React, { createContext, useContext, useState, useEffect } from 'react';

// Create ThemeContext
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  isDark: false,
});

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to system preference/light
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('app_theme');
      if (savedTheme) {
        return savedTheme;
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch {
      return 'light';
    }
  });

  // Sync theme changes to localStorage and DOM
  useEffect(() => {
    try {
      localStorage.setItem('app_theme', theme);
    } catch (e) {
      console.warn('Unable to save theme to localStorage', e);
    }

    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for convenient consumption
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
