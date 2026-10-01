import { GoogleOAuthProvider } from "@react-oauth/google"
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router"

import appCss from "@workspace/ui/globals.css?url"
import { QueryProvider } from "@/components/query-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"
import { AuthProvider } from "@/features/auth/auth-context"

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ""
const tawkSrc = import.meta.env.VITE_TAWK_SRC ?? ""

/**
 * Loads the Tawk.to widget but keeps its default floating launcher hidden —
 * live-chat-panel.tsx opens it explicitly (openTawkChat) instead, so it stays
 * scoped to the Support tab rather than floating over the whole dashboard.
 * Dispatches TAWK_LOADED_EVENT (see @/lib/tawk) once ready.
 *
 * onStatusChange is wired here, at bootstrap, rather than from a React
 * effect — Tawk reports the visitor's *initial* status through this same
 * callback shortly after onLoad, often before any component that wants it
 * has mounted. Wiring it late would miss that first, authoritative report
 * and leave the UI trusting Tawk_API.getStatus()'s pre-sync default
 * ("online"). Re-dispatching it as a DOM event lets any number of listeners
 * (mounted before or after the fact) pick up the real status.
 */
const tawkBootstrapScript = tawkSrc
  ? `
    var Tawk_API = Tawk_API || {};
    Tawk_API.onLoad = function () {
      Tawk_API.hideWidget();
      window.dispatchEvent(new Event("tawk:loaded"));
    };
    Tawk_API.onStatusChange = function (status) {
      window.dispatchEvent(new CustomEvent("tawk:status", { detail: status }));
    };
    var Tawk_LoadStart = new Date();
    (function(){
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "${tawkSrc}";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode.insertBefore(s1, s0);
    })();
  `
  : ""

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
              <ThemeProvider>
                {children}
                <Toaster position="top-right" richColors closeButton />
              </ThemeProvider>
            </GoogleOAuthProvider>
          </AuthProvider>
        </QueryProvider>
        {tawkBootstrapScript && (
          // biome-ignore lint/security/noDangerouslySetInnerHtml: vendor embed snippet, no user input
          <script dangerouslySetInnerHTML={{ __html: tawkBootstrapScript }} />
        )}
        <Scripts />
      </body>
    </html>
  )
}
