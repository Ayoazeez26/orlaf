import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  changePassword,
  disableTotp,
  enableTotp,
  fetchActiveSessions,
  fetchSecurityStatus,
  revokeOtherSessions,
  revokeSession,
  setPassword,
  setupTotp,
} from "../api/security-api"

export const securityKeys = {
  all: ["security"] as const,
  status: () => [...securityKeys.all, "status"] as const,
  sessions: () => [...securityKeys.all, "sessions"] as const,
}

export function useSecurityStatus() {
  return useQuery({
    queryKey: securityKeys.status(),
    queryFn: fetchSecurityStatus,
  })
}

export function useActiveSessions() {
  return useQuery({
    queryKey: securityKeys.sessions(),
    queryFn: fetchActiveSessions,
  })
}

export function useRevokeSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: securityKeys.sessions() })
    },
  })
}

export function useRevokeOtherSessions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokeOtherSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: securityKeys.sessions() })
    },
  })
}

export function useSetPassword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: setPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: securityKeys.status() })
    },
  })
}

export function useChangePassword() {
  return useMutation({ mutationFn: changePassword })
}

export function useSetupTotp() {
  return useMutation({ mutationFn: setupTotp })
}

export function useEnableTotp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: enableTotp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: securityKeys.status() })
    },
  })
}

export function useDisableTotp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: disableTotp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: securityKeys.status() })
    },
  })
}
