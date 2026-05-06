import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";

function createDeferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });
  return { promise, reject, resolve };
}

describe("ThemeToggle", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-theme-switching");
    document.documentElement.removeAttribute("data-theme-transition");
    document.documentElement.classList.remove("dark");

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  test("toggles directly between resolved light and dark with an accessible name", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = screen.getByRole("button", { name: /切换主题/ });
    expect(button).toHaveAttribute("aria-label", "切换主题，当前为跟随系统");

    await user.click(button);
    expect(button).toHaveAttribute("aria-label", "切换主题，当前为暗色");

    await user.click(button);
    expect(button).toHaveAttribute("aria-label", "切换主题，当前为亮色");
  });

  test("syncs the selected theme to localStorage and the html element", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = screen.getByRole("button", { name: /切换主题/ });

    await user.click(button);
    expect(localStorage.getItem("oh-blog-theme")).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");

    await user.click(button);
    expect(localStorage.getItem("oh-blog-theme")).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement).not.toHaveClass("dark");
  });

  test("switches from system dark to light in one click and persists the explicit theme", async () => {
    const user = userEvent.setup();

    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));

    const button = screen.getByRole("button", { name: /切换主题/ });
    await user.click(button);

    expect(localStorage.getItem("oh-blog-theme")).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement).not.toHaveClass("dark");
    expect(button).toHaveAttribute("aria-label", "切换主题，当前为亮色");
  });

  test("uses direction-specific clip-path and timing for light and dark view transitions", async () => {
    const user = userEvent.setup();
    const animate = vi.fn();
    const startViewTransition = vi.fn((update: () => void) => {
      update();
      return { ready: Promise.resolve() };
    });

    document.documentElement.animate = animate;
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: startViewTransition,
    });
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 120 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 80 });

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = screen.getByRole("button", { name: /切换主题/ });
    button.getBoundingClientRect = vi.fn(() => ({
      bottom: 50,
      height: 20,
      left: 40,
      right: 80,
      top: 30,
      width: 40,
      x: 40,
      y: 30,
      toJSON: vi.fn(),
    }));
    const expectedRadius =
      (Math.hypot(60, 40) / (Math.hypot(window.innerWidth, window.innerHeight) / Math.SQRT2)) *
      100;
    const expectedCircle = `circle(${expectedRadius}% at 50% 50%)`;

    await user.click(button);
    await waitFor(() =>
      expect(animate).toHaveBeenLastCalledWith(
        expect.objectContaining({
          clipPath: [expectedCircle, "circle(0% at 50% 50%)"],
        }),
        expect.objectContaining({
          duration: 560,
          easing: "cubic-bezier(0.2, 0, 0, 1)",
          fill: "both",
          pseudoElement: "::view-transition-old(root)",
        }),
      ),
    );

    await user.click(button);
    await waitFor(() =>
      expect(animate).toHaveBeenLastCalledWith(
        expect.objectContaining({
          clipPath: ["circle(0% at 50% 50%)", expectedCircle],
        }),
        expect.objectContaining({
          duration: 400,
          easing: "ease-in",
          fill: "both",
          pseudoElement: "::view-transition-new(root)",
        }),
      ),
    );
  });

  test("marks the active theme transition direction and cleans it up after animation", async () => {
    const user = userEvent.setup();
    const firstAnimation = createDeferred();
    const secondAnimation = createDeferred();
    const animate = vi
      .fn()
      .mockReturnValueOnce({ finished: firstAnimation.promise })
      .mockReturnValueOnce({ finished: secondAnimation.promise });
    const transitionDirections: Array<string | undefined> = [];
    const transitionSwitchingMarkers: Array<string | undefined> = [];
    const startViewTransition = vi.fn((update: () => void) => {
      transitionDirections.push(document.documentElement.dataset.themeTransition);
      transitionSwitchingMarkers.push(document.documentElement.dataset.themeSwitching);
      update();
      return { ready: Promise.resolve(), finished: Promise.resolve() };
    });

    document.documentElement.animate = animate;
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: startViewTransition,
    });

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = screen.getByRole("button", { name: /切换主题/ });

    await user.click(button);
    expect(transitionDirections.at(-1)).toBe("to-dark");
    expect(transitionSwitchingMarkers.at(-1)).toBe("true");
    expect(document.documentElement.dataset.themeTransition).toBe("to-dark");
    expect(document.documentElement.dataset.themeSwitching).toBe("true");

    firstAnimation.resolve();
    await waitFor(() => expect(document.documentElement.dataset.themeTransition).toBeUndefined());
    expect(document.documentElement.dataset.themeSwitching).toBeUndefined();

    await user.click(button);
    expect(transitionDirections.at(-1)).toBe("to-light");
    expect(transitionSwitchingMarkers.at(-1)).toBe("true");
    expect(document.documentElement.dataset.themeTransition).toBe("to-light");
    expect(document.documentElement.dataset.themeSwitching).toBe("true");

    secondAnimation.resolve();
    await waitFor(() => expect(document.documentElement.dataset.themeTransition).toBeUndefined());
    expect(document.documentElement.dataset.themeSwitching).toBeUndefined();
  });

  test("cleans up temporary theme transition markers when transition readiness fails", async () => {
    const user = userEvent.setup();
    const startViewTransition = vi.fn((update: () => void) => {
      update();
      return { ready: Promise.reject(new Error("transition failed")), finished: Promise.resolve() };
    });

    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: startViewTransition,
    });

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: /切换主题/ }));

    await waitFor(() => expect(document.documentElement.dataset.themeTransition).toBeUndefined());
    expect(document.documentElement.dataset.themeSwitching).toBeUndefined();
  });

  test("keeps server and first client render deterministic with a stored theme", () => {
    localStorage.setItem("oh-blog-theme", "dark");

    vi.stubGlobal("window", undefined);
    const serverMarkup = renderToString(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    vi.unstubAllGlobals();
    const clientFirstMarkup = renderToString(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(clientFirstMarkup).toBe(serverMarkup);
    expect(clientFirstMarkup).toContain("切换主题，当前为跟随系统");
  });
});
