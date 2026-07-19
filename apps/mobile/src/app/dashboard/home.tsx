import { useState } from "react"
import { View } from "react-native"
import { HomeCategoryTabs } from "../../features/home/components/home-category-tabs"
import { HomeHeader } from "../../features/home/components/home-header"
import { HomeTabContent } from "../../features/home/components/home-tab-content"
import type { HomeCategoryTabId } from "../../features/home/constants"

export default function Home() {
  const [activeTab, setActiveTab] = useState<HomeCategoryTabId>("featured")

  return (
    <View className="flex-1 bg-background">
      <HomeHeader />
      <HomeCategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <HomeTabContent tabId={activeTab} />
    </View>
  )
}
