import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import {
  type PublicSeriesFilters,
  useSearchGenres,
  useSearchResults,
} from "../../hooks/use-search"
import type { PublicSeries } from "../../services/catalog-api"

const SCREEN_WIDTH = Dimensions.get("window").width
const GRID_GAP = 12
const GRID_PADDING = 32
const POSTER_WIDTH = (SCREEN_WIDTH - GRID_PADDING - GRID_GAP) / 2
const ALL_GENRES_LABEL = "All"

function formatSeriesMeta(series: PublicSeries) {
  const genre = series.genres[0]
  const episodes = series._count.episodes
  const episodeLabel =
    series.type === "short_film"
      ? "Film"
      : episodes === 1
        ? "1 ep"
        : `${episodes} ep`

  return [genre, episodeLabel].filter(Boolean).join(" · ")
}

export default function SearchScreen() {
  const inputRef = useRef<TextInput>(null)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [activeGenre, setActiveGenre] = useState(ALL_GENRES_LABEL)

  const {
    data: genres = [],
    isLoading: genresLoading,
    isError: genresError,
  } = useSearchGenres()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const seriesFilters = useMemo<PublicSeriesFilters>(
    () => ({
      ...(debouncedQuery ? { q: debouncedQuery } : {}),
      ...(activeGenre !== ALL_GENRES_LABEL ? { genre: activeGenre } : {}),
    }),
    [activeGenre, debouncedQuery]
  )

  const {
    data: results = [],
    isLoading: resultsLoading,
    isFetching: resultsFetching,
    isError: resultsError,
  } = useSearchResults(seriesFilters)

  const genreChips = useMemo(
    () => [ALL_GENRES_LABEL, ...genres.map((genre) => genre.name)],
    [genres]
  )

  const trimmedQuery = query.trim()
  const showInitialLoader = resultsLoading && results.length === 0
  const showResultsLoader =
    showInitialLoader || (resultsFetching && !results.length)

  const clearQuery = () => {
    setQuery("")
    inputRef.current?.focus()
  }

  return (
    <View className="flex-1 bg-[#0a0a0f] px-4 pt-14">
      <View className="mb-4 flex-row items-center gap-3">
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          className="h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a1a2e]"
        >
          <Ionicons name="arrow-back" size={16} color="#ccc" />
        </TouchableOpacity>

        <View className="min-w-0 flex-1 flex-row items-center gap-2 rounded-full bg-[#1a1a2e] px-4 py-2.5">
          <Ionicons name="search-outline" size={16} color="#888" />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            placeholder="Search titles, genres..."
            placeholderTextColor="#555"
            className="min-w-0 flex-1 text-sm text-white"
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={clearQuery}
              accessibilityLabel="Clear search"
              className="h-6 w-6 items-center justify-center rounded-full bg-[#2a2a3e]"
            >
              <Ionicons name="close" size={14} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="mb-4 shrink-0">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ gap: 8, alignItems: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          {genresLoading ? (
            <View className="px-2 py-2">
              <ActivityIndicator color="#7C3AED" size="small" />
            </View>
          ) : genresError ? (
            <Text className="px-2 text-gray-500 text-sm">
              Could not load genres
            </Text>
          ) : (
            genreChips.map((genre) => {
              const isSelected = activeGenre === genre
              return (
                <TouchableOpacity
                  key={genre}
                  onPress={() => setActiveGenre(genre)}
                  activeOpacity={0.7}
                  className={`rounded-lg border px-4 py-2 ${
                    isSelected
                      ? "border-white bg-white"
                      : "border-[#2E2E2E] bg-transparent"
                  }`}
                  style={{ alignSelf: "center" }}
                >
                  <Text
                    className={`font-medium text-sm leading-none ${
                      isSelected ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {genre}
                  </Text>
                </TouchableOpacity>
              )
            })
          )}
        </ScrollView>
      </View>

      {trimmedQuery.length > 0 && !showResultsLoader && !resultsError && (
        <View className="mb-4 shrink-0">
          <Text className="text-gray-500 text-sm">
            <Text className="font-semibold text-white">{results.length}</Text>
            <Text className="text-gray-500"> results for </Text>
            <Text className="font-semibold text-white">
              &apos;{trimmedQuery}&apos;
            </Text>
          </Text>
        </View>
      )}

      {showResultsLoader ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#7C3AED" />
        </View>
      ) : resultsError ? (
        <View className="flex-1 items-center justify-center gap-3 py-20">
          <Ionicons name="alert-circle-outline" size={40} color="#333" />
          <Text className="text-gray-600 text-sm">
            Could not load search results
          </Text>
        </View>
      ) : (
        <FlatList
          className="flex-1"
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          columnWrapperStyle={{ gap: GRID_GAP }}
          contentContainerStyle={{ gap: GRID_GAP, paddingBottom: 80 }}
          ListEmptyComponent={
            <View className="items-center justify-center gap-3 py-20">
              <Ionicons name="search-outline" size={40} color="#333" />
              <Text className="text-gray-600 text-sm">No results found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/dashboard/movie/player/${item.id}`)}
              activeOpacity={0.85}
              style={{ width: POSTER_WIDTH }}
            >
              <View
                className="mb-2.5 overflow-hidden rounded-2xl bg-[#1a1a2e]"
                style={{
                  width: POSTER_WIDTH,
                  height: POSTER_WIDTH * 1.45,
                }}
              >
                {item.posterUrl ? (
                  <Image
                    source={{ uri: item.posterUrl }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : null}
              </View>
              <Text
                className="mb-0.5 font-semibold text-sm text-white"
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <Text className="text-gray-500 text-xs" numberOfLines={1}>
                {formatSeriesMeta(item)}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  )
}
