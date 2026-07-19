import { QueryClient } from "@tanstack/react-query"
import { ApiError } from "./http-client"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't refetch on window focus in mobile
      refetchOnWindowFocus: false,
      // Retry once on failure, but not on 4xx (client errors)
      retry: (failureCount, error) => {
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false
        }
        return failureCount < 1
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
})
