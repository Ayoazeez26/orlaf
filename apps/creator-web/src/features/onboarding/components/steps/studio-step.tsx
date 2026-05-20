import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { TEAM_SIZE_OPTIONS } from "../../constants"
import { useOnboarding } from "../../onboarding-context"
import type { TeamSize } from "../../types"
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

  const onSubmit = (values: StudioFormValues) => {
    dispatch({
      type: "SET_STUDIO",
      payload: { name: values.name, website: values.website ?? "" },
    })
    onNext()
  }

  const handleTeamSize = (size: TeamSize) => {
    dispatch({ type: "SET_TEAM_SIZE", payload: size })
  }

  return (
    <OnboardingShell
      progress={progress}
      showBack
      onBack={onBack}
      footer={<OnboardingNav onSkip={onSkip} onNext={handleSubmit(onSubmit)} />}
    >
      <div>
        <h1 className="text-2xl font-semibold">About your studio</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Help us set up your team workspace.
        </p>
      </div>

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
            <p className="text-xs text-destructive">{errors.name.message}</p>
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
            <p className="text-xs text-destructive">{errors.website.message}</p>
          )}
        </div>
      </form>
    </OnboardingShell>
  )
}
