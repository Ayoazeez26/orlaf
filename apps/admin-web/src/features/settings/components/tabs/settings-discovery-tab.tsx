import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useState } from "react"
import { HERO_ROTATION_OPTIONS } from "../../constants"
import {
  SettingsDivider,
  SettingsField,
  SettingsPanel,
  SettingsSection,
  ToggleField,
} from "../settings-shared"

export function SettingsDiscoveryTab() {
  const [heroRotation, setHeroRotation] = useState("Every 24 hours")
  const [maxRails, setMaxRails] = useState("8")
  const [showNewRail, setShowNewRail] = useState(true)
  const [enableForYou, setEnableForYou] = useState(true)
  const [personalisation, setPersonalisation] = useState(65)
  const [recentCreators, setRecentCreators] = useState(true)
  const [boostNewCreators, setBoostNewCreators] = useState(true)

  return (
    <SettingsPanel>
      <SettingsSection
        title="Home / Discover"
        subtitle="Defaults for the curated home page on the main app."
      >
        <SettingsField label="Featured hero rotation">
          <Select value={heroRotation} onValueChange={setHeroRotation}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HERO_ROTATION_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label="Max rails on home">
          <Input
            type="number"
            value={maxRails}
            onChange={(event) => setMaxRails(event.target.value)}
            className="h-9"
          />
        </SettingsField>
        <ToggleField
          label="Show 'New on Sable' rail"
          hint="Auto-generated from series published in the last 14 days."
          checked={showNewRail}
          onCheckedChange={setShowNewRail}
        />
      </SettingsSection>

      <SettingsDivider />

      <SettingsSection title="For You" subtitle="Personalised feed behaviour.">
        <ToggleField
          label="Enable For You"
          hint="Turn off to show only curated content."
          checked={enableForYou}
          onCheckedChange={setEnableForYou}
        />
        <SettingsField
          label="Personalisation strength"
          hint="Higher = stronger weighting on watch history."
        >
          <input
            type="range"
            min={0}
            max={100}
            value={personalisation}
            onChange={(event) => setPersonalisation(Number(event.target.value))}
            className="h-2 w-full cursor-pointer accent-primary"
          />
        </SettingsField>
        <ToggleField
          label="Include recently watched creators"
          hint="Surface new episodes from creators a viewer has watched."
          checked={recentCreators}
          onCheckedChange={setRecentCreators}
        />
        <ToggleField
          label="Boost new creators"
          hint="Give first-time creators extra impressions for their first week."
          checked={boostNewCreators}
          onCheckedChange={setBoostNewCreators}
        />
      </SettingsSection>
    </SettingsPanel>
  )
}
