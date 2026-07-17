import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { TEAM_SIZE_OPTIONS } from "../../constants"
import { useOnboardingPersist } from "../../hooks/use-onboarding-persist"
import { useOnboarding } from "../../onboarding-context"
import type { TeamSize } from "../../types"
import { OnboardingErrorNotice } from "../onboarding-error-notice"
import { OnboardingNav } from "../onboarding-nav"
import { OnboardingShell } from "../onboarding-shell"
import { SegmentedControl } from "../segmented-control"

const studioSchema = z.object({
  name: z.string().min(1, "Studio name is required"),
  website: z.union([z.string().url("Enter a valid URL"), z.literal("")]),
})

type StudioFormValues = z.infer<typeof studioSchema>

interface StudioStepProps {
  progress: { currentIndex: number; total: number }
  onBack: () => void
  onNext: () => void
  onSkip: () => void
}

export function StudioStep({
  progress,
  onBack,
  onNext,
  onSkip,
}: StudioStepProps) {
  const { data, dispatch } = useOnboarding()
  const { saveStudio, saveStudioSkip, isSaving, error } = useOnboardingPersist()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudioFormValues>({
    resolver: zodResolver(studioSchema),
    defaultValues: {
      name: data.studio.name,
      website: data.studio.website,
    },
  })

  const teamSize = data.studio.teamSize

  const onSubmit = async (values: StudioFormValues) => {
    const studioData = {
      ...data,
      studio: {
        name: values.name,
        teamSize,
        website: values.website ?? "",
      },
    }
    dispatch({
      type: "SET_STUDIO",
      payload: { name: values.name, website: values.website ?? "" },
    })
    try {
      await saveStudio(studioData)
      onNext()
    } catch {
      // error shown below
    }
  }

  const handleSkip = async () => {
    try {
      await saveStudioSkip()
      onSkip()
    } catch {
      // error shown below
    }
  }

  const handleTeamSize = (size: TeamSize) => {
    dispatch({ type: "SET_TEAM_SIZE", payload: size })
  }

  return (
    <OnboardingShell
      progress={progress}
      showBack
      onBack={onBack}
      footer={
        <OnboardingNav
          onSkip={handleSkip}
          onNext={handleSubmit(onSubmit)}
          nextDisabled={isSaving}
        />
      }
    >
      <div>
        <h1 className="font-semibold text-2xl">About your studio</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Help us set up your team workspace.
        </p>
      </div>

      {error && (
        <OnboardingErrorNotice
          message={error}
          onRetry={handleSubmit(onSubmit)}
          retrying={isSaving}
        />
      )}

      <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="studioName">Studio / Team Name</Label>
          <Input
            id="studioName"
            placeholder="e.g. Nollywood Digital Studios"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Team Size</Label>
          <SegmentedControl
            options={TEAM_SIZE_OPTIONS}
            value={teamSize}
            onChange={handleTeamSize}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website (optional)</Label>
          <Input
            id="website"
            placeholder="https://yourstudio.com"
            aria-invalid={!!errors.website}
            {...register("website")}
          />
          {errors.website && (
            <p className="text-destructive text-xs">{errors.website.message}</p>
          )}
        </div>
      </form>
    </OnboardingShell>
  )
}
