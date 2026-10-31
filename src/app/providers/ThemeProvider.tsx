import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";

import {
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  resolveTheme,
  storeTheme,
  subscribeToThemeChanges,
  type Theme,
} from "@/lib/theme";

import { ThemeContext } from "./theme-context";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState(getStoredTheme);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);
  const resolvedTheme = resolveTheme(theme, systemTheme);

  useLayoutEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => subscribeToThemeChanges(setThemeState, setSystemTheme), []);

  const setTheme = useCallback((nextTheme: Theme) => {
    storeTheme(nextTheme);
    setThemeState(nextTheme);
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
