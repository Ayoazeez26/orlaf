import { BundlesTable } from "@/features/coin-economy/components/bundles-table"
import { SettingsTab } from "@/features/coin-economy/components/tabs/settings-tab"
import { useAdminCoinBundles } from "@/features/coin-economy/api/coin-economy-hooks"
import { SettingsPanel, SettingsSection } from "../settings-shared"

export function SettingsCoinEconomyTab() {
  const bundlesQuery = useAdminCoinBundles()

  return (
    <div className="space-y-6">
      <SettingsTab />

      <SettingsPanel>
        <SettingsSection
          title="Coin bundles"
          subtitle="Bundles users can purchase from the store."
        >
          <BundlesTable
            bundles={bundlesQuery.data ?? []}
            isLoading={bundlesQuery.isLoading}
            readOnly
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </SettingsSection>
      </SettingsPanel>
    </div>
  )
}
