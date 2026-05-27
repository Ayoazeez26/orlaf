import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import { GENRE_OPTIONS, LANGUAGE_OPTIONS } from "../../constants"
import { useUploadWizard } from "../../upload/upload-wizard-context"

interface UploadSeriesInfoStepProps {
  onNext: () => void
}

export function UploadSeriesInfoStep({ onNext }: UploadSeriesInfoStepProps) {
  const { state, dispatch } = useUploadWizard()

  const canContinue = state.title.trim().length > 0 && state.genre.length > 0

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="py-6 shadow-none">
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="series-title">Series Title</Label>
            <Input
              id="series-title"
              className="bg-input-bg dark:bg-input-bg"
              placeholder="e.g. Love in the City"
              value={state.title}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  payload: { title: e.target.value },
                })
              }
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Genre</Label>
              <Select
                value={state.genre || undefined}
                onValueChange={(genre) =>
                  dispatch({ type: "SET_FIELD", payload: { genre } })
                }
              >
                <SelectTrigger className="w-full bg-input-bg dark:bg-input-bg">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {GENRE_OPTIONS.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Language</Label>
              <Select
                value={state.language}
                onValueChange={(language) =>
                  dispatch({ type: "SET_FIELD", payload: { language } })
                }
              >
                <SelectTrigger className="w-full bg-input-bg dark:bg-input-bg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="synopsis">Synopsis</Label>
            <Textarea
              id="synopsis"
              className="min-h-24 bg-input-bg dark:bg-input-bg"
              placeholder="What's your series about?"
              rows={5}
              value={state.synopsis}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  payload: { synopsis: e.target.value },
                })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              className="bg-input-bg dark:bg-input-bg"
              placeholder="romance, drama, lagos (comma separated)"
              value={state.tags}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  payload: { tags: e.target.value },
                })
              }
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button disabled={!canContinue} onClick={onNext}>
          Next: Episodes →
        </Button>
      </div>
    </div>
  )
}
