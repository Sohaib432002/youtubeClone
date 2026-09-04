import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthContext'

const WatchLaterContext = createContext(null)
const STORAGE_KEY = 'yt_clone_watch_later_by_user'

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

function normalizeEntry(entry) {
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
    savedAt: entry.savedAt || new Date().toISOString(),
  }
}

export const WatchLaterProvider = ({ children }) => {
  const { user, isSignedIn, openSignIn } = useAuth()
  const userKey = user?.handle || user?.email || null
  const [map, setMap] = useState(readAll)

  useEffect(() => {
    setMap(readAll())
  }, [userKey])

  const watchLater = useMemo(() => {
    if (!userKey) return []
    return Array.isArray(map[userKey]) ? map[userKey] : []
  }, [map, userKey])

  const isInWatchLater = useCallback(
    (videoId) => {
      if (!videoId || !userKey) return false
      return watchLater.some((v) => v.videoId === videoId)
    },
    [watchLater, userKey]
  )

  const addToWatchLater = useCallback(
    (entry) => {
      if (!entry?.videoId) return { ok: false, reason: 'invalid' }
      if (!isSignedIn || !userKey) {
        openSignIn()
        return { ok: false, reason: 'auth' }
      }
      let result = { ok: true, added: true }
      setMap((prev) => {
        const current = Array.isArray(prev[userKey]) ? prev[userKey] : []
        if (current.some((v) => v.videoId === entry.videoId)) {
          result = { ok: true, added: false, already: true }
          return prev
        }
        const next = {
          ...prev,
          [userKey]: [normalizeEntry(entry), ...current].slice(0, 200),
        }
        writeAll(next)
        return next
      })
      return result
    },
    [isSignedIn, openSignIn, userKey]
  )

  const removeFromWatchLater = useCallback(
    (videoId) => {
      if (!userKey || !videoId) return
      setMap((prev) => {
        const current = Array.isArray(prev[userKey]) ? prev[userKey] : []
        const next = {
          ...prev,
          [userKey]: current.filter((v) => v.videoId !== videoId),
        }
        writeAll(next)
        return next
      })
    },
    [userKey]
  )

  const toggleWatchLater = useCallback(
    (entry) => {
      if (!entry?.videoId) return { ok: false, reason: 'invalid' }
      if (!isSignedIn || !userKey) {
        openSignIn()
        return { ok: false, reason: 'auth' }
      }
      if (isInWatchLater(entry.videoId)) {
        removeFromWatchLater(entry.videoId)
        return { ok: true, added: false }
      }
      return addToWatchLater(entry)
    },
    [addToWatchLater, isInWatchLater, isSignedIn, openSignIn, removeFromWatchLater, userKey]
  )

  const value = useMemo(
    () => ({
      watchLater,
      isInWatchLater,
      addToWatchLater,
      removeFromWatchLater,
      toggleWatchLater,
    }),
    [watchLater, isInWatchLater, addToWatchLater, removeFromWatchLater, toggleWatchLater]
  )

  return (
    <WatchLaterContext.Provider value={value}>{children}</WatchLaterContext.Provider>
  )
}

export const useWatchLater = () => {
  const ctx = useContext(WatchLaterContext)
  if (!ctx) throw new Error('useWatchLater must be used within WatchLaterProvider')
  return ctx
}
