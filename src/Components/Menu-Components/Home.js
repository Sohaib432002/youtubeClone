import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { usePrefs } from '../../Hooks/PrefsContext'
import { getShortsPage, getVideosByCategory } from '../../data/mockCatalog'
import { searchVideos, getChannelLogoMap } from '../../utils/youtubeApi'
import { formatViews } from '../../utils/format'
import Card from '../Home-components/Card'
import ShowMoreButton from '../ui/ShowMoreButton'
import fetchedData from '../../FetchedData'

function isShortLike(item) {
  const title = (item?.snippet?.title || item?.meta?.title || '').toLowerCase()
  const desc = (item?.snippet?.description || '').toLowerCase()
  if (item?.meta?.isShort) return true
  if (title.includes('#shorts') || title.includes('#short') || title.includes(' shorts')) return true
  if (desc.includes('#shorts')) return true
  return false
}

function fullThumb(item) {
  const id = item?.id?.videoId || item?.meta?.videoId
  if (id) return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`
  return (
    item?.snippet?.thumbnails?.medium?.url ||
    item?.snippet?.thumbnails?.high?.url ||
    item?.snippet?.thumbnails?.default?.url
  )
}

const Home = () => {
  const { windowResize, setisShowScrollbar, activeCategory, isDesktopSidebar } =
    useContext(ThemeContext)
  const { prefs } = usePrefs()

  const filterRestricted = useCallback((list) => {
    if (prefs.restricted !== 'On') return list
    const blocked = ['violence', 'adult', 'nsfw', '18+', 'horror']
    return list.filter((v) => {
      const t = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
      return !blocked.some((b) => t.includes(b))
    })
  }, [prefs.restricted])

  const [items, setItems] = useState([])
  const [logoMap, setLogoMap] = useState({})
  const [shorts, setShorts] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const loadingRef = useRef(false)
  const sentinelRef = useRef(null)
  const shortsRailRef = useRef(null)

  useEffect(() => {
    setisShowScrollbar(true)
  }, [setisShowScrollbar])

  useEffect(() => {
    setShorts(getShortsPage(0, 24).items)
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setPage(0)
      const local = getVideosByCategory(activeCategory, 0, 24)
      let list = filterRestricted(local.items.filter((v) => !isShortLike(v)))

      // Prefer your original FetchedData feed on Home / Trending
      if (activeCategory === 'All' || activeCategory === 'Trending') {
        const original = (fetchedData?.items || [])
          .map((it) => {
            const videoId =
              (typeof it.id === 'string' && it.id) || it.id?.videoId
            if (!videoId || !it.snippet) return null
            return {
              ...it,
              id: { kind: 'youtube#video', videoId },
              meta: {
                videoId,
                channelAvatar: null,
                duration: '',
                views: undefined,
                verified: false,
                isShort: false,
              },
            }
          })
          .filter((it) => it && !isShortLike(it))
        if (original.length) {
          const ids = new Set(original.map((m) => m.id.videoId))
          list = filterRestricted([
            ...original,
            ...list.filter((x) => !ids.has(x.id?.videoId)),
          ])
        }
      }

      // Paint local/catalog videos immediately — never wait on YouTube API
      if (!cancelled) {
        setItems(list)
        setHasMore(local.hasMore || list.length >= 20)
        const localLogos = {}
        list.forEach((v) => {
          if (v.meta?.channelAvatar) localLogos[v.snippet.channelId] = v.meta.channelAvatar
        })
        setLogoMap(localLogos)
        setLoading(false)
      }

      if (activeCategory === 'All' || activeCategory === 'Trending') {
        try {
          const live = await searchVideos(
            activeCategory === 'All' ? 'technology tutorial' : 'trending news',
            16,
            { videoDuration: 'medium' }
          )
          if (cancelled) return
          if (live?.items?.length) {
            const mapped = live.items
              .map((it) => {
                const videoId =
                  (typeof it.id === 'string' && it.id) ||
                  it.id?.videoId ||
                  it.meta?.videoId
                if (!videoId || !it.snippet) return null
                return {
                  ...it,
                  id: { kind: 'youtube#video', videoId },
                  snippet: {
                    ...it.snippet,
                    thumbnails: {
                      ...it.snippet.thumbnails,
                      medium: { url: fullThumb({ ...it, id: { videoId } }) },
                      high: { url: fullThumb({ ...it, id: { videoId } }) },
                    },
                  },
                  meta: {
                    videoId,
                    channelAvatar: null,
                    duration: '',
                    views: undefined,
                    verified: false,
                    isShort: false,
                  },
                }
              })
              .filter((it) => it && !isShortLike(it))
            const ids = new Set(mapped.map((m) => m.id?.videoId))
            list = filterRestricted([
              ...mapped,
              ...local.items.filter((x) => !ids.has(x.id?.videoId) && !isShortLike(x)),
            ])
            if (!cancelled) {
              setItems(list)
              setHasMore(local.hasMore || list.length >= 20)
            }
          }
        } catch (_) {
          /* keep local */
        }
      }

      try {
        const logos = await getChannelLogoMap(
          list
            .map((v) => v.snippet?.channelId)
            .filter((id) => id && !String(id).startsWith('ch_'))
        )
        const localLogos = {}
        list.forEach((v) => {
          if (v.meta?.channelAvatar) localLogos[v.snippet.channelId] = v.meta.channelAvatar
        })
        if (!cancelled) setLogoMap({ ...localLogos, ...logos })
      } catch (_) {
        /* logos optional */
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [activeCategory, filterRestricted])

  const loadMore = async () => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setLoadingMore(true)
    const next = page + 1
    const local = getVideosByCategory(activeCategory, next, 24)
    setItems((prev) => {
      const seen = new Set(prev.map((v) => v.id?.videoId || v.catalogId))
      const merged = [
        ...prev,
        ...local.items.filter(
          (v) => !seen.has(v.id?.videoId || v.catalogId) && !isShortLike(v)
        ),
      ]
      return merged
    })
    setPage(next)
    setHasMore(local.hasMore)
    loadingRef.current = false
    setLoadingMore(false)
  }

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return undefined
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '500px' }
    )
    obs.observe(node)
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, page, activeCategory])

  const leftPad = useMemo(() => {
    if (isDesktopSidebar) return 'lg:ml-[240px]'
    if (windowResize >= 768) return 'md:ml-[72px]'
    return 'ml-0'
  }, [isDesktopSidebar, windowResize])

  const scrollShorts = (dir) => {
    shortsRailRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  return (
    <div className={`min-h-screen bg-[#0f0f0f] pt-[100px] pb-20 px-3 sm:px-4 lg:px-8 ${leftPad}`}>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video rounded-xl bg-[#272727]" />
              <div className="flex gap-3 mt-3">
                <div className="w-9 h-9 rounded-full bg-[#272727]" />
                <div className="flex-1">
                  <div className="h-4 bg-[#272727] rounded w-4/5" />
                  <div className="h-3 bg-[#272727] rounded w-2/5 mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5 text-white">
                <i className="fa-solid fa-bolt text-red-500 text-xl"></i>
                <h2 className="text-xl font-bold tracking-tight">Shorts</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollShorts(-1)}
                  className="w-9 h-9 rounded-full border border-[#3f3f3f] text-white hover:bg-[#272727]"
                  aria-label="Scroll shorts left"
                >
                  <i className="fa-solid fa-chevron-left text-xs"></i>
                </button>
                <button
                  type="button"
                  onClick={() => scrollShorts(1)}
                  className="w-9 h-9 rounded-full border border-[#3f3f3f] text-white hover:bg-[#272727]"
                  aria-label="Scroll shorts right"
                >
                  <i className="fa-solid fa-chevron-right text-xs"></i>
                </button>
                <Link to="/shorts" className="text-sm text-[#3ea6ff] hover:underline ml-1">
                  View all
                </Link>
              </div>
            </div>
            <div
              ref={shortsRailRef}
              className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide pb-3 snap-x snap-mandatory"
            >
              {shorts.map((s) => (
                <Link
                  key={s.id}
                  to={`/shorts/${s.videoId}`}
                  className="snap-start flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px] group"
                >
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#272727] shadow-sm ring-1 ring-white/5">
                    <img
                      src={`https://i.ytimg.com/vi/${s.videoId}/mqdefault.jpg`}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium line-clamp-2 leading-snug">
                        {s.title}
                      </p>
                      <p className="text-[#ccc] text-xs mt-1.5">
                        {formatViews(s.views)} views
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <h2 className="text-white text-lg font-semibold mb-5">Recommended</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
            {items.map((item, idx) => (
              <Card
                key={`${item.id?.videoId || item.catalogId}-${idx}`}
                item={{
                  ...item,
                  snippet: {
                    ...item.snippet,
                    thumbnails: {
                      ...item.snippet.thumbnails,
                      medium: { url: fullThumb(item) },
                      high: { url: fullThumb(item) },
                    },
                  },
                }}
                channelLogo={
                  logoMap[item.snippet?.channelId] || item.meta?.channelAvatar
                }
              />
            ))}
          </div>

          <div ref={sentinelRef} className="mt-2">
            {hasMore ? (
              <ShowMoreButton onClick={loadMore} loading={loadingMore} label="Show more" />
            ) : (
              <p className="text-center text-[#555] text-xs py-4">You&apos;re all caught up</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Home
