import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ReactNode } from "react"
import { readCachedBranding } from "@/lib/branding"

export function ThemeProvider({ children }: { children: ReactNode }) {
  // A visitor without a stored theme preference (next-themes' own
  // localStorage key) opens in whichever theme Settings → Branding's "Dark
  // mode default" specifies. enableSystem still lets them switch to
  // "System" manually if the app exposes that option.
  const defaultTheme = readCachedBranding().darkModeDefault ? "dark" : "light"

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
