import type { ImageSourcePropType } from "react-native"

export type CreatorShow = {
  id: string
  title: string
  genre: string
  seasons: number
  image: ImageSourcePropType
}

export type Creator = {
  id: string
  name: string
  initials: string
  verified: boolean
  tagline: string
  bio: string
  basedIn: string
  founded: string
  catalogCount: number
  seriesCount: number
  moviesCount: number
  episodeCount: number
  shows: CreatorShow[]
}

export type MovieContent = {
  title: string
  description: string
  genres: string[]
  creatorId: string
  thumbnail: ImageSourcePropType
  sheetTitle: string
  sheetDescription: string
}

export const CREATORS: Record<string, Creator> = {
  afristream: {
    id: "afristream",
    name: "AfriStream",
    initials: "A",
    verified: true,
    tagline: "Stories from every corner of the continent.",
    bio: "AfriStream produces breezy comedies, soulful romances and bright slice-of-life series shot across Lagos, Accra and Nairobi.",
    basedIn: "Lagos, Nigeria",
    founded: "2019",
    catalogCount: 7,
    seriesCount: 6,
    moviesCount: 1,
    episodeCount: 98,
    shows: [
      {
        id: "palm-wine-days",
        title: "Palm Wine Days",
        genre: "Romance",
        seasons: 2,
        image: require("../../../assets/images/palm-wine-movie.png"),
      },
      {
        id: "lagos-glamour",
        title: "Lagos Glamour",
        genre: "Drama",
        seasons: 1,
        image: require("../../../assets/images/movie-2.png"),
      },
      {
        id: "lagos-after-dark",
        title: "Lagos After Dark",
        genre: "Thriller",
        seasons: 2,
        image: require("../../../assets/images/movie-3.png"),
      },
      {
        id: "dakar-sunsets",
        title: "Dakar Sunsets",
        genre: "Animation",
        seasons: 2,
        image: require("../../../assets/images/movie-1.png"),
      },
      {
        id: "golden-coast",
        title: "Golden Coast",
        genre: "Romance",
        seasons: 1,
        image: require("../../../assets/images/movie-4.png"),
      },
      {
        id: "the-returnees",
        title: "The Returnees",
        genre: "Drama",
        seasons: 1,
        image: require("../../../assets/images/onboarding.png"),
      },
    ],
  },
  "sable-studios": {
    id: "sable-studios",
    name: "Sable Studios",
    initials: "S",
    verified: true,
    tagline: "Original stories, boldly told.",
    bio: "Sable Studios crafts premium originals and limited series celebrating African voices, from Lagos rooftops to Accra coastlines.",
    basedIn: "Accra, Ghana",
    founded: "2021",
    catalogCount: 4,
    seriesCount: 3,
    moviesCount: 1,
    episodeCount: 42,
    shows: [
      {
        id: "blood-and-soil",
        title: "Blood & Soil",
        genre: "Drama",
        seasons: 1,
        image: require("../../../assets/images/movie-2.png"),
      },
      {
        id: "the-kingdom-falls",
        title: "The Kingdom Falls",
        genre: "Epic",
        seasons: 2,
        image: require("../../../assets/images/palm-wine-movie.png"),
      },
      {
        id: "street-legends",
        title: "Street Legends",
        genre: "Action",
        seasons: 1,
        image: require("../../../assets/images/movie-1.png"),
      },
    ],
  },
}

const DEFAULT_MOVIE: MovieContent = {
  title: "Dakar Sunsets",
  description:
    "An animated adventure following a crew of young African astronauts exploring uncharted galaxies, blending...",
  genres: ["Nollywood", "Romance"],
  creatorId: "afristream",
  thumbnail: require("../../../assets/images/palm-wine-movie.png"),
  sheetTitle: "Golden Coast",
  sheetDescription: "Three best friends navigate love,...",
}

const MOVIE_CONTENT: Record<string, Partial<MovieContent>> = {
  "1": {
    title: "Dakar Sunsets",
    genres: ["Nollywood", "Romance"],
    creatorId: "afristream",
  },
  "palm-wine-days": {
    title: "Palm Wine Days",
    description:
      "A love story set against the golden coastlines of West Africa, where two souls reconnect over palm wine and old memories.",
    genres: ["Nollywood", "Romance"],
    creatorId: "afristream",
    thumbnail: require("../../../assets/images/palm-wine-movie.png"),
    sheetTitle: "Palm Wine Days",
    sheetDescription: "Two souls reconnect over palm wine and old memories.",
  },
  "blood-and-soil": {
    title: "Blood & Soil",
    description:
      "When farmland turns to battleground, one boy's quiet courage becomes the spark a community needs.",
    genres: ["Drama", "Sable Original"],
    creatorId: "sable-studios",
    thumbnail: require("../../../assets/images/movie-2.png"),
    sheetTitle: "Blood & Soil",
    sheetDescription: "One boy's courage becomes a community's spark.",
  },
  "the-kingdom-falls": {
    title: "The Kingdom Falls",
    description:
      "An epic saga of power, betrayal, and redemption across a crumbling dynasty.",
    genres: ["Epic", "Drama"],
    creatorId: "sable-studios",
    thumbnail: require("../../../assets/images/palm-wine-movie.png"),
    sheetTitle: "The Kingdom Falls",
    sheetDescription: "Power, betrayal, and redemption.",
  },
  "lagos-after-dark": {
    title: "Lagos After Dark",
    description:
      "When the city sleeps, secrets wake — a thriller woven through Lagos nightlife.",
    genres: ["Thriller", "Drama"],
    creatorId: "afristream",
    thumbnail: require("../../../assets/images/movie-3.png"),
    sheetTitle: "Lagos After Dark",
    sheetDescription: "Secrets wake when the city sleeps.",
  },
  "savanna-rising": {
    title: "Savanna Rising",
    description:
      "A sci-fi odyssey across the savanna, rendered frame by frame with generative cinema.",
    genres: ["Sci-Fi", "AI Film"],
    creatorId: "afristream",
    thumbnail: require("../../../assets/images/onboarding.png"),
    sheetTitle: "Savanna Rising",
    sheetDescription: "A sci-fi odyssey across the savanna.",
  },
}

export function getMovieContent(movieId: string | undefined): MovieContent {
  const overrides = movieId ? MOVIE_CONTENT[movieId] : undefined
  return { ...DEFAULT_MOVIE, ...overrides }
}

export function getCreator(creatorId: string): Creator | undefined {
  return CREATORS[creatorId]
}

export function getCreatorForMovie(movieId: string | undefined): Creator {
  const content = getMovieContent(movieId)
  return CREATORS[content.creatorId] ?? CREATORS.afristream
}
