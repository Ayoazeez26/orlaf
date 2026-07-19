import type { ImageSourcePropType } from "react-native"

export type LibraryTabId = "watchlist" | "history" | "downloads" | "creators"

export type WatchlistItem = {
  id: string
  title: string
  subtitle: string
  image: ImageSourcePropType
}

export type HistoryItem = {
  id: string
  title: string
  subtitle: string
  image: ImageSourcePropType
  progress?: number
  completed?: boolean
}

export type DownloadItem = {
  id: string
  title: string
  episodeLabel: string
  quality: string
  image: ImageSourcePropType
  progress?: number
  completed?: boolean
  fileSize?: string
}

export type LibraryCreatorItem = {
  id: string
  creatorId: string
  name: string
  initials: string
  verified: boolean
  stats: string
  previews: ImageSourcePropType[]
}

export const LIBRARY_TABS: {
  id: LibraryTabId
  label: string
  badge?: number
}[] = [
  { id: "watchlist", label: "Watchlist" },
  { id: "history", label: "History" },
  { id: "downloads", label: "Downloads", badge: 5 },
  { id: "creators", label: "Creators" },
]

export const WATCHLIST_ITEMS: WatchlistItem[] = [
  {
    id: "desert-rose",
    title: "Desert Rose",
    subtitle: "Full Movie",
    image: require("../../../assets/images/movie-4.png"),
  },
  {
    id: "mamas-kitchen",
    title: "Mama's Kitchen",
    subtitle: "30 Episodes",
    image: require("../../../assets/images/movie-2.png"),
  },
  {
    id: "palm-wine-days",
    title: "Palm Wine Days",
    subtitle: "20 Episodes",
    image: require("../../../assets/images/palm-wine-movie.png"),
  },
  {
    id: "blood-and-soil",
    title: "Blood & Soil",
    subtitle: "16 Episodes",
    image: require("../../../assets/images/movie-3.png"),
  },
]

export const HISTORY_ITEMS: HistoryItem[] = [
  {
    id: "palm-wine-days",
    title: "Palm Wine Days",
    subtitle: "Episode 1",
    image: require("../../../assets/images/palm-wine-movie.png"),
    progress: 5,
  },
  {
    id: "blood-and-soil",
    title: "Blood & Soil",
    subtitle: "16 Episodes",
    image: require("../../../assets/images/movie-3.png"),
    progress: 12,
  },
  {
    id: "mamas-kitchen",
    title: "Mama's Kitchen",
    subtitle: "Episode 1",
    image: require("../../../assets/images/movie-2.png"),
    progress: 88,
  },
  {
    id: "desert-rose",
    title: "Desert Rose",
    subtitle: "Full Movie",
    image: require("../../../assets/images/movie-4.png"),
    completed: true,
  },
]

export const DOWNLOAD_ITEMS: DownloadItem[] = [
  {
    id: "the-kingdom-falls",
    title: "The Kingdom Falls",
    episodeLabel: "Episode 3",
    quality: "1080p",
    image: require("../../../assets/images/palm-wine-movie.png"),
    progress: 38,
  },
  {
    id: "lagos-after-dark",
    title: "Lagos After Dark",
    episodeLabel: "Episode 1",
    quality: "720p",
    image: require("../../../assets/images/movie-3.png"),
    progress: 61,
  },
  {
    id: "dakar-sunsets",
    title: "Dakar Sunsets",
    episodeLabel: "Episode 2",
    quality: "1080p",
    image: require("../../../assets/images/movie-1.png"),
    progress: 8,
  },
  {
    id: "palm-wine-days",
    title: "Palm Wine Days",
    episodeLabel: "Episode 4",
    quality: "1080p",
    image: require("../../../assets/images/palm-wine-movie.png"),
    completed: true,
    fileSize: "420 MB",
  },
  {
    id: "blood-and-soil",
    title: "Blood & Soil",
    episodeLabel: "Episode 1",
    quality: "1080p",
    image: require("../../../assets/images/movie-2.png"),
    completed: true,
    fileSize: "900 MB",
  },
]

export const LIBRARY_CREATORS: LibraryCreatorItem[] = [
  {
    id: "sable-originals",
    creatorId: "sable-studios",
    name: "Sable Originals",
    initials: "SO",
    verified: true,
    stats: "4 titles · 42 episodes",
    previews: [
      require("../../../assets/images/movie-2.png"),
      require("../../../assets/images/palm-wine-movie.png"),
      require("../../../assets/images/movie-1.png"),
    ],
  },
  {
    id: "afristream",
    creatorId: "afristream",
    name: "AfriStream",
    initials: "A",
    verified: true,
    stats: "7 titles · 98 episodes",
    previews: [
      require("../../../assets/images/palm-wine-movie.png"),
      require("../../../assets/images/movie-3.png"),
      require("../../../assets/images/movie-4.png"),
    ],
  },
]
