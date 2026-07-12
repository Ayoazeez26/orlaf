import { GoogleOAuthProvider } from "@react-oauth/google"
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router"

import appCss from "@workspace/ui/globals.css?url"
import { QueryProvider } from "@/components/query-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/features/auth/auth-context"

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ""

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
        title: "Sable Creator",
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
      </head>
      <body suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <GoogleOAuthProvider clientId={googleClientId}>
              <ThemeProvider>{children}</ThemeProvider>
            </GoogleOAuthProvider>
          </AuthProvider>
        </QueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
