export const HOME_CATEGORY_TABS = [
  {
    id: "featured",
    label: "Featured",
    heroTitle: "Dakar Sunsets",
    heroSubtitle: "Series · 2 Seasons",
    sectionTitle: "New Releases",
  },
  {
    id: "trending",
    label: "Trending",
    heroTitle: "Street Legends",
    heroSubtitle: "Series · 1 Season",
    sectionTitle: "Trending Now",
  },
  {
    id: "new",
    label: "New",
    heroTitle: "Midnight Lagos",
    heroSubtitle: "Movie · 2h 14m",
    sectionTitle: "Just Added",
  },
  {
    id: "popular",
    label: "Popular",
    heroTitle: "Queen of Hearts",
    heroSubtitle: "Series · 3 Seasons",
    sectionTitle: "Most Watched",
  },
  {
    id: "old-nollywood",
    label: "Old Nollywood",
    heroTitle: "Living in Bondage",
    heroSubtitle: "Classic · 1992",
    sectionTitle: "Nollywood Classics",
  },
  {
    id: "ai-films",
    label: "AI Films",
    heroTitle: "Neon Dreams",
    heroSubtitle: "AI Short · 18m",
    sectionTitle: "AI Picks",
  },
  {
    id: "sable-originals",
    label: "Sable Originals",
    heroTitle: "Palm Wine Diaries",
    heroSubtitle: "Sable Original · 8 Episodes",
    sectionTitle: "From Sable",
  },
] as const

export type HomeCategoryTabId = (typeof HOME_CATEGORY_TABS)[number]["id"]
