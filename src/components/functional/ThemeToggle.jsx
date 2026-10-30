import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ThemeToggle Component
 * Consumes ThemeContext to toggle between Light and Dark modes.
 * Clean, simple UI button.
 */
export const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle-btn"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      aria-label="Toggle theme mode"
    >
      <span className="theme-icon" aria-hidden="true">
        {isDark ? '☀️' : '🌙'}
      </span>
      <span className="theme-text">
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;
