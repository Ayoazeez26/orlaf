import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"
import { PlayerControls } from "../../../../components/player-controls"
import { EpisodePickerSheet } from "../../../../features/player/components/episode-picker-sheet"
import { PlayerInfoBar } from "../../../../features/player/components/player-info-bar"
import { PlayerTransportControls } from "../../../../features/player/components/player-transport-controls"
import { PlayerVideoSurface } from "../../../../features/player/components/player-video-surface"
import { DEFAULT_POSTER } from "../../../../features/player/constants"
import { useEpisodeAutoplay } from "../../../../features/player/hooks/use-episode-autoplay"
import { useEpisodePicker } from "../../../../features/player/hooks/use-episode-picker"
import { usePlaybackScrubbing } from "../../../../features/player/hooks/use-playback-scrubbing"
import { usePlayerChrome } from "../../../../features/player/hooks/use-player-chrome"
import { usePlayerSettings } from "../../../../features/player/hooks/use-player-settings"
import { useSeriesPlayerData } from "../../../../features/player/hooks/use-series-player-data"
import { useVideoPlayback } from "../../../../features/player/hooks/use-video-playback"
import { SEEK_STEP_SECONDS } from "../../../../features/player/types/player-settings"
import { useRequireAuth } from "../../../../hooks/use-require-auth"
import { useToggleWatchlist } from "../../../../hooks/use-watchlist"

export default function PlayerScreen() {
  const { id: seriesId, returnTo } = useLocalSearchParams<{
    id: string
    returnTo?: string
  }>()

  const requireAuth = useRequireAuth()
  const { isSaved, toggle: toggleWatchlist } = useToggleWatchlist(
    seriesId ?? ""
  )

  const {
    series,
    seriesLoading,
    episodes,
    selectedEpisodeId,
    setSelectedEpisodeId,
    selectedEpisode,
    selectedEpisodeIndex,
    episodeLoading,
    playbackUrl,
    posterSource,
    freeEpisodeCount,
  } = useSeriesPlayerData(seriesId ?? "")

  const playback = useVideoPlayback({
    url: playbackUrl,
    loop: false,
    metadata: series
      ? {
          title: selectedEpisode?.title ?? series.title,
          artist:
            series.creator.creatorProfile?.studioName ??
            series.creator.displayName ??
            undefined,
          artwork: series.posterUrl ?? undefined,
        }
      : undefined,
  })

  const playerSettings = usePlayerSettings({ player: playback.player })

  const chrome = usePlayerChrome({
    isPlaying: playback.isPlaying,
    onResume: playback.play,
    onPause: playback.pause,
    onUnlockedEpisode: setSelectedEpisodeId,
  })

  const picker = useEpisodePicker({
    episodes,
    selectedEpisodeId,
    onSelectEpisode: setSelectedEpisodeId,
    onPausePlayback: playback.pause,
    onPlaybackEndedAtGate: playback.rewindFromEnd,
  })

  useEpisodeAutoplay({
    player: playback.player,
    selectedEpisodeId,
    onEpisodeEnded: picker.advanceFromEpisode,
  })

  const scrubbing = usePlaybackScrubbing({
    isPlaying: playback.isPlaying,
    onPause: playback.pause,
    onPlay: chrome.play,
  })

  const handleBack = () => {
    chrome.pauseOnBlur()
    if (returnTo) {
      router.navigate(returnTo as `/dashboard/${string}`)
      return
    }
    router.back()
  }

  if (seriesLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#fff" />
      </View>
    )
  }

  if (!series) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-8">
        <Text className="text-center text-sm text-white/60">
          This series is unavailable right now.
        </Text>
        <TouchableOpacity onPress={handleBack} className="mt-4">
          <Text className="text-purple-400">Go back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-black">
      <PlayerVideoSurface
        player={playback.player}
        posterSource={posterSource ?? DEFAULT_POSTER}
        thumbnailVisible={playback.thumbnailVisible}
        isBuffering={playback.isBuffering}
        isSwitchingSource={playback.isSwitchingSource}
        error={playback.error}
        onFirstFrame={playback.onFirstFrame}
        onRetry={playback.retry}
        onBack={handleBack}
      />

      {!playback.error && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={chrome.onScreenTap}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 280,
            zIndex: 5,
          }}
        />
      )}

      <TouchableOpacity
        onPress={handleBack}
        style={{ zIndex: 25 }}
        className="absolute top-14 left-5 h-9 w-9 items-center justify-center rounded-full bg-black/50"
      >
        <Ionicons name="arrow-back" size={20} color="#fff" />
      </TouchableOpacity>

      <PlayerTransportControls
        isPlaying={playback.isPlaying}
        visible={
          !playback.error &&
          !playback.isBuffering &&
          (!playback.isPlaying || chrome.controlsVisible)
        }
        onPlay={chrome.play}
        onPause={chrome.pause}
        onSeekBackward={() => playerSettings.seekBackward(SEEK_STEP_SECONDS)}
        onSeekForward={() => playerSettings.seekForward(SEEK_STEP_SECONDS)}
      />

      {!playback.error && (
        <PlayerControls
          menuItems={playerSettings.menuItems}
          getSelectedValue={playerSettings.getSelectedValue}
          onMenuSelect={playerSettings.handleMenuSelect}
          saved={isSaved}
          onSave={() => requireAuth(toggleWatchlist)}
          onShare={() => console.log("share")}
          onDetails={picker.openEpisodes}
        />
      )}

      {!playback.error && (
        <PlayerInfoBar
          series={series}
          selectedEpisode={selectedEpisode}
          selectedEpisodeIndex={selectedEpisodeIndex}
          episodeCount={episodes.length}
          currentTime={playback.currentTime}
          duration={playback.duration}
          onOpenEpisodes={picker.openEpisodes}
          onSeek={playerSettings.seekTo}
          onScrubStart={scrubbing.onScrubStart}
          onScrubEnd={scrubbing.onScrubEnd}
        />
      )}

      <EpisodePickerSheet
        sheetRef={picker.sheetRef}
        sheetView={picker.sheetView}
        series={series}
        episodes={episodes}
        posterSource={posterSource ?? DEFAULT_POSTER}
        freeEpisodeCount={freeEpisodeCount}
        selectedEpisodeId={picker.selectedEpisodeId}
        episodeLoading={episodeLoading}
        premiumEpisodeNumber={picker.premiumEpisodeNumber}
        isEpisodeUnlocked={picker.isEpisodeUnlocked}
        onClose={picker.closeSheet}
        onShowEpisodes={() => picker.setSheetView("episodes")}
        onEpisodePress={picker.handleEpisodePress}
        onWatchAd={picker.watchAd}
        onBuyCoins={picker.buyCoins}
      />
    </View>
  )
}
