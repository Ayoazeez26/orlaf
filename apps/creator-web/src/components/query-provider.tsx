import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import type { ReactNode } from "react"
import { useState } from "react"
import { ApiError } from "@/lib/http-client"
import { toastMutationError } from "@/lib/toast"

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (
              query.meta &&
              "skipErrorToast" in query.meta &&
              query.meta.skipErrorToast
            ) {
              return
            }
            if (error instanceof ApiError && error.status === 401) return
            toastMutationError(error, "Something went wrong. Please try again.")
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
