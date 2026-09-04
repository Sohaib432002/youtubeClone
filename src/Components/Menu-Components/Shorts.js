import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { getShortsPage } from '../../data/mockCatalog'
import { formatViews } from '../../utils/format'

const Shorts = () => {
  const { setisShowScrollbar, isDesktopSidebar, windowResize } = useContext(ThemeContext)
  const [items, setItems] = useState([])
  const [next, setNext] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef(null)

  useEffect(() => {
    setisShowScrollbar(false)
    const page = getShortsPage(0, 18)
    setItems(page.items)
    setNext(page.next)
    setHasMore(page.hasMore)
  }, [setisShowScrollbar])

  const loadMore = () => {
    if (!hasMore) return
    const page = getShortsPage(next, 12)
    setItems((prev) => {
      const seen = new Set(prev.map((s) => s.videoId))
      return [...prev, ...page.items.filter((s) => !seen.has(s.videoId))]
    })
    setNext(page.next)
    setHasMore(page.hasMore)
  }

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return undefined
    const obs = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) loadMore()
    }, { rootMargin: '400px' })
    obs.observe(node)
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next, hasMore])

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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {items.map((s) => (
          <Link key={s.id} to={`/shorts/${s.videoId}`} className="group">
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#272727] ring-1 ring-white/5">
              <img
                src={s.thumbnails.medium.url}
                alt=""
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-0 p-3">
                <p className="text-white text-sm font-medium line-clamp-2 leading-snug">{s.title}</p>
                <p className="text-[#ccc] text-xs mt-1.5">{formatViews(s.views)} views</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div ref={sentinelRef} className="h-12 flex items-center justify-center text-[#aaa] text-sm mt-4">
        {hasMore ? 'Loading more Shorts...' : 'End of Shorts'}
      </div>
    </div>
  )
}

export default Shorts
