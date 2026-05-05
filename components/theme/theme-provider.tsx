"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

type Theme = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme, origin?: { x: number; y: number }) => void;
};

type ThemeState = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
};

type ThemeAction = {
  type: "sync";
  theme: Theme;
  resolvedTheme: ResolvedTheme;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const storageKey = "oh-blog-theme";
const defaultThemeState: ThemeState = {
  theme: "system",
  resolvedTheme: "dark",
};

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";

  const stored = localStorage.getItem(storageKey);
  return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
}

function themeReducer(_state: ThemeState, action: ThemeAction): ThemeState {
  return {
    theme: action.theme,
    resolvedTheme: action.resolvedTheme,
  };
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

function applyTheme(theme: Theme): ResolvedTheme {
  const resolved = resolveTheme(theme);
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  return resolved;
}

function animateThemeChange(update: () => void, origin?: { x: number; y: number }) {
  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const startViewTransition = document.startViewTransition?.bind(document);

  if (!origin || prefersReducedMotion || !startViewTransition) {
    update();
    return;
  }

  const transition = startViewTransition(update);
  const endRadius = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  );

  void transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${origin.x}px ${origin.y}px)`,
          `circle(${endRadius}px at ${origin.x}px ${origin.y}px)`,
        ],
      },
      {
        duration: 520,
        easing: "cubic-bezier(.4, 0, .2, 1)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeState, dispatch] = useReducer(themeReducer, defaultThemeState);
  const { theme, resolvedTheme } = themeState;

  useEffect(() => {
    const storedTheme = getStoredTheme();
    dispatch({
      type: "sync",
      theme: storedTheme,
      resolvedTheme: applyTheme(storedTheme),
    });
  }, []);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;

    const listener = () => {
      if (theme === "system") {
        dispatch({
          type: "sync",
          theme: "system",
          resolvedTheme: applyTheme("system"),
        });
      }
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  const setTheme = useCallback((nextTheme: Theme, origin?: { x: number; y: number }) => {
    animateThemeChange(() => {
      localStorage.setItem(storageKey, nextTheme);
      dispatch({
        type: "sync",
        theme: nextTheme,
        resolvedTheme: applyTheme(nextTheme),
      });
    }, origin);
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
