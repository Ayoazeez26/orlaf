import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { SableBrandMark } from "@/components/sable-brand-mark"
import { ThemeSwitcher } from "@/components/theme-switcher"

interface PasswordResetShellProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

export function PasswordResetShell({
  title,
  description,
  children,
  footer,
}: PasswordResetShellProps) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8">
      <div className="absolute top-4 right-4 left-4 z-10 flex justify-end sm:left-auto">
        <ThemeSwitcher compact />
      </div>
      <SableBrandMark className="mb-6" subtitle="Creators" />
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <h1 className="font-semibold text-xl sm:text-2xl">{title}</h1>
          <p className="mt-2 text-muted-foreground text-sm">{description}</p>
        </div>
        <div className="mt-8">{children}</div>
        {footer ?? (
          <p className="mt-6 text-center text-muted-foreground text-sm">
            Remember your password?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
