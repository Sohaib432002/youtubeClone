import { useContext, useMemo } from 'react'
import { ThemeContext } from '../../Hooks/ThemeContext'
import RelatedVideosShel from './subComponents/RelatedVideosShel'
import RelatedVidosCard from './subComponents/RelatedVidosCard'
import { isShortSearchItem } from '../../data/mockCatalog'

const RelatedVideos = ({ randomVideosData, setupdate, loading = false, error = '' }) => {
  const { windowResize } = useContext(ThemeContext)
  const isSidebarCol = windowResize >= 1170

  const videos = useMemo(() => {
    const list = randomVideosData?.items || []
    const seen = new Set()
    return list.filter((item) => {
      const id = item?.id?.videoId || (typeof item?.id === 'string' ? item.id : null)
      if (!id || !item?.snippet) return false
      if (isShortSearchItem(item)) return false
      if (seen.has(id)) return false
      seen.add(id)
      return true
    })
  }, [randomVideosData])

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
        </div>
      )}
    </div>
  )
}

export default RelatedVideos
