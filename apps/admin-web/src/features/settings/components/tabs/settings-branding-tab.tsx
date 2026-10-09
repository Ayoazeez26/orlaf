import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { ImageIcon, Loader2, Upload } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast, toastMutationError } from "@/lib/toast"
import {
  useBrandingSettingsQuery,
  useUpdateBrandingSettings,
  useUploadBrandingAsset,
} from "../../api/branding-settings-hooks"
import { registerSettingsSave } from "../../lib/settings-form-actions"
import {
  SettingsDivider,
  SettingsField,
  SettingsPanel,
  SettingsSection,
  ToggleField,
} from "../settings-shared"

const HEX_COLOR = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/

export function SettingsBrandingTab() {
  const { data, isLoading } = useBrandingSettingsQuery()
  const updateSettings = useUpdateBrandingSettings()
  const uploadAsset = useUploadBrandingAsset()

  const [primaryColor, setPrimaryColor] = useState("#B67233")
  const [accentColor, setAccentColor] = useState("#FFD2A8")
  const [darkModeDefault, setDarkModeDefault] = useState(true)
  const [logoUrl, setLogoUrl] = useState("")
  const [shareImageUrl, setShareImageUrl] = useState("")

  const logoInputRef = useRef<HTMLInputElement>(null)
  const shareImageInputRef = useRef<HTMLInputElement>(null)
  const [uploadingAsset, setUploadingAsset] = useState<
    "logo" | "share-image" | null
  >(null)

  useEffect(() => {
    if (!data) return
    setPrimaryColor(data.brandingPrimaryColor)
    setAccentColor(data.brandingAccentColor)
    setDarkModeDefault(data.brandingDarkModeDefault)
    setLogoUrl(data.brandingLogoUrl)
    setShareImageUrl(data.brandingShareImageUrl)
  }, [data])

  const handleSave = useCallback(() => {
    if (!HEX_COLOR.test(primaryColor) || !HEX_COLOR.test(accentColor)) {
      toast.error("Colors must be valid hex codes, e.g. #B67233")
      return
    }

    updateSettings.mutate(
      {
        brandingPrimaryColor: primaryColor,
        brandingAccentColor: accentColor,
        brandingDarkModeDefault: darkModeDefault,
        brandingLogoUrl: logoUrl,
        brandingShareImageUrl: shareImageUrl,
      },
      {
        onSuccess: () => toast.success("Branding saved — live everywhere now"),
        onError: (error) =>
          toastMutationError(error, "Unable to save branding"),
      }
    )
  }, [
    primaryColor,
    accentColor,
    darkModeDefault,
    logoUrl,
    shareImageUrl,
    updateSettings,
  ])

  useEffect(() => registerSettingsSave(handleSave), [handleSave])

  async function handleUpload(
    assetType: "logo" | "share-image",
    file: File | undefined
  ) {
    if (!file) return
    setUploadingAsset(assetType)
    try {
      const imageUrl = await uploadAsset.mutateAsync({ assetType, file })
      if (assetType === "logo") setLogoUrl(imageUrl)
      else setShareImageUrl(imageUrl)
      toast.success("Uploaded — click Save changes to publish it")
    } catch {
      toast.error("Upload failed. Please try a different file.")
    } finally {
      setUploadingAsset(null)
    }
  }

  return (
    <SettingsPanel>
      <SettingsSection
        title="Identity"
        subtitle="How Sable TV looks across creator-web, admin-web, and mobile."
      >
        <SettingsField label="Logo">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Current logo"
                className="size-10 rounded-full object-contain"
              />
            ) : (
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                S
              </span>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={(event) =>
                void handleUpload("logo", event.target.files?.[0])
              }
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={uploadingAsset === "logo"}
              onClick={() => logoInputRef.current?.click()}
            >
              {uploadingAsset === "logo" ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Upload className="size-4" aria-hidden />
              )}
              Upload
            </Button>
            {logoUrl ? (
              <button
                type="button"
                className="text-muted-foreground text-sm hover:text-foreground"
                onClick={() => setLogoUrl("")}
              >
                Remove
              </button>
            ) : null}
          </div>
        </SettingsField>
        <SettingsField
          label="Default share image"
          hint="Falls back when a series has no thumbnail."
        >
          <div className="flex items-center gap-3">
            <input
              ref={shareImageInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(event) =>
                void handleUpload("share-image", event.target.files?.[0])
              }
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={uploadingAsset === "share-image"}
              onClick={() => shareImageInputRef.current?.click()}
            >
              {uploadingAsset === "share-image" ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <ImageIcon className="size-4" aria-hidden />
              )}
              Upload image
            </Button>
            {shareImageUrl ? (
              <button
                type="button"
                className="text-muted-foreground text-sm hover:text-foreground"
                onClick={() => setShareImageUrl("")}
              >
                Remove
              </button>
            ) : null}
          </div>
        </SettingsField>
      </SettingsSection>

      <SettingsDivider />

      <SettingsSection
        title="Color"
        subtitle="Applied live to creator-web and admin-web on save. Mobile picks it up on next app launch."
      >
        <SettingsField label="Primary">
          <div className="flex items-center gap-2">
            <span
              className="size-9 shrink-0 rounded-lg border border-border"
              style={{ backgroundColor: primaryColor }}
            />
            <Input
              value={primaryColor}
              onChange={(event) => setPrimaryColor(event.target.value)}
              className="h-9"
            />
          </div>
        </SettingsField>
        <SettingsField label="Accent">
          <div className="flex items-center gap-2">
            <span
              className={cn("size-9 shrink-0 rounded-lg border border-border")}
              style={{ backgroundColor: accentColor }}
            />
            <Input
              value={accentColor}
              onChange={(event) => setAccentColor(event.target.value)}
              className="h-9"
            />
          </div>
        </SettingsField>
        <ToggleField
          label="Dark mode default"
          hint="Open the main app in dark theme by default for visitors without a saved preference."
          checked={darkModeDefault}
          onCheckedChange={setDarkModeDefault}
        />
      </SettingsSection>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isLoading || updateSettings.isPending}
        >
          {updateSettings.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </SettingsPanel>
  )
}
