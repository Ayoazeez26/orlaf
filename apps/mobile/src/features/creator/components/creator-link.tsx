import { router } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"

type CreatorLinkProps = {
  creatorId: string
  name: string
  initials: string
  size?: "sm" | "md"
}

export function CreatorLink({
  creatorId,
  name,
  initials,
  size = "md",
}: CreatorLinkProps) {
  const isSmall = size === "sm"
  const pillSize = isSmall ? 18 : 22
  const fontSize = isSmall ? 10 : 12

  return (
    <TouchableOpacity
      onPress={() => router.push(`/dashboard/creator/${creatorId}`)}
      className="flex-row items-center gap-1.5"
      accessibilityRole="button"
      accessibilityLabel={`View ${name} profile`}
    >
      <View
        className="items-center justify-center rounded-full bg-white"
        style={{ width: pillSize, height: pillSize }}
      >
        <Text
          className="font-bold text-black"
          style={{ fontSize: isSmall ? 9 : 11 }}
        >
          {initials}
        </Text>
      </View>
      <Text className="font-medium text-white" style={{ fontSize }}>
        {name}
      </Text>
    </TouchableOpacity>
  )
}
