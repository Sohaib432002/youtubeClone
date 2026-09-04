import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { getChannelLogoMap, searchVideos } from '../../utils/youtubeApi'
import Card from '../Home-components/Card'

const EXTRA_QUERIES = [
  'viral',
  'popular',
  'new',
  'best',
  '2024',
  '2025',
  'highlights',
  'top',
  'recommended',
  'worldwide',
]

const Home = () => {
  const [items, setItems] = useState([])
  const [logoMap, setLogoMap] = useState({})
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(false)
  const location = useLocation()
  const {
    isShowLeftbar,
    windowResize,
    setisShowScrollbar,
    activeCategory,
    categoryQuery,
  } = useContext(ThemeContext)

  const sentinelRef = useRef(null)
  const loadingMoreRef = useRef(false)
  const nextPageTokenRef = useRef('')
  const pageIndexRef = useRef(0)
  const queryRef = useRef(categoryQuery)
  const itemsLenRef = useRef(0)

  useEffect(() => {
    setisShowScrollbar(true)
  }, [setisShowScrollbar])

  const attachLogos = useCallback(async (videoItems, prevMap = {}) => {
    const ids = videoItems.map((v) => v?.snippet?.channelId).filter(Boolean)
    const missing = ids.filter((id) => !prevMap[id])
    if (!missing.length) return prevMap
    const fresh = await getChannelLogoMap(missing)
    return { ...prevMap, ...fresh }
  }, [])

  const mergeItems = useCallback((prev, incoming) => {
    const seen = new Set(prev.map((v) => v.id?.videoId).filter(Boolean))
    const unique = (incoming || []).filter((v) => {
      const id = v.id?.videoId
      if (!id || seen.has(id)) return false
      seen.add(id)
      return true
    })
    return [...prev, ...unique]
  }, [])

  // Initial / category change load
  useEffect(() => {
    let cancelled = false
    queryRef.current = categoryQuery
    nextPageTokenRef.current = ''
    pageIndexRef.current = 0
    setHasMore(true)

    const load = async () => {
      setLoading(true)
      setError(false)
      setItems([])
      try {
        if (location.state?.items && activeCategory === 'All') {
          if (cancelled) return
          setItems(location.state.items)
          itemsLenRef.current = location.state.items.length
          nextPageTokenRef.current = location.state.nextPageToken || ''
          setHasMore(Boolean(location.state.nextPageToken) || true)
          const map = await attachLogos(location.state.items)
          if (!cancelled) setLogoMap(map)
        } else {
          const data = await searchVideos(categoryQuery, 24)
          if (cancelled) return
          const list = data?.items || []
          if (list.length) {
            setItems(list)
            itemsLenRef.current = list.length
            nextPageTokenRef.current = data.nextPageToken || ''
            setHasMore(true)
            const map = await attachLogos(list)
            if (!cancelled) setLogoMap(map)
          } else {
            setError(true)
            setHasMore(false)
          }
        }
      } catch (_) {
        if (!cancelled) {
          setError(true)
          setHasMore(false)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [categoryQuery, activeCategory, location.state, attachLogos])

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMore) return
    loadingMoreRef.current = true
    setLoadingMore(true)

    try {
      let data = null
      const base = queryRef.current || 'trending'

      if (nextPageTokenRef.current) {
        data = await searchVideos(base, 24, { pageToken: nextPageTokenRef.current })
      }

      // If no token or empty page, try diversified follow-up queries
      if (!data?.items?.length) {
        const idx = pageIndexRef.current
        if (idx >= EXTRA_QUERIES.length * 2) {
          setHasMore(false)
          return
        }
        const extra = EXTRA_QUERIES[idx % EXTRA_QUERIES.length]
        const q = `${base} ${extra}`
        data = await searchVideos(q, 24)
        pageIndexRef.current = idx + 1
      }

      const newItems = data?.items || []
      if (!newItems.length) {
        // try one more diversified attempt before stopping
        pageIndexRef.current += 1
        if (pageIndexRef.current >= EXTRA_QUERIES.length * 2) setHasMore(false)
        return
      }

      setItems((prev) => {
        const merged = mergeItems(prev, newItems)
        // if nothing new was added, advance and keep trying later
        if (merged.length === prev.length) {
          pageIndexRef.current += 1
          nextPageTokenRef.current = ''
          if (pageIndexRef.current >= EXTRA_QUERIES.length * 2) setHasMore(false)
        } else {
          itemsLenRef.current = merged.length
        }
        return merged
      })

      nextPageTokenRef.current = data.nextPageToken || ''
      if (!data.nextPageToken) pageIndexRef.current += 1

      setLogoMap((prev) => {
        attachLogos(newItems, prev).then(setLogoMap)
        return prev
      })
    } catch (_) {
      pageIndexRef.current += 1
    } finally {
      loadingMoreRef.current = false
      setLoadingMore(false)
    }
  }, [attachLogos, hasMore, mergeItems])

  // IntersectionObserver
  useEffect(() => {
    const node = sentinelRef.current
    if (!node || loading) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { root: null, rootMargin: '600px', threshold: 0 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [loadMore, loading, items.length, activeCategory])

  // Window scroll fallback (more reliable on some layouts)
  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 900
      if (nearBottom) loadMore()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [loadMore])

  const leftPad =
    isShowLeftbar && windowResize >= 1200 ? 'md:ml-[15rem]' : 'md:ml-[5rem]'

  return (
    <div className={`min-h-screen bg-[#0F0F0F] pt-[110px] pb-20 md:pb-8 px-3 sm:px-4 ${leftPad}`}>
      <div className="mb-3 text-[#AAAAAA] text-sm">
        {activeCategory !== 'All' ? (
          <span>
            Showing: <span className="text-white font-medium">{activeCategory}</span>
          </span>
        ) : null}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video rounded-xl bg-[#272727]" />
              <div className="h-4 bg-[#272727] rounded mt-3 w-4/5" />
              <div className="h-3 bg-[#272727] rounded mt-2 w-2/5" />
            </div>
          ))}
        </div>
      ) : error || items.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-[#AAAAAA] px-4 text-center">
          <p className="text-lg text-white mb-2">Couldn&apos;t load videos</p>
          <p className="text-sm">Please try again later or start the Django backend.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-x-4 sm:gap-y-8 video-grid">
            {items.map((item, index) => (
              <Card
                key={`${item.id?.videoId || item.etag}-${index}`}
                item={item}
                channelLogo={logoMap[item.snippet?.channelId]}
              />
            ))}
          </div>
          <div ref={sentinelRef} className="h-16 flex items-center justify-center mt-6">
            {loadingMore ? (
              <div className="flex items-center gap-2 text-[#AAAAAA] text-sm">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                Loading more videos...
              </div>
            ) : hasMore ? (
              <button
                type="button"
                onClick={loadMore}
                className="text-sm text-[#3ea6ff] hover:underline"
              >
                Load more
              </button>
            ) : (
              <p className="text-[#555] text-xs">You&apos;re all caught up</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Home
