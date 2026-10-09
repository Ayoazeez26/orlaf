import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { Textarea } from "@workspace/ui/components/textarea"
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, toastMutationError } from "@/lib/toast"
import {
  useCreateHelpArticle,
  useDeleteHelpArticle,
  useHelpArticleQuery,
  useHelpArticlesQuery,
  useUpdateHelpArticle,
} from "../../api/help-articles-hooks"
import { SettingsPanel, SettingsSection } from "../settings-shared"

interface DraftState {
  title: string
  category: string
  body: string
  isPublished: boolean
}

const EMPTY_DRAFT: DraftState = {
  title: "",
  category: "",
  body: "",
  isPublished: false,
}

export function SettingsHelpArticlesTab() {
  const articlesQuery = useHelpArticlesQuery()
  const createArticle = useCreateHelpArticle()
  const updateArticle = useUpdateHelpArticle()
  const deleteArticle = useDeleteHelpArticle()

  const [editingId, setEditingId] = useState<string | "new" | null>(null)
  const editingQuery = useHelpArticleQuery(
    editingId && editingId !== "new" ? editingId : null
  )
  const [draft, setDraft] = useState<DraftState>(EMPTY_DRAFT)

  useEffect(() => {
    if (editingId === "new") setDraft(EMPTY_DRAFT)
    else if (editingQuery.data) {
      setDraft({
        title: editingQuery.data.title,
        category: editingQuery.data.category,
        body: editingQuery.data.body,
        isPublished: editingQuery.data.isPublished,
      })
    }
  }, [editingId, editingQuery.data])

  const isSaving = createArticle.isPending || updateArticle.isPending
  const canSave =
    draft.title.trim() && draft.category.trim() && draft.body.trim()

  const handleSave = () => {
    const body = {
      title: draft.title.trim(),
      category: draft.category.trim(),
      body: draft.body.trim(),
      isPublished: draft.isPublished,
    }

    const onSettled = {
      onSuccess: () => {
        toast.success(editingId === "new" ? "Article created" : "Article saved")
        setEditingId(null)
      },
      onError: (error: unknown) =>
        toastMutationError(error, "Unable to save article"),
    }

    if (editingId === "new") {
      createArticle.mutate(body, onSettled)
    } else if (editingId) {
      updateArticle.mutate({ id: editingId, body }, onSettled)
    }
  }

  const handleDelete = (id: string) => {
    deleteArticle.mutate(id, {
      onSuccess: () => toast.success("Article deleted"),
      onError: (error) => toastMutationError(error, "Unable to delete article"),
    })
  }

  if (editingId) {
    const isNew = editingId === "new"
    const isLoadingDraft = !isNew && editingQuery.isLoading

    return (
      <SettingsPanel>
        <SettingsSection
          title={isNew ? "New help article" : "Edit help article"}
          subtitle="Shown in the creator help center once published."
        >
          {isLoadingDraft ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Loading…
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="article-title">Title</Label>
                  <Input
                    id="article-title"
                    value={draft.title}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, title: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="article-category">Category</Label>
                  <Input
                    id="article-category"
                    placeholder="e.g. Getting Paid"
                    value={draft.category}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, category: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="article-body">Body</Label>
                <Textarea
                  id="article-body"
                  rows={10}
                  value={draft.body}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, body: e.target.value }))
                  }
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="article-published"
                  checked={draft.isPublished}
                  onCheckedChange={(checked) =>
                    setDraft((d) => ({ ...d, isPublished: checked }))
                  }
                />
                <Label htmlFor="article-published" className="font-normal">
                  Published — visible in the help center
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  disabled={!canSave || isSaving}
                  onClick={handleSave}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                      Saving…
                    </>
                  ) : (
                    "Save article"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </SettingsSection>
      </SettingsPanel>
    )
  }

  return (
    <SettingsPanel>
      <SettingsSection
        title="Help articles"
        subtitle="Manage the articles creators see in the help center."
      >
        <div className="flex justify-end">
          <Button type="button" size="sm" onClick={() => setEditingId("new")}>
            <Plus className="size-4" aria-hidden />
            New article
          </Button>
        </div>

        {articlesQuery.isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading articles…
          </div>
        ) : articlesQuery.data?.items.length === 0 ? (
          <p className="rounded-lg border border-dashed py-8 text-center text-muted-foreground text-sm">
            No articles yet. Content is pending tester feedback — add articles
            here once it's ready.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border">
            {articlesQuery.data?.items.map((article) => (
              <li
                key={article.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground text-sm">
                    {article.title}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {article.category}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge
                    className="leading-relaxed pt-0.5"
                    variant={article.isPublished ? "default" : "outline"}
                  >
                    {article.isPublished ? "Published" : "Draft"}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Edit"
                    onClick={() => setEditingId(article.id)}
                  >
                    <Pencil className="size-4" aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Delete"
                    onClick={() => handleDelete(article.id)}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SettingsSection>
    </SettingsPanel>
  )
}
