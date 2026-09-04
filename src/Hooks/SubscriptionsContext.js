import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthContext'
import { CHANNELS } from '../data/mockCatalog'

const SubscriptionsContext = createContext(null)
const SUBS_KEY = 'yt_clone_subscriptions_by_user'
const COUNTS_KEY = 'yt_clone_channel_subscriber_counts'

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

/** Parse "1.2M" / "320K" / numbers into an integer base count */
export function parseSubscriberCount(value) {
  if (value == null || value === '') return 0
  if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, Math.floor(value))
  const s = String(value).trim().toUpperCase().replace(/,/g, '')
  const m = s.match(/^([\d.]+)\s*([KMB])?$/)
  if (!m) {
    const n = Number(s)
    return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0
  }
  const n = Number(m[1])
  if (!Number.isFinite(n)) return 0
  const mult = m[2] === 'B' ? 1e9 : m[2] === 'M' ? 1e6 : m[2] === 'K' ? 1e3 : 1
  return Math.floor(n * mult)
}

function seedBaseCounts() {
  const existing = readJson(COUNTS_KEY, {})
  let changed = false
  const next = { ...existing }
  CHANNELS.forEach((ch) => {
    if (!next[ch.id]) {
      next[ch.id] = {
        base: parseSubscriberCount(ch.subscribers),
        delta: 0,
      }
      changed = true
    }
  })
  if (changed) localStorage.setItem(COUNTS_KEY, JSON.stringify(next))
  return next
}

export const SubscriptionsProvider = ({ children }) => {
  const { user, isSignedIn, openSignIn } = useAuth()
  const userKey = user?.handle || user?.email || null
  const [subsMap, setSubsMap] = useState(() => readJson(SUBS_KEY, {}))
  const [counts, setCounts] = useState(seedBaseCounts)

  useEffect(() => {
    setSubsMap(readJson(SUBS_KEY, {}))
  }, [userKey])

  const subscriptions = useMemo(() => {
    if (!userKey) return []
    return Array.isArray(subsMap[userKey]) ? subsMap[userKey] : []
  }, [subsMap, userKey])

  const isSubscribed = useCallback(
    (channelId) => {
      if (!channelId || !userKey) return false
      return subscriptions.some((s) => s.channelId === channelId)
    },
    [subscriptions, userKey]
  )

  const getSubscriberCount = useCallback(
    (channelId, fallback = 0) => {
      if (!channelId) return parseSubscriberCount(fallback)
      const row = counts[channelId]
      if (row) return Math.max(0, (row.base || 0) + (row.delta || 0))
      return parseSubscriberCount(fallback)
    },
    [counts]
  )

  const ensureChannelCount = useCallback((channelId, fallbackBase = 0) => {
    setCounts((prev) => {
      if (prev[channelId]) return prev
      const next = {
        ...prev,
        [channelId]: {
          base: parseSubscriberCount(fallbackBase),
          delta: 0,
        },
      }
      localStorage.setItem(COUNTS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const toggleSubscribe = useCallback(
    (channel) => {
      const channelId = channel?.channelId
      if (!channelId) return { ok: false, reason: 'invalid' }
      if (!isSignedIn || !userKey) {
        openSignIn()
        return { ok: false, reason: 'auth' }
      }

      ensureChannelCount(channelId, channel.subscriberCount ?? channel.subscribers ?? 0)

      let result = { ok: true, subscribed: false }
      setSubsMap((prev) => {
        const current = Array.isArray(prev[userKey]) ? prev[userKey] : []
        const exists = current.some((s) => s.channelId === channelId)
        let nextList
        if (exists) {
          nextList = current.filter((s) => s.channelId !== channelId)
          result = { ok: true, subscribed: false }
          setCounts((cPrev) => {
            const row = cPrev[channelId] || {
              base: parseSubscriberCount(channel.subscriberCount),
              delta: 0,
            }
            const nextCounts = {
              ...cPrev,
              [channelId]: { ...row, delta: (row.delta || 0) - 1 },
            }
            localStorage.setItem(COUNTS_KEY, JSON.stringify(nextCounts))
            return nextCounts
          })
        } else {
          nextList = [
            {
              channelId,
              title: channel.title || 'Channel',
              handle: channel.handle || '',
              avatar: channel.avatar || '/favicon.ico',
              subscribedAt: new Date().toISOString(),
            },
            ...current.filter((s) => s.channelId !== channelId),
          ]
          result = { ok: true, subscribed: true }
          setCounts((cPrev) => {
            const row = cPrev[channelId] || {
              base: parseSubscriberCount(channel.subscriberCount),
              delta: 0,
            }
            const nextCounts = {
              ...cPrev,
              [channelId]: { ...row, delta: (row.delta || 0) + 1 },
            }
            localStorage.setItem(COUNTS_KEY, JSON.stringify(nextCounts))
            return nextCounts
          })
        }
        const next = { ...prev, [userKey]: nextList }
        localStorage.setItem(SUBS_KEY, JSON.stringify(next))
        return next
      })
      return result
    },
    [ensureChannelCount, isSignedIn, openSignIn, userKey]
  )

  const value = useMemo(
    () => ({
      subscriptions,
      isSubscribed,
      toggleSubscribe,
      getSubscriberCount,
      ensureChannelCount,
    }),
    [
      subscriptions,
      isSubscribed,
      toggleSubscribe,
      getSubscriberCount,
      ensureChannelCount,
    ]
  )

  return (
    <SubscriptionsContext.Provider value={value}>
      {children}
    </SubscriptionsContext.Provider>
  )
}

export const useSubscriptions = () => {
  const ctx = useContext(SubscriptionsContext)
  if (!ctx) throw new Error('useSubscriptions must be used within SubscriptionsProvider')
  return ctx
}
