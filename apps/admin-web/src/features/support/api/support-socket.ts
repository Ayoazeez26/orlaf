import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { io, type Socket } from "socket.io-client"
import { getValidAccessToken } from "@/lib/http-client"
import { getSocketBaseUrl } from "@/lib/socket-base-url"
import { adminSupportKeys } from "./support-hooks"

const SUPPORT_EVENTS = ["ticket:created", "ticket:message", "ticket:updated"]

/** Keeps the admin support inbox live — refetches on any ticket activity pushed over the socket. */
export function useAdminSupportRealtime() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket: Socket = io(`${getSocketBaseUrl()}/support`, {
      auth: (cb) => {
        void getValidAccessToken().then((token) => cb({ token }))
      },
    })

    function refresh() {
      void queryClient.invalidateQueries({ queryKey: adminSupportKeys.all })
    }

    for (const event of SUPPORT_EVENTS) {
      socket.on(event, refresh)
    }

    return () => {
      socket.disconnect()
    }
  }, [queryClient])
}
