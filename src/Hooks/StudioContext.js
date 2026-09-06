import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthContext'

const StudioContext = createContext(null)
const STORAGE_KEY = 'yt_clone_studio'
const SAMPLE_MP4 =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

const sessionBlobs = new Map()

function readStore() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      channels: Array.isArray(raw.channels) ? raw.channels : [],
      videos: Array.isArray(raw.videos) ? raw.videos : [],
    }
  } catch {
    return { channels: [], videos: [] }
  }
}

function writeStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

function slugHandle(value) {
  return `@${String(value || 'channel')
    .replace(/^@/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 22) || 'channel'}`
}

function uid(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}

export function studioVideoToSearchItem(v) {
  if (!v?.videoId) return null
  const thumb = v.thumbnail || '/favicon.ico'
  return {
    kind: 'youtube#searchResult',
    id: { kind: 'youtube#video', videoId: v.videoId },
    snippet: {
      publishedAt: v.publishedAt,
      channelId: v.channelId,
      title: v.title,
      description: v.description || '',
      thumbnails: {
        default: { url: thumb },
        medium: { url: thumb },
        high: { url: thumb },
      },
      channelTitle: v.channelTitle,
      publishTime: v.publishedAt,
    },
    statistics: {
      viewCount: String(v.views || 0),
      likeCount: String(v.likes || 0),
      commentCount: '0',
    },
    contentDetails: { duration: v.durationIso || 'PT0S' },
    meta: {
      videoId: v.videoId,
      views: v.views || 0,
      duration: v.durationLabel || '',
      channelAvatar: v.channelAvatar,
      localVideoUrl: getStudioPlaybackUrl(v),
      isStudio: true,
    },
  }
}

export function studioVideoToDetails(v) {
  const item = studioVideoToSearchItem(v)
  if (!item) return { kind: 'youtube#videoListResponse', items: [] }
  return {
    kind: 'youtube#videoListResponse',
    items: [
      {
        kind: 'youtube#video',
        id: v.videoId,
        snippet: {
          ...item.snippet,
          description: v.description || `${v.title} — uploaded on YouTubeClone.`,
        },
        statistics: item.statistics,
        meta: item.meta,
      },
    ],
  }
}

export function studioChannelToYt(ch, videos = []) {
  const avatar = ch.avatar || '/favicon.ico'
  const viewCount = videos.reduce((sum, v) => sum + Number(v.views || 0), 0)
  return {
    id: ch.id,
    snippet: {
      title: ch.title,
      customUrl: ch.handle,
      description: ch.description || `Welcome to ${ch.title}.`,
      publishedAt: ch.createdAt,
      country: 'PK',
      thumbnails: {
        high: { url: avatar },
        medium: { url: avatar },
        default: { url: avatar },
      },
    },
    statistics: {
      subscriberCount: String(ch.subscribers || 0),
      videoCount: String(videos.length),
      viewCount: String(viewCount),
    },
    brandingSettings: {
      channel: { title: ch.title, country: 'PK' },
      image: {
        bannerExternalUrl:
          ch.banner ||
          `https://picsum.photos/seed/${encodeURIComponent(ch.id)}/1280/220`,
      },
    },
  }
}

export function getStudioPlaybackUrl(v) {
  if (!v) return SAMPLE_MP4
  return sessionBlobs.get(v.videoId) || v.videoUrl || SAMPLE_MP4
}

export const StudioProvider = ({ children }) => {
  const { user, isSignedIn, openSignIn } = useAuth()
  const userKey = user?.handle || user?.email || null
  const [store, setStore] = useState(readStore)

  useEffect(() => {
    setStore(readStore())
  }, [userKey])

  const persist = useCallback((next) => {
    writeStore(next)
    setStore(next)
    return next
  }, [])

  const channels = store.channels
  const videos = store.videos

  const getChannel = useCallback(
    (channelId) => channels.find((c) => c.id === channelId) || null,
    [channels]
  )

  const getMyChannel = useCallback(() => {
    if (!userKey) return null
    return channels.find((c) => c.ownerHandle === userKey) || null
  }, [channels, userKey])

  const getVideo = useCallback(
    (videoId) => videos.find((v) => v.videoId === videoId) || null,
    [videos]
  )

  const getVideosByChannel = useCallback(
    (channelId) => videos.filter((v) => v.channelId === channelId),
    [videos]
  )

  const myVideos = useMemo(() => {
    const mine = getMyChannel()
    if (!mine) return []
    return videos.filter((v) => v.channelId === mine.id)
  }, [videos, getMyChannel])

  const createChannel = useCallback(
    ({ title, handle, description, avatar }) => {
      if (!isSignedIn || !userKey) {
        openSignIn()
        return { ok: false, reason: 'auth' }
      }
      const name = String(title || '').trim()
      if (!name) return { ok: false, reason: 'empty' }
      const nextHandle = slugHandle(handle || name)
      const existing = channels.find((c) => c.ownerHandle === userKey)
      const channel = {
        id: existing?.id || uid('uc_'),
        title: name,
        handle: nextHandle,
        description: String(description || '').trim(),
        avatar:
          avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff0000&color=fff`,
        banner: existing?.banner || '',
        ownerHandle: userKey,
        subscribers: existing?.subscribers || 0,
        createdAt: existing?.createdAt || new Date().toISOString(),
      }
      const nextChannels = existing
        ? channels.map((c) => (c.id === existing.id ? channel : c))
        : [channel, ...channels]
      persist({ ...store, channels: nextChannels })
      return { ok: true, channel, updated: Boolean(existing) }
    },
    [channels, isSignedIn, openSignIn, persist, store, userKey]
  )

  const uploadVideo = useCallback(
    ({ title, description, thumbnail, file }) => {
      if (!isSignedIn || !userKey) {
        openSignIn()
        return { ok: false, reason: 'auth' }
      }
      const channel = channels.find((c) => c.ownerHandle === userKey)
      if (!channel) return { ok: false, reason: 'channel' }
      const name = String(title || '').trim()
      if (!name) return { ok: false, reason: 'empty' }

      const videoId = uid('ucv_')
      let videoUrl = SAMPLE_MP4
      if (file instanceof Blob) {
        const blobUrl = URL.createObjectURL(file)
        sessionBlobs.set(videoId, blobUrl)
        videoUrl = blobUrl
      }

      const video = {
        videoId,
        title: name,
        description: String(description || '').trim(),
        thumbnail:
          thumbnail ||
          `https://picsum.photos/seed/${encodeURIComponent(videoId)}/640/360`,
        videoUrl,
        channelId: channel.id,
        channelTitle: channel.title,
        channelAvatar: channel.avatar,
        publishedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        durationLabel: file?.durationLabel || '',
        durationIso: 'PT0S',
      }
      persist({ ...store, videos: [video, ...videos] })
      return { ok: true, video }
    },
    [channels, isSignedIn, openSignIn, persist, store, userKey, videos]
  )

  const value = useMemo(
    () => ({
      channels,
      videos,
      myVideos,
      getChannel,
      getMyChannel,
      getVideo,
      getVideosByChannel,
      createChannel,
      uploadVideo,
    }),
    [
      channels,
      videos,
      myVideos,
      getChannel,
      getMyChannel,
      getVideo,
      getVideosByChannel,
      createChannel,
      uploadVideo,
    ]
  )

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
}

export const useStudio = () => {
  const ctx = useContext(StudioContext)
  if (!ctx) throw new Error('useStudio must be used within StudioProvider')
  return ctx
}
