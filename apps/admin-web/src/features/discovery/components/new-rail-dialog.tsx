import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import {
  RAIL_AUDIENCE_OPTIONS,
  RAIL_STATUS_OPTIONS,
  RAIL_TYPE_OPTIONS,
  SURFACE_OPTIONS,
} from "../constants"
import type {
  DiscoverySurface,
  RailAudience,
  RailStatus,
  RailType,
} from "../types"
import { useModalShell } from "./use-modal-shell"

interface NewRailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultSurface?: DiscoverySurface
  onConfirm?: () => void
}

export function NewRailDialog({
  open,
  onOpenChange,
  defaultSurface = "home",
  onConfirm,
}: NewRailDialogProps) {
  const [title, setTitle] = useState("Old Nollywood")
  const [surface, setSurface] = useState<DiscoverySurface>(defaultSurface)
  const [type, setType] = useState<RailType>("rail")
  const [status, setStatus] = useState<RailStatus>("draft")
  const [audience, setAudience] = useState<RailAudience>("all-users")

  useEffect(() => {
    if (!open) return
    setTitle("Old Nollywood")
    setSurface(defaultSurface)
    setType("rail")
    setStatus("draft")
    setAudience("all-users")
  }, [open, defaultSurface])

  useModalShell(open, onOpenChange)

  if (!open) return null

  function handleConfirm() {
    onConfirm?.()
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close dialog"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-rail-title"
        className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="new-rail-title"
                className="font-semibold text-foreground text-lg"
              >
                New rail
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Configure where and when this rail shows in the app.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X className="size-4" aria-hidden />
            </Button>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="rail-title">Title</Label>
            <Input
              id="rail-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Surface</Label>
              <Select
                value={surface}
                onValueChange={(value) => setSurface(value as DiscoverySurface)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SURFACE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as RailType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RAIL_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as RailStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RAIL_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Audience</Label>
              <Select
                value={audience}
                onValueChange={(value) => setAudience(value as RailAudience)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RAIL_AUDIENCE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-border border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm}>
            Create rail
          </Button>
        </div>
      </div>
    </div>
  )
}
