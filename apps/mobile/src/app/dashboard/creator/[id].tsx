import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../../../constants/theme"
import { VerifiedBadge } from "../../../features/creator/components/verified-badge"
import { type CreatorShow, getCreator } from "../../../features/creator/data"

type ProfileTab = "shows" | "about"

function ShowGridItem({ show }: { show: CreatorShow }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/dashboard/movie/player/${show.id}`)}
      className="mb-4"
      style={{ width: "31%" }}
    >
      <View className="mb-2 aspect-2/3 overflow-hidden rounded-xl">
        <Image
          source={show.image}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
      <Text
        className="mb-0.5 font-semibold text-sm text-white"
        numberOfLines={1}
      >
        {show.title}
      </Text>
      <Text className="text-[#8C8E9C] text-xs" numberOfLines={1}>
        {show.genre} · {show.seasons} Season{show.seasons === 1 ? "" : "s"}
      </Text>
    </TouchableOpacity>
  )
}

function AboutRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between border-white/5 border-b py-4">
      <Text className="text-[#8C8E9C] text-sm">{label}</Text>
      <Text className="font-medium text-sm text-white">{value}</Text>
    </View>
  )
}

export default function CreatorProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const creator = getCreator(id ?? "")
  const [activeTab, setActiveTab] = useState<ProfileTab>("shows")
  const [isFollowing, setIsFollowing] = useState(true)

  if (!creator) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="mb-4 font-semibold text-lg text-white">
          Creator not found
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: COLORS.primary }}>Go back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-black">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header actions */}
        <View className="flex-row items-center justify-between px-5 pt-14 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log("share creator")}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
          >
            <Ionicons name="share-social-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Identity */}
        <View className="items-center px-5 pb-6">
          <View className="relative mb-4">
            <View
              className="h-24 w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Text className="font-bold text-4xl text-white">
                {creator.initials}
              </Text>
            </View>
            {creator.verified ? (
              <View className="absolute -right-1 -bottom-1">
                <VerifiedBadge size={30} />
              </View>
            ) : null}
          </View>

          <Text className="mb-2 font-bold text-white text-xl">
            {creator.name}
          </Text>
          <Text className="max-w-xs text-center text-[#8C8E9C] text-sm leading-5">
            {creator.tagline}
          </Text>
        </View>

        {/* Stats */}
        <View className="mx-5 mb-6 flex-row rounded-3xl border border-white/10 bg-[#10111A] px-2 py-3">
          {[
            { value: creator.seriesCount, label: "Series" },
            { value: creator.moviesCount, label: "Movies" },
            { value: creator.episodeCount, label: "Episodes" },
          ].map((stat, _index) => (
            <View key={stat.label} className="flex-1 items-center">
              <Text className="mb-0.5 font-bold text-base text-white">
                {stat.value}
              </Text>
              <Text className="text-[#8C8E9C] text-xs">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Follow */}
        <View className="mb-8 px-5">
          <TouchableOpacity
            onPress={() => setIsFollowing((prev) => !prev)}
            className="h-10 flex-row items-center justify-center gap-2 rounded-full border border-white/10 bg-[#10111A]"
          >
            <Ionicons
              name={isFollowing ? "notifications-off-outline" : "add-outline"}
              size={16}
              color="#fff"
            />
            <Text className="font-semibold text-sm text-white">
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="mb-4 flex-row border-white/10 border-b px-5">
          {(["shows", "about"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="mr-6 pb-3"
            >
              <Text
                className={`font-semibold text-sm capitalize ${
                  activeTab === tab ? "text-white" : "text-[#8C8E9C]"
                }`}
              >
                {tab}
              </Text>
              {activeTab === tab ? (
                <View
                  className="absolute right-0 -bottom-px left-0 h-0.5 rounded-full"
                  style={{ backgroundColor: COLORS.primary }}
                />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "shows" ? (
          <View className="flex-row flex-wrap justify-between px-5">
            {creator.shows.map((show) => (
              <ShowGridItem key={show.id} show={show} />
            ))}
          </View>
        ) : (
          <View className="px-5">
            <Text className="mb-6 text-sm text-white leading-6">
              {creator.bio}
            </Text>
            <AboutRow label="Based in" value={creator.basedIn} />
            <AboutRow label="Founded" value={creator.founded} />
            <AboutRow
              label="Catalog"
              value={`${creator.catalogCount} titles`}
            />
          </View>
        )}
      </ScrollView>
    </View>
  )
}
