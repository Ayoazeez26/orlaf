import { Link } from "@tanstack/react-router"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowLeft, Ban, RotateCcw, ShieldCheck, ShieldX } from "lucide-react"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import {
  useReactivateCreator,
  useSuspendCreator,
  useUnverifyCreator,
  useVerifyCreator,
} from "../../api/creators-hooks"
import type { CreatorDetail } from "../../types"
import { CreatorStatusBadge } from "../creator-badges"
import { CreatorSuspendDialog } from "./creator-suspend-dialog"
import { CreatorVerifyDialog } from "./creator-verify-dialog"

interface CreatorDetailHeaderProps {
  creator: CreatorDetail
  role: WorkspaceRoleId
}

export function CreatorDetailHeader({
  creator,
  role,
}: CreatorDetailHeaderProps) {
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const isActive = creator.status === "active"

  const verify = useVerifyCreator(creator.id)
  const unverify = useUnverifyCreator(creator.id)
  const suspend = useSuspendCreator(creator.id)
  const reactivate = useReactivateCreator(creator.id)

  const isBusy =
    verify.isPending ||
    unverify.isPending ||
    suspend.isPending ||
    reactivate.isPending

  return (
    <div className="space-y-4">
      <Link
        to="/workspace/$role/creators"
        params={{ role }}
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Creators
      </Link>

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-5")}>
        <CardContent className="flex flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 shrink-0">
              <AvatarFallback className="bg-primary/15 font-semibold text-lg text-primary">
                {creator.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-semibold text-foreground text-xl tracking-tight">
                  {creator.name}
                </h1>
                <CreatorStatusBadge status={creator.status} />
                {creator.isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-xs">
                    <ShieldCheck className="size-3.5" aria-hidden />
                    Verified
                  </span>
                ) : null}
              </div>
              <p className="truncate text-muted-foreground text-sm">
                {creator.email}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {creator.isVerified ? (
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                disabled={isBusy}
                onClick={() => unverify.mutate()}
              >
                <ShieldX className="size-4" aria-hidden />
                Unverify
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                disabled={isBusy}
                onClick={() => setVerifyOpen(true)}
              >
                <ShieldCheck className="size-4" aria-hidden />
                Verify
              </Button>
            )}
            {isActive ? (
              <Button
                type="button"
                className="gap-2 bg-destructive text-white hover:bg-destructive/90"
                disabled={isBusy}
                onClick={() => setSuspendOpen(true)}
              >
                <Ban className="size-4" aria-hidden />
                Suspend
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                disabled={isBusy}
                onClick={() => reactivate.mutate()}
              >
                <RotateCcw className="size-4" aria-hidden />
                Reactivate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <CreatorSuspendDialog
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        creatorName={creator.name}
        onConfirm={({ duration, reason }) =>
          suspend.mutate({ duration, reason: reason || undefined })
        }
      />

      <CreatorVerifyDialog
        open={verifyOpen}
        onOpenChange={setVerifyOpen}
        creatorName={creator.name}
        creatorEmail={creator.email}
        creatorUsername={creator.username}
        onConfirm={() => verify.mutate(undefined)}
      />
    </div>
  )
}
