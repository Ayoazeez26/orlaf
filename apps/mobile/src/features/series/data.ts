import type { ImageSourcePropType } from "react-native"

export type SeriesTabId = "episodes" | "about" | "cast" | "similar"

export type SeriesEpisode = {
  id: number
  title: string
  subtitle: string
  duration: string
  locked: boolean
  image: ImageSourcePropType
}

export type CastMember = {
  id: string
  name: string
  role: string
  initials: string
}

export type CrewMember = {
  id: string
  name: string
  role: string
  initials: string
}

export type SimilarShow = {
  id: string
  title: string
  genre: string
  seasons: number
  image: ImageSourcePropType
}

export type SeriesDetail = {
  id: string
  title: string
  seasons: number
  episodes: number
  genre: string
  creatorId: string
  creatorName: string
  creatorInitials: string
  description: string
  image: ImageSourcePropType
  studio: string
  year: number
  rating: number
  ageRating: string
  language: string
  episodeList: SeriesEpisode[]
  cast: CastMember[]
  crew: CrewMember[]
  similar: SimilarShow[]
}

const PALM_WINE_EPISODES: SeriesEpisode[] = [
  {
    id: 1,
    title: "Episode 1",
    subtitle: "Free to watch",
    duration: "15m",
    locked: false,
    image: require("../../../assets/images/palm-wine-movie.png"),
  },
  {
    id: 2,
    title: "Episode 2",
    subtitle: "Free to watch",
    duration: "18m",
    locked: false,
    image: require("../../../assets/images/movie-2.png"),
  },
  {
    id: 3,
    title: "Episode 3",
    subtitle: "Free to watch",
    duration: "21m",
    locked: false,
    image: require("../../../assets/images/movie-3.png"),
  },
  {
    id: 4,
    title: "Episode 4",
    subtitle: "Unlock with coins or VIP",
    duration: "24m",
    locked: true,
    image: require("../../../assets/images/movie-4.png"),
  },
]

const SHARED_CAST: CastMember[] = [
  { id: "1", name: "Kehinde Bankole", role: "Adaeze", initials: "KB" },
  { id: "2", name: "Ramsey Nouah", role: "Emeka", initials: "RN" },
  { id: "3", name: "Genevieve Nnaji", role: "Ngozi", initials: "GN" },
  { id: "4", name: "Funke Akindele", role: "Sade", initials: "FA" },
  { id: "5", name: "Wole Ojo", role: "Tunde", initials: "WO" },
  { id: "6", name: "Bisola Aiyeola", role: "Kemi", initials: "BA" },
]

const SHARED_CREW: CrewMember[] = [
  { id: "1", name: "Kemi Adetiba", role: "Director", initials: "KA" },
  {
    id: "2",
    name: "Niyi Akinmolayan",
    role: "Director of Photography",
    initials: "NA",
  },
]

const SHARED_SIMILAR: SimilarShow[] = [
  {
    id: "lagos-glamour",
    title: "Lagos Glamour",
    genre: "Comedy",
    seasons: 1,
    image: require("../../../assets/images/movie-1.png"),
  },
  {
    id: "lagos-after-dark",
    title: "Lagos After Dark",
    genre: "Noir",
    seasons: 2,
    image: require("../../../assets/images/movie-3.png"),
  },
  {
    id: "mamas-kitchen",
    title: "Mama's Kitchen",
    genre: "Comedy",
    seasons: 4,
    image: require("../../../assets/images/movie-2.png"),
  },
  {
    id: "accra-underground",
    title: "Accra Underground",
    genre: "Drama",
    seasons: 1,
    image: require("../../../assets/images/movie-4.png"),
  },
  {
    id: "zuli-dawi",
    title: "Zuli Dawi",
    genre: "Fantasy",
    seasons: 2,
    image: require("../../../assets/images/onboarding.png"),
  },
  {
    id: "desert-rose",
    title: "Desert Rose",
    genre: "Romance",
    seasons: 1,
    image: require("../../../assets/images/movie-4.png"),
  },
]

const DEFAULT_SERIES: SeriesDetail = {
  id: "palm-wine-days",
  title: "Palm Wine Days",
  seasons: 2,
  episodes: 20,
  genre: "Romance",
  creatorId: "afristream",
  creatorName: "AfriStream",
  creatorInitials: "A",
  description:
    "A love story set against the golden coastlines of West Africa, where two souls reconnect over palm wine and old memories.",
  image: require("../../../assets/images/palm-wine-movie.png"),
  studio: "AfriStream",
  year: 2024,
  rating: 4.0,
  ageRating: "PG",
  language: "English / Pidgin",
  episodeList: PALM_WINE_EPISODES,
  cast: SHARED_CAST,
  crew: SHARED_CREW,
  similar: SHARED_SIMILAR,
}

const SERIES_DATA: Record<string, Partial<SeriesDetail>> = {
  "1": {
    id: "1",
    title: "Lagos Glamour",
    seasons: 1,
    episodes: 12,
    genre: "Comedy",
    description:
      "Three best friends navigate city life in Lagos, chasing dreams, love, and the perfect jollof.",
    image: require("../../../assets/images/movie-1.png"),
  },
  "2": {
    id: "2",
    title: "Golden Coast",
    seasons: 1,
    episodes: 8,
    genre: "Drama",
    description:
      "A sweeping romance set on the Gold Coast, where family secrets and ambition collide.",
    image: require("../../../assets/images/movie-2.png"),
  },
  "3": {
    id: "3",
    title: "Savanna Rising",
    seasons: 1,
    episodes: 6,
    genre: "Sci-Fi",
    description:
      "An epic journey across a future Africa where technology and tradition meet under neon skies.",
    image: require("../../../assets/images/onboarding.png"),
  },
  "palm-wine-days": {
    id: "palm-wine-days",
    title: "Palm Wine Days",
  },
  "lagos-glamour": {
    id: "lagos-glamour",
    title: "Lagos Glamour",
    seasons: 1,
    episodes: 12,
    genre: "Comedy",
    description:
      "Three best friends navigate city life in Lagos, chasing dreams, love, and the perfect jollof.",
    image: require("../../../assets/images/movie-1.png"),
  },
}

export const SERIES_TABS: { id: SeriesTabId; label: string }[] = [
  { id: "episodes", label: "Episodes" },
  { id: "about", label: "About" },
  { id: "cast", label: "Cast & Crew" },
  { id: "similar", label: "More like this" },
]

export function getSeriesDetail(seriesId: string | undefined): SeriesDetail {
  const overrides = seriesId ? SERIES_DATA[seriesId] : undefined
  return {
    ...DEFAULT_SERIES,
    ...overrides,
    id: overrides?.id ?? seriesId ?? DEFAULT_SERIES.id,
  }
}
