import BottomSheet, {
  BottomSheetScrollView,
} from "@expo/ui/community/bottom-sheet"
import { Ionicons } from "@expo/vector-icons"
import { useRef, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import type { PlayerMenuItem } from "../features/player/types/player-settings"

type Props = {
  menuItems: PlayerMenuItem[]
  getSelectedValue: (itemId: PlayerMenuItem["id"]) => string
  onMenuSelect: (itemId: PlayerMenuItem["id"], value: string) => void
  onShare?: () => void
  onSave?: () => void
  onDetails?: () => void
  saved?: boolean
}

export function PlayerControls({
  menuItems,
  getSelectedValue,
  onMenuSelect,
  onShare,
  onSave,
  onDetails,
  saved,
}: Props) {
  const moreSheetRef = useRef<BottomSheet>(null)
  const [activeSubmenu, setActiveSubmenu] = useState<PlayerMenuItem | null>(null)

  const handleSubOptionPress = (item: PlayerMenuItem, value: string) => {
    if (item.disabled) return
    onMenuSelect(item.id, value)
    setActiveSubmenu(null)
  }

  return (
    <>
      <View className="absolute top-[25%] right-4 gap-5" style={{ zIndex: 10 }}>
        <TouchableOpacity onPress={onSave} className="items-center gap-1">
          <View className="items-center justify-center rounded-full bg-white/10 p-4">
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={22}
              color="#fff"
            />
          </View>
          <Text className="text-white text-xs">Save</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDetails} className="items-center gap-1">
          <View className="items-center justify-center rounded-full bg-white/10 p-4">
            <Ionicons name="grid" size={22} color="#fff" />
          </View>
          <Text className="text-white text-xs">Details</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onShare} className="items-center gap-1">
          <View className="items-center justify-center rounded-full bg-white/10 p-4">
            <Ionicons name="arrow-redo-outline" size={22} color="#fff" />
          </View>
          <Text className="text-white text-xs">Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => moreSheetRef.current?.snapToIndex(0)}
          className="items-center gap-1"
        >
          <View className="items-center justify-center rounded-full bg-white/10 p-4">
            <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
          </View>
          <Text className="text-white text-xs">More</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={moreSheetRef}
        index={-1}
        snapPoints={["50%", "80%"]}
        enablePanDownToClose
        onClose={() => setActiveSubmenu(null)}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#2a2a2a",
            }}
          >
            {activeSubmenu ? (
              <TouchableOpacity
                onPress={() => setActiveSubmenu(null)}
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Ionicons name="chevron-back" size={18} color="#9333ea" />
                <Text
                  style={{ color: "#9333ea", fontSize: 15, fontWeight: "600" }}
                >
                  {activeSubmenu.label}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={{ color: "white", fontSize: 15, fontWeight: "600" }}>
                More Options
              </Text>
            )}
            <TouchableOpacity onPress={() => moreSheetRef.current?.close()}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {!activeSubmenu
            ? menuItems.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => !item.disabled && setActiveSubmenu(item)}
                  disabled={item.disabled && item.options.length === 0}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    opacity: item.disabled ? 0.45 : 1,
                    borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                    borderBottomColor: "#1f1f1f",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 14,
                      flex: 1,
                    }}
                  >
                    <Ionicons name={item.icon} size={20} color="#ccc" />
                    <View className="flex-1 pr-3">
                      <Text style={{ color: "white", fontSize: 14 }}>
                        {item.label}
                      </Text>
                      {item.helperText ? (
                        <Text className="mt-1 text-[#666] text-xs">
                          {item.helperText}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Text style={{ color: "#666", fontSize: 13 }}>
                      {item.valueLabel}
                    </Text>
                    {!item.disabled && (
                      <Ionicons name="chevron-forward" size={14} color="#555" />
                    )}
                  </View>
                </TouchableOpacity>
              ))
            : activeSubmenu.options.map((option, index) => {
                const isSelected =
                  getSelectedValue(activeSubmenu.id) === option.value
                const isDisabled = option.disabled || activeSubmenu.disabled

                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleSubOptionPress(activeSubmenu, option.value)}
                    disabled={isDisabled}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingHorizontal: 16,
                      paddingVertical: 16,
                      opacity: isDisabled ? 0.45 : 1,
                      borderBottomWidth:
                        index < activeSubmenu.options.length - 1 ? 1 : 0,
                      borderBottomColor: "#1f1f1f",
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? "#9333ea" : "white",
                        fontSize: 14,
                        fontWeight: isSelected ? "600" : "400",
                      }}
                    >
                      {option.label}
                    </Text>
                    {isSelected && !isDisabled && (
                      <Ionicons name="checkmark" size={18} color="#9333ea" />
                    )}
                  </TouchableOpacity>
                )
              })}
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  )
}
