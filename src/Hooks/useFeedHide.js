import { useCallback, useEffect, useState } from 'react'

const VIDEO_KEY = 'yt_clone_hidden_videos'
const CHANNEL_KEY = 'yt_clone_hidden_channels'

function readList(key) {
  try {
    const list = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(list) ? list.filter(Boolean) : []
  } catch {
    return []
  }
}

function writeList(key, list) {
  localStorage.setItem(key, JSON.stringify([...new Set(list)].slice(0, 400)))
}

export function useFeedHide() {
  const [hiddenVideos, setHiddenVideos] = useState(() => readList(VIDEO_KEY))
  const [hiddenChannels, setHiddenChannels] = useState(() => readList(CHANNEL_KEY))

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === VIDEO_KEY) setHiddenVideos(readList(VIDEO_KEY))
      if (e.key === CHANNEL_KEY) setHiddenChannels(readList(CHANNEL_KEY))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const hideVideo = useCallback((videoId) => {
    if (!videoId) return
    setHiddenVideos((prev) => {
      const next = [...new Set([videoId, ...prev])]
      writeList(VIDEO_KEY, next)
      return next
    })
  }, [])

  const hideChannel = useCallback((channelId) => {
    if (!channelId) return
    setHiddenChannels((prev) => {
      const next = [...new Set([channelId, ...prev])]
      writeList(CHANNEL_KEY, next)
      return next
    })
  }, [])

  const isHiddenItem = useCallback(
    (item) => {
      const videoId =
        item?.id?.videoId ||
        (typeof item?.id === 'string' ? item.id : null) ||
        item?.meta?.videoId
      const channelId = item?.snippet?.channelId
      if (videoId && hiddenVideos.includes(videoId)) return true
      if (channelId && hiddenChannels.includes(channelId)) return true
      return false
    },
    [hiddenVideos, hiddenChannels]
  )

  return { hiddenVideos, hiddenChannels, hideVideo, hideChannel, isHiddenItem }
}
