import type { ComponentProps } from "react"
import { MobileSeriesPreview } from "./mobile-series-preview"

type UploadSeriesPreviewAsideProps = ComponentProps<typeof MobileSeriesPreview>

export function UploadSeriesPreviewAside(props: UploadSeriesPreviewAsideProps) {
  return (
    <aside className="min-w-0">
      <p className="mb-3 font-medium text-muted-foreground text-sm xl:sr-only">
        Series preview
      </p>
      <div className="xl:sticky xl:top-8">
        <MobileSeriesPreview {...props} />
      </div>
    </aside>
  )
}
