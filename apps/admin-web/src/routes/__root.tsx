import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router"

import appCss from "@workspace/ui/globals.css?url"
import { QueryProvider } from "@/components/query-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"
import { AuthProvider } from "@/features/auth/auth-context"
import { BrandingStyleInjector } from "@/features/branding/branding-style-injector"

/**
 * Applies the last-fetched branding colors before first paint, straight from
 * localStorage — avoids a flash of the default purple theme on repeat
 * visits. BrandingStyleInjector (mounted inside QueryProvider) re-applies
 * with a freshly-fetched value shortly after and keeps the cache warm.
 */
const brandingBootstrapScript = `
  (function () {
    try {
      var cached = JSON.parse(localStorage.getItem("sable:branding") || "null");
      if (!cached) return;
      var root = document.documentElement;
      if (cached.primaryColor) {
        root.style.setProperty("--primary", cached.primaryColor);
        root.style.setProperty("--sidebar-primary", cached.primaryColor);
      }
      if (cached.accentColor) root.style.setProperty("--accent", cached.accentColor);
    } catch (e) {}
  })();
`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Sable TV Admin",
      },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, no user input */}
        <script dangerouslySetInnerHTML={{ __html: brandingBootstrapScript }} />
      </head>
      <body suppressHydrationWarning>
        <QueryProvider>
          <BrandingStyleInjector />
          <AuthProvider>
            <ThemeProvider>
              {children}
              <Toaster position="top-right" richColors closeButton />
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
