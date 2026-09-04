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

export const LikesProvider = ({ children }) => {
  const { user, isSignedIn, openSignIn } = useAuth()
  const userKey = user?.handle || user?.email || null
  const [likedMap, setLikedMap] = useState(readAll)

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

  const toggleLike = useCallback(
    (entry) => {
      if (!entry?.videoId) return { ok: false, reason: 'invalid' }
      if (!isSignedIn || !userKey) {
        openSignIn()
        return { ok: false, reason: 'auth' }
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
    [isSignedIn, openSignIn, userKey]
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
    () => ({ likedVideos, isLiked, toggleLike, unlike }),
    [likedVideos, isLiked, toggleLike, unlike]
  )

  return <LikesContext.Provider value={value}>{children}</LikesContext.Provider>
}

export const useLikes = () => {
  const ctx = useContext(LikesContext)
  if (!ctx) throw new Error('useLikes must be used within LikesProvider')
  return ctx
}
