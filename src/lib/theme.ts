export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = Exclude<Theme, "system">;

// Keep the storage key and media query in sync with index.html's early script.
export const THEME_STORAGE_KEY = "teamsync-theme";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

export function getStoredTheme(): Theme {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(storedTheme) ? storedTheme : "system";
  } catch {
    return "system";
  }
}

export function storeTheme(theme: Theme): void {
  try {
    if (theme === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  } catch {
    // The current tab still works when browser storage is unavailable.
  }
}

export function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(THEME_MEDIA_QUERY).matches ? "dark" : "light";
}

export function resolveTheme(theme: Theme, systemTheme: ResolvedTheme): ResolvedTheme {
  return theme === "system" ? systemTheme : theme;
}

export function applyTheme(theme: ResolvedTheme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;

  // Read the browser chrome color from CSS so the palette stays in one file.
  const background = getComputedStyle(root).getPropertyValue("--background").trim();
  if (background) {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", background);
  }
}

export function subscribeToThemeChanges(
  onPreferenceChange: (theme: Theme) => void,
  onSystemChange: (theme: ResolvedTheme) => void,
): () => void {
  const mediaQuery = window.matchMedia(THEME_MEDIA_QUERY);
  const handleSystemChange = () => onSystemChange(mediaQuery.matches ? "dark" : "light");
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      onPreferenceChange(getStoredTheme());
    }
  };

  mediaQuery.addEventListener("change", handleSystemChange);
  window.addEventListener("storage", handleStorageChange);
  handleSystemChange();

  return () => {
    mediaQuery.removeEventListener("change", handleSystemChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}
