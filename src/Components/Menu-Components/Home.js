import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { usePrefs } from '../../Hooks/PrefsContext'
import { getShortsPage, getVideosByCategory } from '../../data/mockCatalog'
import {
  getHomeVideos,
  getChannelLogoMap,
  videoIdOf,
  dedupeByVideoId,
} from '../../utils/youtubeApi'
import { formatViews } from '../../utils/format'
import { landscapeThumbnail, normalizeFeedItem } from '../../utils/feed'
import Card from '../Home-components/Card'
import ShowMoreButton from '../ui/ShowMoreButton'

/** Long videos shown above Shorts (~2 desktop rows). */
const PRE_SHORTS_COUNT = 6

const Home = () => {
  const {
    windowResize,
    setisShowScrollbar,
    activeCategory,
    categoryQuery,
    isDesktopSidebar,
    contentOffsetPx,
    setWatchMode,
  } = useContext(ThemeContext)
  const { prefs } = usePrefs()

  const filterRestricted = useCallback(
    (list) => {
      if (prefs.restricted !== 'On') return list
      const blocked = ['violence', 'adult', 'nsfw', '18+', 'horror']
      return list.filter((v) => {
        const t = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
        return !blocked.some((b) => t.includes(b))
      })
    },
    [prefs.restricted]
  )

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
  const pageTokenRef = useRef('')
  const sourceRef = useRef('live')
  const categoryRef = useRef(activeCategory)

  useEffect(() => {
    setisShowScrollbar(true)
    setWatchMode(false)
  }, [setisShowScrollbar, setWatchMode])

  useEffect(() => {
    setShorts(getShortsPage(0, 24, activeCategory).items)
  }, [activeCategory])

  useEffect(() => {
    categoryRef.current = activeCategory
  }, [activeCategory])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setItems([])
      setPage(0)
      setHasMore(false)
      pageTokenRef.current = ''
      sourceRef.current = 'live'
      window.scrollTo({ top: 0, behavior: 'smooth' })

      let list = []

      try {
        const live = await getHomeVideos(activeCategory, 24)
        if (cancelled) return
        const mapped = filterRestricted(
          dedupeByVideoId(
            (live?.items || [])
              .map((it) => normalizeFeedItem(it, activeCategory))
              .filter(Boolean)
          )
        )
        if (mapped.length) {
          list = mapped
          sourceRef.current = 'live'
          pageTokenRef.current = live.nextPageToken || ''
        }
      } catch (_) {
        /* fall through to catalog for this category only */
      }

      if (!list.length) {
        const local = getVideosByCategory(activeCategory, 0, 24)
        list = filterRestricted(
          dedupeByVideoId(
            local.items.map((it) => normalizeFeedItem(it, activeCategory)).filter(Boolean)
          )
        )
        sourceRef.current = 'catalog'
        pageTokenRef.current = ''
        if (!cancelled) setHasMore(Boolean(local.hasMore))
      } else if (!cancelled) {
        setHasMore(Boolean(pageTokenRef.current))
      }

      if (!cancelled) {
        setItems(list)
        const localLogos = {}
        list.forEach((v) => {
          if (v.meta?.channelAvatar) localLogos[v.snippet.channelId] = v.meta.channelAvatar
        })
        setLogoMap(localLogos)
        setLoading(false)
      }

      try {
        const logos = await getChannelLogoMap(
          list
            .map((v) => v.snippet?.channelId)
            .filter((cid) => cid && !String(cid).startsWith('ch_'))
        )
        const localLogos = {}
        list.forEach((v) => {
          if (v.meta?.channelAvatar) localLogos[v.snippet.channelId] = v.meta.channelAvatar
        })
        if (!cancelled) setLogoMap({ ...localLogos, ...logos })
      } catch (_) {
        /* optional */
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [activeCategory, categoryQuery, filterRestricted])

  const loadMore = async () => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setLoadingMore(true)
    const cat = categoryRef.current
    try {
      if (sourceRef.current === 'live' && pageTokenRef.current) {
        const more = await getHomeVideos(cat, 24, { pageToken: pageTokenRef.current })
        const mapped = filterRestricted(
          dedupeByVideoId(
            (more.items || []).map((it) => normalizeFeedItem(it, cat)).filter(Boolean)
          )
        )
        setItems((prev) => {
          const seen = new Set(prev.map((v) => videoIdOf(v)))
          return [...prev, ...mapped.filter((v) => !seen.has(videoIdOf(v)))]
        })
        pageTokenRef.current = more.nextPageToken || ''
        setHasMore(Boolean(more.nextPageToken))
      } else if (sourceRef.current === 'catalog') {
        const next = page + 1
        const local = getVideosByCategory(cat, next, 24)
        setItems((prev) => {
          const seen = new Set(prev.map((v) => videoIdOf(v) || v.catalogId))
          const extra = local.items
            .map((it) => normalizeFeedItem(it, cat))
            .filter((v) => v && !seen.has(videoIdOf(v)))
          return [...prev, ...extra]
        })
        setPage(next)
        setHasMore(Boolean(local.hasMore))
      } else {
        setHasMore(false)
      }
    } finally {
      loadingRef.current = false
      setLoadingMore(false)
    }
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
    if (!isDesktopSidebar) {
      if (windowResize >= 768) return 'md:ml-[72px]'
      return 'ml-0'
    }
    return contentOffsetPx >= 240 ? 'lg:ml-[240px]' : 'lg:ml-[72px]'
  }, [isDesktopSidebar, windowResize, contentOffsetPx])

  const topVideos = useMemo(() => items.slice(0, PRE_SHORTS_COUNT), [items])
  const restVideos = useMemo(() => items.slice(PRE_SHORTS_COUNT), [items])

  const scrollShorts = (dir) => {
    shortsRailRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  const renderVideoCard = (item, idx) => {
    const vid = item.id?.videoId || item.meta?.videoId
    const thumb =
      item.snippet?.thumbnails?.high?.url ||
      item.snippet?.thumbnails?.medium?.url ||
      landscapeThumbnail(vid)
    return (
      <Card
        key={`${vid}-${idx}`}
        item={{
          ...item,
          snippet: {
            ...item.snippet,
            thumbnails: {
              ...item.snippet.thumbnails,
              medium: { url: thumb },
              high: { url: thumb },
            },
          },
        }}
        channelLogo={logoMap[item.snippet?.channelId] || item.meta?.channelAvatar}
      />
    )
  }

  const ShortsSection = (
    <section
      className="my-10 sm:my-12 py-6 sm:py-8 -mx-3 sm:-mx-4 lg:-mx-8 px-3 sm:px-4 lg:px-8 border-y border-[#222]"
      aria-label="Shorts"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2.5 text-white">
          <i className="fa-solid fa-bolt text-red-500 text-lg sm:text-xl"></i>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">Shorts</h2>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => scrollShorts(-1)}
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border border-[#3f3f3f] text-white hover:bg-[#272727]"
            aria-label="Scroll shorts left"
          >
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button
            type="button"
            onClick={() => scrollShorts(1)}
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border border-[#3f3f3f] text-white hover:bg-[#272727]"
            aria-label="Scroll shorts right"
          >
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
          <Link to="/shorts" className="text-sm text-[#3ea6ff] hover:underline ml-1 px-1">
            View all
          </Link>
        </div>
      </div>
      <div
        ref={shortsRailRef}
        className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
      >
        {shorts.map((s) => (
          <Link
            key={s.id}
            to={`/shorts/${s.videoId}`}
            className="snap-start flex-shrink-0 w-[min(72vw,260px)] sm:w-[250px] md:w-[270px] lg:w-[290px] group"
          >
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#272727] shadow-md ring-1 ring-white/10">
              <img
                src={`https://i.ytimg.com/vi/${s.videoId}/mqdefault.jpg`}
                alt=""
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-3.5">
                <p className="text-white text-sm sm:text-[15px] font-medium line-clamp-2 leading-snug">
                  {s.title}
                </p>
                <p className="text-[#ccc] text-xs mt-1.5">{formatViews(s.views)} views</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )

  return (
    <div
      className={`min-h-screen bg-[#0f0f0f] pt-[100px] pb-20 px-3 sm:px-4 lg:px-8 ${leftPad} transition-[margin] duration-200`}
    >
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
          <h2 className="text-white text-lg font-semibold mb-5">
            {activeCategory === 'All' ? 'Recommended' : activeCategory}
          </h2>

          {topVideos.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
              {topVideos.map((item, idx) => renderVideoCard(item, idx))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#272727] bg-[#181818] py-16 text-center mb-8">
              <i className="fa-solid fa-film text-3xl text-[#555] mb-3"></i>
              <p className="text-white">No videos in this category yet</p>
              <p className="text-sm text-[#aaa] mt-1">Try another chip or check back later.</p>
            </div>
          )}

          {shorts.length ? ShortsSection : null}

          {restVideos.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8 mt-2">
              {restVideos.map((item, idx) =>
                renderVideoCard(item, idx + PRE_SHORTS_COUNT)
              )}
            </div>
          ) : null}

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
