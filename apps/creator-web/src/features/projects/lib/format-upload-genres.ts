export function formatUploadGenres(genres: string[]) {
  return genres.length > 0 ? genres.join(" / ") : "Drama"
}
