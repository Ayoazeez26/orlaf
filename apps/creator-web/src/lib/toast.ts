import { toast as sonnerToast } from "sonner"

export const toast = sonnerToast

export function toastMutationError(error: unknown, fallback: string) {
  toast.error(error instanceof Error ? error.message : fallback)
}

export function toastApiError(message: string) {
  toast.error(message)
}
