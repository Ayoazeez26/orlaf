import type { AvailableSeries, DiscoveryRail } from "../types"

export const MOCK_RAILS: DiscoveryRail[] = [
  {
    id: "featured-hero",
    title: "Featured hero",
    surface: "home",
    type: "hero",
    status: "live",
    audience: "all-users",
    position: 1,
    isVisible: true,
    items: [
      {
        id: "the-returnees",
        title: "The Returnees",
        genre: "Romance / Drama",
        episodeCount: 12,
      },
      {
        id: "zulu-dawn",
        title: "Zulu Dawn",
        genre: "Drama",
        episodeCount: 8,
      },
      {
        id: "the-next-chapter",
        title: "The Next Chapter",
        genre: "Drama",
        episodeCount: 10,
      },
    ],
  },
  {
    id: "new-creators-spotlight-home",
    title: "New creators spotlight",
    surface: "home",
    type: "rail",
    status: "draft",
    audience: "new-users",
    position: 2,
    isVisible: true,
    items: [
      {
        id: "urban-tales",
        title: "Urban Tales",
        genre: "Anthology",
        episodeCount: 6,
      },
      {
        id: "palmwine-days",
        title: "Palmwine Days",
        genre: "Drama",
        episodeCount: 12,
      },
    ],
  },
  {
    id: "old-nollywood",
    title: "Old Nollywood",
    surface: "home",
    type: "rail",
    status: "live",
    audience: "all-users",
    position: 3,
    isVisible: true,
    items: [
      {
        id: "jollof-wars",
        title: "Jollof Wars",
        genre: "Comedy",
        episodeCount: 4,
      },
      {
        id: "palmwine-days",
        title: "Palmwine Days",
        genre: "Drama",
        episodeCount: 12,
      },
      {
        id: "urban-tales",
        title: "Urban Tales",
        genre: "Anthology",
        episodeCount: 6,
      },
    ],
  },
  {
    id: "for-you-queue",
    title: "For You queue",
    surface: "for-you",
    type: "rail",
    status: "live",
    audience: "all-users",
    position: 1,
    isVisible: true,
    items: [
      {
        id: "the-returnees",
        title: "The Returnees",
        genre: "Romance / Drama",
        episodeCount: 12,
      },
      {
        id: "jollof-wars",
        title: "Jollof Wars",
        genre: "Comedy",
        episodeCount: 4,
      },
      {
        id: "zulu-dawn",
        title: "Zulu Dawn",
        genre: "Drama",
        episodeCount: 8,
      },
      {
        id: "urban-tales",
        title: "Urban Tales",
        genre: "Anthology",
        episodeCount: 6,
      },
      {
        id: "the-next-chapter",
        title: "The Next Chapter",
        genre: "Drama",
        episodeCount: 10,
      },
    ],
  },
  {
    id: "new-creators-spotlight-fy",
    title: "New creators spotlight",
    surface: "for-you",
    type: "rail",
    status: "draft",
    audience: "new-users",
    position: 2,
    isVisible: false,
    items: [
      {
        id: "urban-tales",
        title: "Urban Tales",
        genre: "Anthology",
        episodeCount: 6,
      },
      {
        id: "palmwine-days",
        title: "Palmwine Days",
        genre: "Drama",
        episodeCount: 12,
      },
    ],
  },
]

export const AVAILABLE_SERIES: AvailableSeries[] = [
  {
    id: "jollof-wars",
    title: "Jollof Wars",
    genre: "Comedy",
    episodeCount: 4,
  },
  {
    id: "palmwine-days",
    title: "Palmwine Days",
    genre: "Drama",
    episodeCount: 12,
  },
  {
    id: "urban-tales",
    title: "Urban Tales",
    genre: "Anthology",
    episodeCount: 6,
  },
  {
    id: "the-returnees",
    title: "The Returnees",
    genre: "Romance / Drama",
    episodeCount: 12,
  },
  {
    id: "zulu-dawn",
    title: "Zulu Dawn",
    genre: "Drama",
    episodeCount: 8,
  },
  {
    id: "the-next-chapter",
    title: "The Next Chapter",
    genre: "Drama",
    episodeCount: 10,
  },
]
