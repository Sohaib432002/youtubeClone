import { useContext, useMemo } from 'react'
import { ThemeContext } from '../../Hooks/ThemeContext'
import RelatedVideosShel from './subComponents/RelatedVideosShel'
import RelatedVidosCard from './subComponents/RelatedVidosCard'

const RelatedVideos = ({ randomVideosData, setupdate }) => {
  const { windowResize } = useContext(ThemeContext)
  const isSidebar = windowResize >= 1170

  const videos = useMemo(() => {
    const list = randomVideosData?.items || []
    return list.filter((item) => {
      const id = item?.id?.videoId || (typeof item?.id === 'string' ? item.id : null)
      return id && item?.snippet
    })
  }, [randomVideosData])

  if (!videos.length) {
    return <RelatedVideosShel windowResize={windowResize} />
  }

  return (
    <div
      className={`w-full min-w-0 ${
        isSidebar ? 'max-w-[402px] px-1' : 'px-3 sm:px-4'
      }`}
    >
      <h3 className={`text-white font-semibold mb-2 ${isSidebar ? 'text-sm px-1' : 'text-base'}`}>
        Related videos
      </h3>
      {/* Always a single-column flex list — one video per full row */}
      <div className="flex flex-col w-full gap-1">
        {videos.map((item, idx) => (
          <RelatedVidosCard
            key={`${item.id?.videoId || item.id}-${idx}`}
            setupdate={setupdate}
            item={item}
            compact={isSidebar}
          />
        ))}
      </div>
    </div>
  )
}

export default RelatedVideos
