import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { getShortsPage } from '../../data/mockCatalog'
import { formatViews } from '../../utils/format'

const Shorts = () => {
  const { setisShowScrollbar, isShowLeftbar, windowResize } = useContext(ThemeContext)
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
    setItems((prev) => [...prev, ...page.items])
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

  const leftPad =
    windowResize < 768 ? 'ml-0' : isShowLeftbar ? 'md:ml-[240px]' : 'md:ml-[72px]'

  return (
    <div className={`min-h-screen pt-[90px] pb-20 px-3 sm:px-6 ${leftPad}`}>
      <div className="flex items-center gap-2 text-white mb-5">
        <i className="fa-solid fa-bolt text-red-500 text-2xl"></i>
        <h1 className="text-2xl font-bold">Shorts</h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {items.map((s) => (
          <Link key={s.id} to={`/shorts/${s.videoId}`} className="group">
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-[#272727]">
              <img
                src={s.thumbnails.medium.url}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-0 p-2">
                <p className="text-white text-xs font-medium line-clamp-2">{s.title}</p>
                <p className="text-[#ccc] text-[11px] mt-1">{formatViews(s.views)} views</p>
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
