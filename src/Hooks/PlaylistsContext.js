import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthContext'

const PlaylistsContext = createContext(null)
const STORAGE_KEY = 'yt_clone_playlists_by_user'

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeAll(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

function uid() {
  return `pl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function normalizeVideo(entry) {
  return {
    videoId: entry.videoId,
    title: entry.title || 'Untitled',
    thumbnail:
      entry.thumbnail ||
      `https://i.ytimg.com/vi/${entry.videoId}/mqdefault.jpg`,
    channelTitle: entry.channelTitle || '',
    channelId: entry.channelId || '',
    channelLogo: entry.channelLogo || '',
    views: entry.views ?? null,
    duration: entry.duration || '',
    publishedAt: entry.publishedAt || null,
    addedAt: entry.addedAt || new Date().toISOString(),
  }
}

export const PlaylistsProvider = ({ children }) => {
  const { user, isSignedIn, openSignIn } = useAuth()
  const userKey = user?.handle || user?.email || null
  const [map, setMap] = useState(readAll)

  useEffect(() => {
    setMap(readAll())
  }, [userKey])

  const playlists = useMemo(() => {
    if (!userKey) return []
    return Array.isArray(map[userKey]) ? map[userKey] : []
  }, [map, userKey])

  const getPlaylist = useCallback(
    (playlistId) => playlists.find((p) => p.id === playlistId) || null,
    [playlists]
  )

  const isVideoInPlaylist = useCallback(
    (playlistId, videoId) => {
      const pl = getPlaylist(playlistId)
      if (!pl || !videoId) return false
      return (pl.videos || []).some((v) => v.videoId === videoId)
    },
    [getPlaylist]
  )

  const createPlaylist = useCallback(
    (name, videoEntry = null) => {
      if (!isSignedIn || !userKey) {
        openSignIn()
        return { ok: false, reason: 'auth' }
      }
      const trimmed = String(name || '').trim()
      if (!trimmed) return { ok: false, reason: 'empty' }

      const playlist = {
        id: uid(),
        name: trimmed.slice(0, 80),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        videos: videoEntry?.videoId ? [normalizeVideo(videoEntry)] : [],
      }

      setMap((prev) => {
        const current = Array.isArray(prev[userKey]) ? prev[userKey] : []
        const next = { ...prev, [userKey]: [playlist, ...current] }
        writeAll(next)
        return next
      })
      return { ok: true, playlist }
    },
    [isSignedIn, openSignIn, userKey]
  )

  const renamePlaylist = useCallback(
    (playlistId, name) => {
      if (!userKey || !playlistId) return { ok: false }
      const trimmed = String(name || '').trim()
      if (!trimmed) return { ok: false, reason: 'empty' }
      setMap((prev) => {
        const current = Array.isArray(prev[userKey]) ? prev[userKey] : []
        const next = {
          ...prev,
          [userKey]: current.map((p) =>
            p.id === playlistId
              ? { ...p, name: trimmed.slice(0, 80), updatedAt: new Date().toISOString() }
              : p
          ),
        }
        writeAll(next)
        return next
      })
      return { ok: true }
    },
    [userKey]
  )

  const deletePlaylist = useCallback(
    (playlistId) => {
      if (!userKey || !playlistId) return
      setMap((prev) => {
        const current = Array.isArray(prev[userKey]) ? prev[userKey] : []
        const next = {
          ...prev,
          [userKey]: current.filter((p) => p.id !== playlistId),
        }
        writeAll(next)
        return next
      })
    },
    [userKey]
  )

  const addVideoToPlaylist = useCallback(
    (playlistId, entry) => {
      if (!entry?.videoId || !playlistId) return { ok: false, reason: 'invalid' }
      if (!isSignedIn || !userKey) {
        openSignIn()
        return { ok: false, reason: 'auth' }
      }
      let result = { ok: true, added: true }
      setMap((prev) => {
        const current = Array.isArray(prev[userKey]) ? prev[userKey] : []
        const nextList = current.map((p) => {
          if (p.id !== playlistId) return p
          const videos = Array.isArray(p.videos) ? p.videos : []
          if (videos.some((v) => v.videoId === entry.videoId)) {
            result = { ok: true, added: false, already: true }
            return p
          }
          return {
            ...p,
            updatedAt: new Date().toISOString(),
            videos: [normalizeVideo(entry), ...videos].slice(0, 200),
          }
        })
        const next = { ...prev, [userKey]: nextList }
        writeAll(next)
        return next
      })
      return result
    },
    [isSignedIn, openSignIn, userKey]
  )

  const removeVideoFromPlaylist = useCallback(
    (playlistId, videoId) => {
      if (!userKey || !playlistId || !videoId) return
      setMap((prev) => {
        const current = Array.isArray(prev[userKey]) ? prev[userKey] : []
        const next = {
          ...prev,
          [userKey]: current.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  updatedAt: new Date().toISOString(),
                  videos: (p.videos || []).filter((v) => v.videoId !== videoId),
                }
              : p
          ),
        }
        writeAll(next)
        return next
      })
    },
    [userKey]
  )

  const value = useMemo(
    () => ({
      playlists,
      getPlaylist,
      isVideoInPlaylist,
      createPlaylist,
      renamePlaylist,
      deletePlaylist,
      addVideoToPlaylist,
      removeVideoFromPlaylist,
    }),
    [
      playlists,
      getPlaylist,
      isVideoInPlaylist,
      createPlaylist,
      renamePlaylist,
      deletePlaylist,
      addVideoToPlaylist,
      removeVideoFromPlaylist,
    ]
  )

  return (
    <PlaylistsContext.Provider value={value}>{children}</PlaylistsContext.Provider>
  )
}

export const usePlaylists = () => {
  const ctx = useContext(PlaylistsContext)
  if (!ctx) throw new Error('usePlaylists must be used within PlaylistsProvider')
  return ctx
}
