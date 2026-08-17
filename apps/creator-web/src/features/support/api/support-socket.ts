import type { SupportTicket } from "@sable/contracts"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { io, type Socket } from "socket.io-client"
import { getValidAccessToken } from "@/lib/http-client"
import { getSocketBaseUrl } from "@/lib/socket-base-url"
import { supportKeys } from "./support-hooks"

const SUPPORT_EVENTS = ["ticket:created", "ticket:message", "ticket:updated"]

/** Keeps the creator's support tickets live — updates the open ticket instantly and refreshes the list. */
export function useCreatorSupportRealtime() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket: Socket = io(`${getSocketBaseUrl()}/support`, {
      auth: (cb) => {
        void getValidAccessToken().then((token) => cb({ token }))
      },
    })

    function handleTicketEvent(ticket: SupportTicket) {
      queryClient.setQueryData(supportKeys.detail(ticket.id), ticket)
      void queryClient.invalidateQueries({ queryKey: supportKeys.all })
    }

    for (const event of SUPPORT_EVENTS) {
      socket.on(event, handleTicketEvent)
    }

    return () => {
      socket.disconnect()
    }
  }, [queryClient])
}
