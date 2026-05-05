import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme/theme-provider";

const orbitron = localFont({
  src: "./fonts/orbitron-v35-latin.woff2",
  variable: "--font-orbitron",
  weight: "400 900",
  display: "swap",
});

const shareTechMono = localFont({
  src: "./fonts/share-tech-mono-v16-latin.woff2",
  variable: "--font-share-tech",
  weight: "400",
  display: "swap",
});

const themeScript = `
(() => {
  const storageKey = "oh-blog-theme";
  const stored = localStorage.getItem(storageKey);
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  const resolved = theme === "system" ? (systemDark ? "dark" : "light") : theme;
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://oh-blog.local"),
  title: {
    default: "oh-blog",
    template: "%s | oh-blog",
  },
  description: "一个中文 Vaporwave / Outrun 风格的个人博客。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${orbitron.variable} ${shareTechMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
