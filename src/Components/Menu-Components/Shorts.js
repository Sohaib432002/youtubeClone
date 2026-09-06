import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { searchShorts } from '../../utils/youtubeApi'
import { setShortsQueue, toPlayerShort } from '../../utils/shorts'
import { formatViews } from '../../utils/format'

const Shorts = () => {
  const { setisShowScrollbar, isDesktopSidebar, windowResize } = useContext(ThemeContext)
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [nextToken, setNextToken] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const sentinelRef = useRef(null)
  const loadingRef = useRef(false)

  useEffect(() => {
    setisShowScrollbar(false)
    let cancelled = false
    const load = async () => {
      setLoading(true)
      const page = await searchShorts('', 24)
      if (cancelled) return
      const mapped = (page.items || []).map(toPlayerShort).filter(Boolean)
      setItems(mapped)
      setNextToken(page.nextPageToken || '')
      setHasMore(Boolean(page.nextPageToken))
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [setisShowScrollbar])

  const loadMore = async () => {
    if (loadingRef.current || !hasMore || !nextToken) return
    loadingRef.current = true
    const page = await searchShorts('', 18, { pageToken: nextToken })
    const extra = (page.items || []).map(toPlayerShort).filter(Boolean)
    setItems((prev) => {
      const seen = new Set(prev.map((s) => s.videoId))
      return [...prev, ...extra.filter((s) => !seen.has(s.videoId))]
    })
    setNextToken(page.nextPageToken || '')
    setHasMore(Boolean(page.nextPageToken))
    loadingRef.current = false
  }

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return undefined
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '400px' }
    )
    obs.observe(node)
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextToken, hasMore])

  const open = (s) => {
    setShortsQueue(items, { query: '', source: 'shorts' })
    navigate(`/shorts/${s.videoId}`)
  }

  const leftPad = isDesktopSidebar
    ? 'lg:ml-[240px]'
    : windowResize >= 768
      ? 'md:ml-[72px]'
      : 'ml-0'

  return (
    <div className={`min-h-screen pt-[90px] pb-20 px-3 sm:px-6 ${leftPad}`}>
      <div className="flex items-center gap-2 text-white mb-5">
        <i className="fa-solid fa-bolt text-red-500 text-2xl"></i>
        <h1 className="text-2xl font-bold">Shorts</h1>
      </div>
      {loading ? (
        <p className="text-[#aaa] py-10 text-center">Loading Shorts...</p>
      ) : !items.length ? (
        <p className="text-[#aaa] py-10 text-center">No Shorts available right now.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {items.map((s) => (
            <button
              key={s.videoId}
              type="button"
              onClick={() => open(s)}
              className="group text-left"
            >
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#272727] ring-1 ring-white/5">
                <img
                  src={`https://i.ytimg.com/vi/${s.videoId}/hqdefault.jpg`}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute top-2 left-2 text-[11px] font-semibold bg-black/60 text-white px-1.5 py-0.5 rounded">
                  Shorts
                </span>
                <div className="absolute bottom-0 p-3">
                  <p className="text-white text-sm font-medium line-clamp-2 leading-snug">{s.title}</p>
                  <p className="text-[#ccc] text-xs mt-1.5">{formatViews(s.views)} views</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      <div ref={sentinelRef} className="h-12 flex items-center justify-center text-[#aaa] text-sm mt-4">
        {hasMore ? 'Loading more Shorts...' : items.length ? 'End of Shorts' : ''}
      </div>
    </div>
  )
}

export default Shorts
