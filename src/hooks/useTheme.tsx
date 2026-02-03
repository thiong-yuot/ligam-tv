import { createContext, useContext, useEffect, ReactNode } from "react";

// Dark mode only - no theme switching
interface ThemeContextType {
  theme: "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    // Always ensure dark mode is set
    const root = document.documentElement;
    root.classList.add("dark");
    localStorage.setItem("ligam-theme", "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
