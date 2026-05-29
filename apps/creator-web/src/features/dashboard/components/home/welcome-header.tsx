interface WelcomeHeaderProps {
  displayName: string
}

export function WelcomeHeader({ displayName }: WelcomeHeaderProps) {
  return (
    <div>
      <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
        Welcome, {displayName}.
      </h1>
      <p className="mt-1 text-muted-foreground text-sm">
        Track performance across all your series.
      </p>
    </div>
  )
}
