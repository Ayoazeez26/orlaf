import { useState } from "react"
import { BundlesTable } from "@/features/coin-economy/components/bundles-table"
import { SettingsTab } from "@/features/coin-economy/components/tabs/settings-tab"
import { MOCK_COIN_BUNDLES } from "@/features/coin-economy/data/mock-bundles"
import type { CoinBundle } from "@/features/coin-economy/types"
import { SettingsPanel, SettingsSection } from "../settings-shared"

export function SettingsCoinEconomyTab() {
  const [bundles] = useState<CoinBundle[]>(MOCK_COIN_BUNDLES)

  return (
    <div className="space-y-6">
      <SettingsTab />

      <SettingsPanel>
        <SettingsSection
          title="Coin bundles"
          subtitle="Bundles users can purchase from the store."
        >
          <BundlesTable
            bundles={bundles}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </SettingsSection>
      </SettingsPanel>
    </div>
  )
}
