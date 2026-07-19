import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../../../constants/theme"
import {
  AboutTabContent,
  CastTabContent,
  EpisodesTabContent,
  SeriesMetaRow,
  SimilarTabContent,
} from "../../../features/series/components/series-tab-content"
import {
  getSeriesDetail,
  SERIES_TABS,
  type SeriesTabId,
} from "../../../features/series/data"

export default function SeriesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const series = getSeriesDetail(id)
  const [activeTab, setActiveTab] = useState<SeriesTabId>("episodes")
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)

  return (
    <View className="flex-1 bg-black pt-8">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="gap-3 px-5 pt-14">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-1 h-10 w-10 items-center justify-center rounded-full bg-white/10"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <View className="flex-row items-start gap-3 py-4">
            <View className="h-20 w-16 overflow-hidden rounded-xl">
              <Image
                source={series.image}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>

            <View className="min-w-0 flex-1 pt-1">
              <Text className="mb-1 font-bold text-lg text-white">
                {series.title}
              </Text>
              <Text className="mb-2 text-[#8C8E9C] text-sm">
                {series.seasons} Seasons · {series.episodes} Eps
              </Text>
              <SeriesMetaRow series={series} />
            </View>
          </View>
        </View>

        <View className="px-5 pb-4">
          <Text
            className="text-[#F8F8F8D9] text-sm leading-5"
            numberOfLines={descriptionExpanded ? undefined : 3}
          >
            {series.description}
          </Text>
          <TouchableOpacity
            onPress={() => setDescriptionExpanded((prev) => !prev)}
            className="mt-1 flex-row items-center gap-0.5 self-start"
          >
            <Text className="font-medium text-primary text-sm">Read more</Text>
            <Ionicons
              name={descriptionExpanded ? "chevron-up" : "chevron-down"}
              size={14}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        <View className="mb-4 flex-row border-white/10 border-b px-5">
          {SERIES_TABS.map((tab) => {
            const isActive = activeTab === tab.id

            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className="mr-5 pb-3"
              >
                <Text
                  className={`font-semibold text-sm ${
                    isActive ? "text-white" : "text-[#8C8E9C]"
                  }`}
                >
                  {tab.label}
                </Text>
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

        {activeTab === "episodes" ? (
          <EpisodesTabContent series={series} />
        ) : null}
        {activeTab === "about" ? <AboutTabContent series={series} /> : null}
        {activeTab === "cast" ? <CastTabContent series={series} /> : null}
        {activeTab === "similar" ? <SimilarTabContent series={series} /> : null}
      </ScrollView>
    </View>
  )
}
