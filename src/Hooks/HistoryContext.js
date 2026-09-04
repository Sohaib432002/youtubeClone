import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const HistoryContext = createContext(null)
const STORAGE_KEY = 'yt_clone_history'
const MAX_ITEMS = 100

function readHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState(readHistory)

  const persist = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    setHistory(items)
  }

  const addToHistory = useCallback((entry) => {
    if (!entry?.videoId) return
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.videoId !== entry.videoId)
      const next = [
        {
          videoId: entry.videoId,
          title: entry.title || 'Untitled',
          thumbnail: entry.thumbnail || '',
          channelTitle: entry.channelTitle || '',
          channelId: entry.channelId || '',
          channelLogo: entry.channelLogo || '',
          watchedAt: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, MAX_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearHistory = useCallback(() => persist([]), [])

  const removeFromHistory = useCallback((videoId) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.videoId !== videoId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ history, addToHistory, clearHistory, removeFromHistory }),
    [history, addToHistory, clearHistory, removeFromHistory]
  )

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
}

export const useWatchHistory = () => {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error('useWatchHistory must be used within HistoryProvider')
  return ctx
}
