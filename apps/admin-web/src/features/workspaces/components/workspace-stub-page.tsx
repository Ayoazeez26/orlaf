interface WorkspaceStubPageProps {
  title: string
  description?: string
}

export function WorkspaceStubPage({
  title,
  description = "This section is coming soon.",
}: WorkspaceStubPageProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <h1 className="font-semibold text-2xl capitalize">{title}</h1>
      <p className="mt-2 max-w-md text-muted-foreground text-sm">
        {description}
      </p>
    </div>
  )
}
