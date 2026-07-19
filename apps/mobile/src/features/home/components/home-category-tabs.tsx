import { BlurView } from "expo-blur"
import { useRef } from "react"
import {
  type LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { HOME_CATEGORY_TABS, type HomeCategoryTabId } from "../constants"

type HomeCategoryTabsProps = {
  activeTab: HomeCategoryTabId
  onTabChange: (tab: HomeCategoryTabId) => void
}

export function HomeCategoryTabs({
  activeTab,
  onTabChange,
}: HomeCategoryTabsProps) {
  const scrollRef = useRef<ScrollView>(null)
  const tabOffsets = useRef<Partial<Record<HomeCategoryTabId, number>>>({})

  const scrollToTab = (tabId: HomeCategoryTabId) => {
    const offset = tabOffsets.current[tabId]
    if (offset != null) {
      scrollRef.current?.scrollTo({
        x: Math.max(0, offset - 20),
        animated: true,
      })
    }
  }

  const handleTabPress = (tabId: HomeCategoryTabId) => {
    onTabChange(tabId)
    scrollToTab(tabId)
  }

  return (
    <View className="overflow-hidden border-white/10 border-b">
      <BlurView intensity={8} tint="dark" style={StyleSheet.absoluteFill} />
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 24 }}
      >
        {HOME_CATEGORY_TABS.map((tab) => {
          const isActive = tab.id === activeTab

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => handleTabPress(tab.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              onLayout={(event: LayoutChangeEvent) => {
                tabOffsets.current[tab.id] = event.nativeEvent.layout.x
              }}
              className="pb-3"
            >
              <Text
                className={`font-semibold text-sm ${
                  isActive ? "text-white" : "text-[#8A8A8A]"
                }`}
              >
                {tab.label}
              </Text>
              {isActive ? (
                <View className="mt-2.5 h-[3px] rounded-full bg-primary" />
              ) : (
                <View className="mt-2.5 h-[3px] rounded-full bg-transparent" />
              )}
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}
