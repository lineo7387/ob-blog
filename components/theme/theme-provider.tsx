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
const themeTransitionAnimation = {
  "to-light": {
    duration: 400,
    easing: "ease-in",
  },
  "to-dark": {
    duration: 560,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
  },
} as const;

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

function animateThemeChange(
  update: () => void,
  nextResolvedTheme: ResolvedTheme,
  origin?: { x: number; y: number },
) {
  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const startViewTransition = document.startViewTransition?.bind(document);

  if (!origin || prefersReducedMotion || !startViewTransition) {
    update();
    return;
  }

  const transitionDirection = nextResolvedTheme === "light" ? "to-light" : "to-dark";
  const root = document.documentElement;
  root.dataset.themeTransition = transitionDirection;
  root.dataset.themeSwitching = "true";

  const cleanupTransitionMarkers = () => {
    if (root.dataset.themeTransition === transitionDirection) {
      delete root.dataset.themeTransition;
    }
    if (root.dataset.themeSwitching === "true") {
      delete root.dataset.themeSwitching;
    }
  };

  const transition = startViewTransition(update);
  const viewportWidth = Math.max(window.innerWidth, 1);
  const viewportHeight = Math.max(window.innerHeight, 1);
  const endRadius = Math.hypot(
    Math.max(origin.x, viewportWidth - origin.x),
    Math.max(origin.y, viewportHeight - origin.y),
  );
  const cssReferenceRadius = Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2;
  const radius = (endRadius / cssReferenceRadius) * 100;
  const x = (origin.x / viewportWidth) * 100;
  const y = (origin.y / viewportHeight) * 100;

  const clipPath =
    nextResolvedTheme === "light"
      ? [
          `circle(0% at ${x}% ${y}%)`,
          `circle(${radius}% at ${x}% ${y}%)`,
        ]
      : [
          `circle(${radius}% at ${x}% ${y}%)`,
          `circle(0% at ${x}% ${y}%)`,
        ];
  const pseudoElement =
    nextResolvedTheme === "light" ? "::view-transition-new(root)" : "::view-transition-old(root)";
  const animationTiming = themeTransitionAnimation[transitionDirection];

  void transition.ready
    .then(() => {
      const animation = root.animate(
        {
          clipPath,
        },
        {
          ...animationTiming,
          fill: "both",
          pseudoElement,
        },
      );

      return animation.finished ?? transition.finished;
    })
    .catch(() => undefined)
    .finally(() => {
      cleanupTransitionMarkers();
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
    const nextResolvedTheme = resolveTheme(nextTheme);

    animateThemeChange(() => {
      localStorage.setItem(storageKey, nextTheme);
      const resolved = applyTheme(nextTheme);
      dispatch({
        type: "sync",
        theme: nextTheme,
        resolvedTheme: resolved,
      });
    }, nextResolvedTheme, origin);
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
