import { Image, type ImageStyle, type StyleProp } from "react-native"

type VerifiedBadgeProps = {
  size?: number
  style?: StyleProp<ImageStyle>
}

export function VerifiedBadge({ size = 28, style }: VerifiedBadgeProps) {
  return (
    <Image
      source={require("../../../../assets/images/creator-verified-badge.png")}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
      accessibilityLabel="Verified creator"
    />
  )
}
