import { Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../../../constants/theme"
import { LIBRARY_TABS, type LibraryTabId } from "../data"

type LibraryTabsProps = {
  activeTab: LibraryTabId
  onTabChange: (tab: LibraryTabId) => void
}

export function LibraryTabs({ activeTab, onTabChange }: LibraryTabsProps) {
  return (
    <View className="flex-row border-white/10 border-b px-5">
      {LIBRARY_TABS.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            className="mr-5 pb-3"
          >
            <View className="flex-row items-center gap-1.5">
              <Text
                className={`font-semibold text-sm ${
                  isActive ? "text-white" : "text-[#8C8E9C]"
                }`}
              >
                {tab.label}
              </Text>
              {tab.badge ? (
                <View
                  className="h-[18px] min-w-[18px] items-center justify-center rounded-full px-1"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <Text className="font-semibold text-[9px] text-white">
                    {tab.badge}
                  </Text>
                </View>
              ) : null}
            </View>
            {isActive ? (
              <View
                className="absolute right-0 -bottom-px left-0 h-0.5 rounded-full"
                style={{ backgroundColor: COLORS.primary }}
              />
            ) : null}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
