import { useEffect, useState } from "react"
import { subscribeAuthBootstrapProgress } from "../lib/auth-bootstrap-progress"

export function useAuthBootstrapProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const unsubscribe = subscribeAuthBootstrapProgress(setProgress)
    return () => {
      unsubscribe()
    }
  }, [])

  return progress
}
