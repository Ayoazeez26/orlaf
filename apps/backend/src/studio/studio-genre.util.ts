export const seriesGenresInclude = {
  seriesGenres: {
    include: {
      genre: {
        select: { name: true, sortOrder: true },
      },
    },
  },
} as const

type SeriesWithGenreRows = {
  seriesGenres: Array<{
    genre: { name: string; sortOrder: number }
  }>
}

export function mapSeriesGenres<T extends SeriesWithGenreRows>(
  series: T
): Omit<T, "seriesGenres"> & { genres: string[] } {
  const { seriesGenres, ...rest } = series
  const genres = seriesGenres
    .slice()
    .sort((a, b) => a.genre.sortOrder - b.genre.sortOrder)
    .map((row) => row.genre.name)

  return { ...rest, genres }
}

export function mapManySeriesGenres<T extends SeriesWithGenreRows>(
  seriesList: T[]
): Array<Omit<T, "seriesGenres"> & { genres: string[] }> {
  return seriesList.map(mapSeriesGenres)
}
