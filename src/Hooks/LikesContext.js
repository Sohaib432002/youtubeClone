import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthContext'

const LikesContext = createContext(null)
const STORAGE_KEY = 'yt_clone_likes_by_user'
const BASE_COUNTS_KEY = 'yt_clone_video_like_bases'

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

function readBases() {
  try {
    return JSON.parse(localStorage.getItem(BASE_COUNTS_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeBases(map) {
  localStorage.setItem(BASE_COUNTS_KEY, JSON.stringify(map))
}

function toCount(value) {
  if (value == null || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : null
}

export const LikesProvider = ({ children }) => {
  const { user, isSignedIn, openSignIn } = useAuth()
  const userKey = user?.handle || user?.email || null
  const [likedMap, setLikedMap] = useState(readAll)
  const [likeBases, setLikeBases] = useState(readBases)

  useEffect(() => {
    setLikedMap(readAll())
  }, [userKey])

  const likedVideos = useMemo(() => {
    if (!userKey) return []
    return Array.isArray(likedMap[userKey]) ? likedMap[userKey] : []
  }, [likedMap, userKey])

  const isLiked = useCallback(
    (videoId) => {
      if (!videoId || !userKey) return false
      return likedVideos.some((v) => v.videoId === videoId)
    },
    [likedVideos, userKey]
  )

  /** Persist original like count from API/catalog; never overwrite with a lower/fake 0. */
  const syncLikeBase = useCallback((videoId, originalCount) => {
    const n = toCount(originalCount)
    if (!videoId || n == null) return
    setLikeBases((prev) => {
      const existing = prev[videoId]
      if (existing != null && existing === n) return prev
      // Prefer the highest known real count so we don't replace API data with 0/mock.
      if (existing != null && existing > n && n === 0) return prev
      const next = { ...prev, [videoId]: n }
      writeBases(next)
      return next
    })
  }, [])

  /** Display = original base + 1 if this user liked (never replaces the original). */
  const getLikeCount = useCallback(
    (videoId, fallbackOriginal = 0) => {
      const synced = likeBases[videoId]
      const base =
        synced != null ? synced : toCount(fallbackOriginal) ?? 0
      return Math.max(0, base + (isLiked(videoId) ? 1 : 0))
    },
    [isLiked, likeBases]
  )

  const toggleLike = useCallback(
    (entry) => {
      if (!entry?.videoId) return { ok: false, reason: 'invalid' }
      if (!isSignedIn || !userKey) {
        openSignIn()
        return { ok: false, reason: 'auth' }
      }

      if (entry.likeCount != null || entry.likes != null) {
        syncLikeBase(entry.videoId, entry.likeCount ?? entry.likes)
      }

      let result = { ok: true, liked: false }
      setLikedMap((prev) => {
        const current = Array.isArray(prev[userKey]) ? prev[userKey] : []
        const exists = current.some((v) => v.videoId === entry.videoId)
        let nextList
        if (exists) {
          nextList = current.filter((v) => v.videoId !== entry.videoId)
          result = { ok: true, liked: false }
        } else {
          nextList = [
            {
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
              likedAt: new Date().toISOString(),
            },
            ...current.filter((v) => v.videoId !== entry.videoId),
          ].slice(0, 200)
          result = { ok: true, liked: true }
        }
        const next = { ...prev, [userKey]: nextList }
        writeAll(next)
        return next
      })
      return result
    },
    [isSignedIn, openSignIn, syncLikeBase, userKey]
  )

  const unlike = useCallback(
    (videoId) => {
      if (!userKey || !videoId) return
      setLikedMap((prev) => {
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

  const value = useMemo(
    () => ({
      likedVideos,
      isLiked,
      toggleLike,
      unlike,
      getLikeCount,
      syncLikeBase,
    }),
    [likedVideos, isLiked, toggleLike, unlike, getLikeCount, syncLikeBase]
  )

  return <LikesContext.Provider value={value}>{children}</LikesContext.Provider>
}

export const useLikes = () => {
  const ctx = useContext(LikesContext)
  if (!ctx) throw new Error('useLikes must be used within LikesProvider')
  return ctx
}
