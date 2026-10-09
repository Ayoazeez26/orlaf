import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { io, type Socket } from "socket.io-client"
import { getValidAccessToken } from "@/lib/http-client"
import { getSocketBaseUrl } from "@/lib/socket-base-url"
import { inboxKeys } from "./inbox-hooks"

/** Keeps the admin notifications inbox live — refetches whenever the platform pushes a new admin alert. */
export function useAdminNotificationsRealtime() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket: Socket = io(`${getSocketBaseUrl()}/admin-notifications`, {
      auth: (cb) => {
        void getValidAccessToken().then((token) => cb({ token }))
      },
    })

    function refresh() {
      void queryClient.invalidateQueries({ queryKey: inboxKeys.all })
    }

    socket.on("notification:new", refresh)

    return () => {
      socket.disconnect()
    }
  }, [queryClient])
}
