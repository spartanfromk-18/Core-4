import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type ThemeType = 'dark' | 'vibrant';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('vibrant');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'vibrant' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`min-h-screen ${theme === 'vibrant' ? 'bg-cyber-bg text-white' : 'bg-[#000000] text-gray-200'}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
