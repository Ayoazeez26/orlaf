import { toast as sonnerToast } from "sonner"

export const toast = sonnerToast

export function toastMutationError(error: unknown, fallback: string) {
  toast.error(error instanceof Error ? error.message : fallback)
}
