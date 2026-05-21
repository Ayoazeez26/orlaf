interface WelcomeHeaderProps {
  displayName: string
}

export function WelcomeHeader({ displayName }: WelcomeHeaderProps) {
  return (
    <div>
      <h1 className="font-semibold text-3xl tracking-tight">
        Welcome, {displayName}.
      </h1>
      <p className="mt-1 text-muted-foreground text-sm">
        Track performance across all your series.
      </p>
    </div>
  )
}
