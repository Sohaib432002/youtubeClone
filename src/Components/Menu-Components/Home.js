import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { usePrefs } from '../../Hooks/PrefsContext'
import { getShortsPage, getVideosByCategory } from '../../data/mockCatalog'
import { searchVideos, getChannelLogoMap } from '../../utils/youtubeApi'
import { formatViews } from '../../utils/format'
import Card from '../Home-components/Card'
import ShowMoreButton from '../ui/ShowMoreButton'

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
  const {
    isShowLeftbar,
    windowResize,
    setisShowScrollbar,
    activeCategory,
    miniSidebar,
  } = useContext(ThemeContext)
  const { prefs } = usePrefs()

  const filterRestricted = (list) => {
    if (prefs.restricted !== 'On') return list
    const blocked = ['violence', 'adult', 'nsfw', '18+', 'horror']
    return list.filter((v) => {
      const t = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
      return !blocked.some((b) => t.includes(b))
    })
  }

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

      if (activeCategory === 'All' || activeCategory === 'Trending') {
        try {
          const live = await searchVideos(
            activeCategory === 'All' ? 'technology tutorial' : 'trending news',
            16,
            { videoDuration: 'medium' }
          )
          if (live?.items?.length) {
            const mapped = live.items
              .filter((it) => !isShortLike(it))
              .map((it) => ({
                ...it,
                snippet: {
                  ...it.snippet,
                  thumbnails: {
                    ...it.snippet.thumbnails,
                    medium: { url: fullThumb(it) },
                    high: { url: fullThumb(it) },
                  },
                },
                meta: {
                  videoId: it.id?.videoId,
                  channelAvatar: null,
                  duration: '',
                  views: undefined,
                  verified: false,
                  isShort: false,
                },
              }))
            const ids = new Set(mapped.map((m) => m.id?.videoId))
            list = filterRestricted([
              ...mapped,
              ...local.items.filter((x) => !ids.has(x.id?.videoId) && !isShortLike(x)),
            ])
          }
        } catch (_) {
          /* keep local */
        }
      }

      if (cancelled) return
      setItems(list)
      setHasMore(local.hasMore || list.length >= 20)
      const logos = await getChannelLogoMap(
        list.map((v) => v.snippet?.channelId).filter((id) => id && !String(id).startsWith('ch_'))
      )
      const localLogos = {}
      list.forEach((v) => {
        if (v.meta?.channelAvatar) localLogos[v.snippet.channelId] = v.meta.channelAvatar
      })
      if (!cancelled) setLogoMap({ ...localLogos, ...logos })
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [activeCategory, prefs.restricted])

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
    if (windowResize < 768) return 'ml-0'
    if (isShowLeftbar) return 'md:ml-[240px]'
    if (miniSidebar) return 'md:ml-[72px]'
    return 'md:ml-[72px]'
  }, [isShowLeftbar, windowResize, miniSidebar])

  const scrollShorts = (dir) => {
    shortsRailRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <div className={`min-h-screen bg-[#0f0f0f] pt-[100px] pb-20 px-3 sm:px-4 lg:px-6 ${leftPad}`}>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {Array.from({ length: 8 }).map((_, i) => (
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
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white">
                <i className="fa-solid fa-bolt text-red-500 text-xl"></i>
                <h2 className="text-xl font-bold">Shorts</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollShorts(-1)}
                  className="w-9 h-9 rounded-full border border-[#3f3f3f] text-white hover:bg-[#272727]"
                >
                  <i className="fa-solid fa-chevron-left text-xs"></i>
                </button>
                <button
                  type="button"
                  onClick={() => scrollShorts(1)}
                  className="w-9 h-9 rounded-full border border-[#3f3f3f] text-white hover:bg-[#272727]"
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
              className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x"
            >
              {shorts.map((s) => (
                <Link
                  key={s.id}
                  to={`/shorts/${s.videoId}`}
                  className="snap-start flex-shrink-0 w-[160px] sm:w-[180px] group"
                >
                  <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-[#272727]">
                    <img
                      src={`https://i.ytimg.com/vi/${s.videoId}/mqdefault.jpg`}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-xs font-medium line-clamp-2">{s.title}</p>
                      <p className="text-[#ccc] text-[11px] mt-1">{formatViews(s.views)} views</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <h2 className="text-white text-lg font-semibold mb-4">Recommended</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
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
