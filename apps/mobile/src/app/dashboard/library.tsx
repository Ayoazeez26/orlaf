import { useState } from "react"
import { Text, View } from "react-native"
import {
  CreatorsTabContent,
  DownloadsTabContent,
  HistoryTabContent,
  WatchlistTabContent,
} from "../../features/library/components/library-tab-content"
import { LibraryTabs } from "../../features/library/components/library-tabs"
import type { LibraryTabId } from "../../features/library/data"

export default function Library() {
  const [activeTab, setActiveTab] = useState<LibraryTabId>("watchlist")

  return (
    <View className="flex-1 bg-black">
      <View className="px-5 pt-14 pb-4">
        <Text className="font-bold text-2xl text-white">My Library</Text>
      </View>

      <LibraryTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <View className="flex-1 pt-2">
        {activeTab === "watchlist" ? <WatchlistTabContent /> : null}
        {activeTab === "history" ? <HistoryTabContent /> : null}
        {activeTab === "downloads" ? <DownloadsTabContent /> : null}
        {activeTab === "creators" ? <CreatorsTabContent /> : null}
      </View>
    </View>
  )
}
