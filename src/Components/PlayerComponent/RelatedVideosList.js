import { useContext, useEffect, useMemo, useRef } from 'react'
import { ThemeContext } from '../../Hooks/ThemeContext'
import RelatedVideosShel from './subComponents/RelatedVideosShel'
import RelatedVidosCard from './subComponents/RelatedVidosCard'
import { isShortSearchItem } from '../../data/mockCatalog'

const RelatedVideos = ({
  randomVideosData,
  setupdate,
  loading = false,
  loadingMore = false,
  error = '',
  hasMore = false,
  onLoadMore,
}) => {
  const { windowResize } = useContext(ThemeContext)
  const isSidebarCol = windowResize >= 1170
  const sentinelRef = useRef(null)

  const videos = useMemo(() => {
    const list = randomVideosData?.items || []
    const seenIds = new Set()
    const seenTitles = new Set()
    const seenThumbs = new Set()
    return list.filter((item) => {
      const id = item?.id?.videoId || (typeof item?.id === 'string' ? item.id : null)
      if (!id || !item?.snippet) return false
      if (isShortSearchItem(item)) return false
      if (seenIds.has(id)) return false
      const title = String(item.snippet.title || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
      if (title && seenTitles.has(title)) return false
      const thumb = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`
      if (seenThumbs.has(thumb)) return false
      seenIds.add(id)
      if (title) seenTitles.add(title)
      seenThumbs.add(thumb)
      return true
    })
  }, [randomVideosData])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore || !onLoadMore) return undefined
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore()
      },
      { rootMargin: '400px' }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [hasMore, onLoadMore, videos.length])

  if (loading && !videos.length) {
    return <RelatedVideosShel />
  }

  return (
    <div
      className={`w-full min-w-0 ${
        isSidebarCol ? 'max-w-[402px] px-1' : 'px-3 sm:px-4 pt-2'
      }`}
    >
      <h3
        className={`text-white font-semibold mb-3 ${
          isSidebarCol ? 'text-sm px-1' : 'text-base'
        }`}
      >
        Related videos
      </h3>

      {error && !videos.length ? (
        <div className="rounded-xl border border-[#272727] bg-[#181818] px-4 py-8 text-center">
          <i className="fa-regular fa-circle-xmark text-2xl text-[#555] mb-2"></i>
          <p className="text-sm text-[#aaa]">{error}</p>
        </div>
      ) : !videos.length ? (
        <div className="rounded-xl border border-[#272727] bg-[#181818] px-4 py-8 text-center">
          <i className="fa-solid fa-film text-2xl text-[#555] mb-2"></i>
          <p className="text-sm text-[#aaa]">No related long-form videos for this topic.</p>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-0.5">
          {videos.map((item, idx) => (
            <RelatedVidosCard
              key={`${item.id?.videoId || item.id}-${idx}`}
              setupdate={setupdate}
              item={item}
              compact={isSidebarCol}
            />
          ))}
          <div ref={sentinelRef} className="h-8" />
          {loadingMore ? (
            <p className="text-center text-[#aaa] text-xs py-3">Loading more…</p>
          ) : hasMore ? (
            <button
              type="button"
              onClick={onLoadMore}
              className="my-2 py-2 text-sm text-[#3ea6ff] hover:underline"
            >
              Show more
            </button>
          ) : (
            <p className="text-center text-[#555] text-xs py-3">You&apos;re all caught up</p>
          )}
        </div>
      )}
    </div>
  )
}

export default RelatedVideos
