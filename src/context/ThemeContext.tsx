import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

type ThemeType = 'unsmart';

interface ThemeContextType {
  theme: ThemeType;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ theme: 'unsmart' }}>
      <div className="min-h-screen bg-ink text-text-main font-cabinet relative">
        {/* Ambient background is handled by the global CSS, but we can wrap children here */}
        <div className="ambient">
          <div className="amb a1"></div>
          <div className="amb a2"></div>
          <div className="amb a3"></div>
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
