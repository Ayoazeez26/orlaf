import type { ReactNode } from "react"
import {
  Image,
  type ImageSourcePropType,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native"

/** Figma drop shadow: spread 1, blur 0, #FE9A00 @ 20% */
export const MOVIE_POSTER_GLOW_COLOR = "rgba(254, 154, 0, 0.2)"

export function moviePosterGlowStyle(borderRadius: number): {
  outer: ViewStyle
  inner: ViewStyle
} {
  return {
    outer: {
      borderRadius,
      padding: 1,
      backgroundColor: MOVIE_POSTER_GLOW_COLOR,
    },
    inner: {
      borderRadius: Math.max(0, borderRadius - 1),
      overflow: "hidden",
    },
  }
}

type MoviePosterProps = {
  source: ImageSourcePropType
  className?: string
  style?: StyleProp<ViewStyle>
  borderRadius?: number
  overlay?: ReactNode
}

export function MoviePoster({
  source,
  className,
  style,
  borderRadius = 14,
  overlay,
}: MoviePosterProps) {
  const glow = moviePosterGlowStyle(borderRadius)

  return (
    <View className={className} style={[glow.outer, style]}>
      <View className="relative flex-1" style={glow.inner}>
        <Image
          source={source}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        {overlay}
      </View>
    </View>
  )
}
